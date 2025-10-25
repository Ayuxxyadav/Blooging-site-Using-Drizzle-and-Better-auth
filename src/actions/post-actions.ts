'use server'
import { auth } from "@/lib/auth"
import { slugify } from "@/lib/utils"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { eq, and, ne } from "drizzle-orm"
import { posts } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"

// ----- Create Post -----
export async function createPost(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session || !session?.user) {
      return {
        success: false,
        message: 'You must be logged in to create a post'
      }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string

    // Validate required fields
    if (!title || !description || !content) {
      return {
        success: false,
        message: 'All fields are required'
      }
    }

    const slug = slugify(title)

    // Check for duplicate slug
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.slug, slug)
    })

    if (existingPost) {
      return {
        success: false,
        message: 'A post with the same title already exists! Please try with a different one'
      }
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title, 
        description,
        content,
        slug,
        authorId: session.user.id
      })
      .returning()

    revalidatePath('/')
    revalidatePath(`/post/${slug}`)
    revalidatePath('/profile')

    return {
      success: true,
      message: "Post created successfully",
      slug
    }
  } catch (error) {
    console.error(error, 'failed to add')
    return {
      success: false,
      message: 'Failed to create post. Please try again.'
    }
  }
}

// ----- Edit Post -----
export async function editPost(postId: number, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to edit a post!'
      }
    }

    // Get form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string

    // Validate required fields
    if (!title || !description || !content) {
      return {
        success: false,
        message: 'All fields are required'
      }
    }

    const slug = slugify(title)

    // Only find conflicting post if its slug matches and it's NOT the current post
    const existingPost = await db.query.posts.findFirst({
      where: and(
        eq(posts.slug, slug),
        ne(posts.id, postId)
      )
    })

    if (existingPost) {
      return {
        success: false,
        message: 'A post with the same title already exists! Please try with a different one'
      }
    }

    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId)
    })

    if (post?.authorId !== session.user.id) {
      return {
        success: false,
        message: 'You can only edit your own posts'
      }
    }

    await db.update(posts).set({
      title,
      description,
      content,
      slug,
      updatedAt: new Date()
    }).where(eq(posts.id, postId))

    revalidatePath('/')
    revalidatePath(`/post/${slug}`)
    revalidatePath('/profile')

    return {
      success: true,
      message: 'Post edited successfully',
      slug
    }
  } catch (error) {
    console.error(error, 'failed to edit')
    return {
      success: false,
      message: "Failed to edit Post"
    }
  }
}

// ----- Delete Post -----
export async function deletePost(postId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session || !session.user) {
      return {
        success: false,
        message: 'You must be logged in to delete a post!'
      }
    }

    // Check if post exists and belongs to the user
    const postToDelete = await db.query.posts.findFirst({
      where: eq(posts.id, postId)
    });

    if (!postToDelete) {
      return {
        success: false,
        message: "Post not found."
      }
    }

    if (postToDelete.authorId !== session.user.id) {
      return {
        success: false,
        message: 'You can only delete your own posts'
      }
    }

    await db.delete(posts).where(eq(posts.id, postId))

    revalidatePath('/')
    revalidatePath('/profile')

    return {
      success: true,
      message: "Post deleted successfully"
    }
  } catch (error) {
    console.error(error, 'failed to delete')
    return {
      success: false,
      message: "Failed to delete post"
    }
  }
}
