"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Form from "@/components/posts/Form";
import Loader from "@/components/ui/Loader";
import BackLink from "@/components/ui/BackLink";
import PageContent from "@/components/ui/PageContent";
import PageTitle from "@/components/ui/PageTitle";
import { getPost } from "@/lib/api";
import {
  notifyPostError,
  notifyPostUpdated,
  POST_ERROR,
} from "@/lib/postToasts";
import { usePostsStore } from "@/store/posts.store";
import type { Post, PostFormData } from "@/types/post";

type EditContentProps = {
  id: number;
};

function EditContent({ id }: EditContentProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const updatePost = usePostsStore((s) => s.updatePost);

  useEffect(() => {
    let cancelled = false;

    getPost(id)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(data: PostFormData) {
    setIsSaving(true);
    try {
      const updated = await updatePost(id, data);
      if (updated) {
        notifyPostUpdated(updated.title);
        router.push("/listado");
      }
    } catch (err) {
      notifyPostError(
        err instanceof Error ? err.message : POST_ERROR.update,
      );
    } finally {
      setIsSaving(false);
    }
  }

  const formDefaults = useMemo(
    () =>
      post
        ? {
            title: post.title,
            body: post.body,
            imageUrl: post.imageUrl ?? null,
          }
        : undefined,
    [post],
  );

  if (isLoading) return <Loader label="Cargando publicación..." />;
  if (!post || !formDefaults) {
    return <p className="text-foreground">Publicación no encontrada.</p>;
  }

  return (
    <PageContent>
      <BackLink href={`/detalle/${id}`}>← Volver al detalle</BackLink>
      <PageTitle>Editar publicación</PageTitle>
      <Form
        previewId={post.id}
        defaultValues={formDefaults}
        submitLabel={isSaving ? "Guardando..." : "Guardar cambios"}
        onSubmit={handleSubmit}
      />
    </PageContent>
  );
}

export default function EditPage() {
  const params = useParams();
  const id = Number(params.id);
  const loadAllPosts = usePostsStore((s) => s.loadAllPosts);

  useEffect(() => {
    loadAllPosts().catch(() => {});
  }, [loadAllPosts]);

  if (Number.isNaN(id)) {
    return <p className="text-foreground">Publicación no encontrada.</p>;
  }

  return <EditContent key={id} id={id} />;
}
