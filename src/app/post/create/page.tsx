import PostForm from "@/components/post/post-form";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";


export default function CreatePostPage () {
 return <div>
    <main className="py-10">
        <div className="max-w-4xl mx-auto">
         <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-bold">
                    Create New Post
                </CardTitle>
            </CardHeader>
            <CardContent>
                <PostForm/>
            </CardContent>
         </Card>
        </div>
    </main>
 </div>
}