"use client";

import { useEffect, useState } from "react";
import { getPost } from "@/lib/api";
import type { Post } from "@/types/post";
import Loader from "@/components/ui/Loader";
import DetailView from "./DetailView";

type DetailLoaderProps = {
  id: number;
};

export default function DetailLoader({ id }: DetailLoaderProps) {
  const [post, setPost] = useState<Post | undefined>();
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <Loader label="Cargando publicación..." />;
  if (!post) {
    return <p className="text-foreground">Publicación no encontrada.</p>;
  }

  return <DetailView post={post} />;
}
