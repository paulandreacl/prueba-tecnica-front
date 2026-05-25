"use client";

import { useRouter } from "next/navigation";
import Form from "@/components/posts/Form";
import PageContent from "@/components/ui/PageContent";
import PageTitle from "@/components/ui/PageTitle";
import {
  notifyPostCreated,
  notifyPostError,
  POST_ERROR,
} from "@/lib/postToasts";
import { usePostsStore } from "@/store/posts.store";
import type { PostFormData } from "@/types/post";

export default function NewPage() {
  const router = useRouter();
  const createPost = usePostsStore((s) => s.createPost);

  async function handleCreate(data: PostFormData) {
    try {
      const post = await createPost(data);
      if (post) {
        notifyPostCreated(post.title);
        router.push("/listado");
      }
    } catch (err) {
      notifyPostError(
        err instanceof Error ? err.message : POST_ERROR.create,
      );
    }
  }

  return (
    <PageContent>
      <PageTitle>Nuevo post</PageTitle>
      <Form onSubmit={handleCreate} submitLabel="Crear publicación" />
    </PageContent>
  );
}
