import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers";
import { getPostBySlug } from "@/lib/db/queries";

import PostForm from "@/components/post/post-form";
import Container from "@/components/layout/container";


export default async function EditPage ({
    params,
    } : {
        params: Promise <{slug:string}>
    }) {

const{slug}=await params;
const session = await auth.api.getSession({
    headers: await headers(),
});

if(!session || !session.user){
    redirect("/");
}

const post =await getPostBySlug(slug)

if(!post){
    notFound()
}

if(post.authorId !== session.user.id){
    redirect("/")
}
//@ts-ignore
return <Container>
        <div className="max-w-2xl font-bold text-4xl mb-6 mt-10">Edit Post</div>
    <PostForm
    isEditing={true}
    post={{
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content,
        slug: post.slug,
    }}
    />
</Container>


    }