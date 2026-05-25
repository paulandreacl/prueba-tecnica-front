"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  notifyPostDeleted,
  notifyPostError,
  notifyPostsLoadError,
  POST_ERROR,
} from "../../lib/postToasts";
import { usePostsStore } from "../../store/posts.store";
import useDebounce from "../../hooks/useDebounce";
import useInfinitePosts from "../../hooks/useInfinitePosts";
import type { Post } from "../../types/post";
import ConfirmModal from "../ui/ConfirmModal";
import Loader from "../ui/Loader";
import Card from "./Card";
import SearchBar from "./SearchBar";

type ListProps = {
  initialPosts?: Post[];
  initialHasMore?: boolean;
  initialLoadFailed?: boolean;
};

export default function List({
  initialPosts,
  initialHasMore,
  initialLoadFailed = false,
}: ListProps = {}) {
  const loadErrorNotifiedRef = useRef(false);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const deletePost = usePostsStore((s) => s.deletePost);
  const infiniteInitialData = useMemo(
    () =>
      initialPosts?.length
        ? { posts: initialPosts, hasMore: initialHasMore ?? true }
        : undefined,
    [initialPosts, initialHasMore],
  );
  const {
    posts,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    loadMoreRef,
    totalFiltered,
    totalLoaded,
    isSearching,
    removePost,
  } = useInfinitePosts(debouncedQuery, infiniteInitialData);

  useEffect(() => {
    if (loadErrorNotifiedRef.current) return;
    if (!initialLoadFailed && !error) return;
    loadErrorNotifiedRef.current = true;
    notifyPostsLoadError();
  }, [initialLoadFailed, error]);

  async function handleConfirmDelete() {
    if (!postToDelete) return;

    const title = postToDelete.title;
    setIsDeleting(true);
    try {
      await deletePost(postToDelete.id);
      removePost(postToDelete.id);
      setPostToDelete(null);
      notifyPostDeleted(title);
    } catch (err) {
      notifyPostError(
        err instanceof Error ? err.message : POST_ERROR.delete,
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={query}
        onChange={setQuery}
        isDisabled={isLoading}
      />

      <ConfirmModal
        isOpen={!!postToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPostToDelete(null);
        }}
        title="Eliminar publicación"
        description={
          <p>
            ¿Estás seguro de que quieres eliminar{" "}
            <strong className="text-foreground">{postToDelete?.title}</strong>?
          </p>
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        tone="danger"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
      />

      {isLoading && <Loader label="Cargando publicaciones..." />}

      {!isLoading && error && (
        <p role="alert">{POST_ERROR.load}</p>
      )}

      {!isLoading && !error && !posts.length && (
        <p>
          {isSearching
            ? "No hay publicaciones que coincidan con tu búsqueda."
            : "No hay publicaciones."}
        </p>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            {isSearching ? (
              <>
                Mostrando {totalLoaded} de {totalFiltered}{" "}
                {totalFiltered === 1 ? "resultado" : "resultados"}
              </>
            ) : (
              <>
                Mostrando {totalLoaded} publicaciones
              </>
            )}
          </p>

          {posts.map((post) => (
            <Card
              key={post.id}
              post={post}
              onView={() => router.push(`/detalle/${post.id}`)}
              onDelete={() => setPostToDelete(post)}
              onEdit={() => router.push(`/editar/${post.id}`)}
            />
          ))}

          {hasNextPage && (
            <div
              ref={loadMoreRef}
              aria-hidden
              className="infinite-scroll-container"
            />
          )}

          {isFetchingNextPage && <Loader label="Cargando más..." />}

          {!hasNextPage && (
            <p className="text-center text-sm text-muted">
              {isSearching
                ? "Fin de los resultados."
                : "Has visto todas las publicaciones."}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
