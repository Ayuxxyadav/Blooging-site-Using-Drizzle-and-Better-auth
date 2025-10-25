'use client'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { createPost, editPost } from '@/actions/post-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const postSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters long")
    .max(255, "Title must be less than 255 characters"),
  description: z.string()
    .min(5, "Description must be at least 5 characters long")
    .max(255, "Description must be less than 255 characters"),
  content: z.string()
    .min(10, "Content must be at least 10 characters long")
});

interface PostFormProps {
  isEditing?: boolean;
  post?: {
    id: number;
    title: string;
    description: string;
    content: string;
    slug: string;
  };
}

type PostFormValues = z.infer<typeof postSchema>;

export default function PostForm({ isEditing, post }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTranstion] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues:
      isEditing && post
        ? {
            title: post.title,
            description: post.description,
            content: post.content,
          }
        : {
            title: "",
            description: "",
            content: "",
          },
  });

  const onFormSumbit = async (data: PostFormValues) => {
    startTranstion(async () => {
      try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('content', data.content);

        let res;

        if (isEditing && post) {
          res = await editPost(post.id, formData);
        } else {
          res = await createPost(formData);
        }

        if (res.success) {
          toast(isEditing ? 'Post edited successfully' : "Post created successfully");
          router.push('/');
          router.refresh();
        } else {
          toast(res.message);
        }
      } catch (error) {
        toast('Failed to create post');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSumbit)} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          placeholder='Enter post title '
          {...register('title')}
          disabled={isPending}
        />
        {errors?.title && (
          <p className='text-sm text-red-700'>{errors.title.message}</p>
        )}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          placeholder='Enter a short post Description'
          {...register('description')}
          disabled={isPending}
        />
        {errors?.description && (
          <p className='text-sm text-red-700'>{errors.description.message}</p>
        )}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='content'>Content</Label>
        <Textarea
          id='content'
          className="min-h-[250px] resize-none"
          placeholder='Enter post content'
          {...register('content')}
          disabled={isPending}
        />
        {errors?.content && (
          <p className='text-sm text-red-700'>{errors.content.message}</p>
        )}
      </div>
      <div>
        <Button type='submit' disabled={isPending} className='mt-5 w-full'>
          {isPending ? 'Saving Post...' : isEditing ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}
