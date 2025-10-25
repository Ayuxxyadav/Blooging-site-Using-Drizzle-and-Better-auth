import { PostCardProps } from "@/lib/types"
import { Card, CardDescription, CardHeader,CardContent, CardTitle } from "../ui/card"
import Link from "next/link"
import { formDate } from "@/lib/utils"


export default function PostCard({post}:PostCardProps){
    return <Card className="h-full flex flex-col">
    <CardHeader>
        <Link className="hover:underline" href={`/post/${post.slug}`}>
        <CardTitle className="text-2xl">
         {post.title}
        </CardTitle>
        </Link>
        <CardDescription>
            By {post.author.name} -{formDate(post.createdAt)}
        </CardDescription>
        <CardContent>
            <p className="text-muted-foreground">{post.description}</p>
        </CardContent>
    </CardHeader>
    </Card>
}