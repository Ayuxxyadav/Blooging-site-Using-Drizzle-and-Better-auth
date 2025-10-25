import { db } from "."
import { desc } from "drizzle-orm"
import { posts } from "./schema"
import { eq } from "drizzle-orm";

export async function getAllPosts() {
    try {
        const allPosts = await db.query.posts.findMany({
            orderBy: [desc(posts.createdAt)],
            with: {  
                author: true
            }
        });
        return allPosts
    } catch (error) {
        console.error('Error fetching posts:', error)
        return []  // return empty array on error
    }
}
export async function getPostBySlug(slug:string) {
    try {
        const post = await db.query.posts.findFirst({
            where: eq(posts.slug, slug),
            with: {
                author: true
            }
        })
        return post
    } catch (error) {
        console.log(error);
        
    }
}