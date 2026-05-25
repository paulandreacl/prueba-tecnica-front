"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  attachImagesToPosts,
  getPostsPage,
  mergePostsById,
} from "../lib/api";
import { POSTS_PER_PAGE } from "../lib/constants";
import { usePostsStore } from "../store/posts.store";
import type { Post } from "../types/post";
import { useLoadMoreOnScroll } from "./useLoadMoreOnScroll";

function filterPosts(posts: Post[], search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return posts;

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query),
  );
}

export type InfinitePostsInitialData = {
  posts: Post[];
  hasMore: boolean;
};

export default function useInfinitePosts(
  debouncedSearch = "",
  initialData?: InfinitePostsInitialData,
) {
  const pathname = usePathname();
  const loadAllPosts = usePostsStore((s) => s.loadAllPosts);
  const appendToCache = usePostsStore((s) => s.appendPosts);
  const removeFromCache = usePostsStore((s) => s.removePostById);
  const initialSnapshotRef = useRef(initialData);
  const ssrBootstrapDoneRef = useRef(false);

  const [posts, setPosts] = useState<Post[]>(initialData?.posts ?? []);
  const [page, setPage] = useState(initialData?.posts.length ? 1 : 0);
  const [hasNextPage, setHasNextPage] = useState(initialData?.hasMore ?? true);
  const [isLoading, setIsLoading] = useState(!initialData?.posts.length);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalFiltered, setTotalFiltered] = useState(0);

  const fetchingRef = useRef(false);
  const searchSourceRef = useRef<Post[]>([]);
  const isSearching = debouncedSearch.trim().length > 0;

  const syncVisibleFromStore = useCallback(
    (source: Post[]) => {
      if (!source.length) return;

      if (isSearching) {
        const filtered = mergePostsById(
          filterPosts(source, debouncedSearch),
        );
        searchSourceRef.current = filtered;
        setTotalFiltered(filtered.length);
        setPosts((prev) => {
          const take = Math.max(prev.length, POSTS_PER_PAGE);
          const visible = filtered.slice(0, take);
          setHasNextPage(filtered.length > visible.length);
          return visible;
        });
        return;
      }

      const sorted = mergePostsById(source);
      setPosts((prev) => {
        const take = Math.max(prev.length, POSTS_PER_PAGE);
        const visible = sorted.slice(0, take);
        setHasNextPage(sorted.length > visible.length);
        return visible;
      });
    },
    [debouncedSearch, isSearching],
  );

  const loadFirstPage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPosts([]);
    setPage(0);
    setHasNextPage(true);
    fetchingRef.current = false;

    try {
      if (isSearching) {
        await loadAllPosts();
        const filtered = mergePostsById(
          filterPosts(usePostsStore.getState().posts, debouncedSearch),
        );
        searchSourceRef.current = filtered;
        setTotalFiltered(filtered.length);

        const chunk = filtered.slice(0, POSTS_PER_PAGE);
        setPosts(chunk);
        setPage(1);
        setHasNextPage(chunk.length < filtered.length);
        return;
      }

      searchSourceRef.current = [];
      const { posts: chunk, hasMore } = await getPostsPage(0);
      const first = mergePostsById(chunk);
      appendToCache(first);
      setPosts(first);
      setPage(1);
      setHasNextPage(hasMore);
      setTotalFiltered(0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setPosts([]);
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  }, [appendToCache, debouncedSearch, loadAllPosts, isSearching]);

  useEffect(() => {
    if (
      !debouncedSearch.trim() &&
      initialSnapshotRef.current?.posts.length &&
      !ssrBootstrapDoneRef.current
    ) {
      ssrBootstrapDoneRef.current = true;
      const cached = usePostsStore.getState().posts;
      const fromSsr = attachImagesToPosts(initialSnapshotRef.current.posts);
      const merged = mergePostsById(cached, fromSsr);
      const firstPage = merged.slice(0, POSTS_PER_PAGE);
      usePostsStore.setState({ posts: merged });
      setPosts(firstPage);
      setPage(1);
      setHasNextPage(merged.length > POSTS_PER_PAGE);
      setIsLoading(false);
      return;
    }

    void loadFirstPage();
  }, [debouncedSearch, loadFirstPage]);

  useEffect(() => {
    if (isSearching) return;
    loadAllPosts().catch(() => {});
  }, [loadAllPosts, isSearching]);

  useEffect(() => {
    if (pathname !== "/listado") return;

    const runSync = () => {
      if (isLoading) return;
      const source = usePostsStore.getState().posts;
      if (!source.length) return;
      syncVisibleFromStore(source);
    };

    const frame = requestAnimationFrame(runSync);
    const unsub = usePostsStore.subscribe((state, prev) => {
      if (state.posts === prev.posts) return;
      runSync();
    });
    return () => {
      cancelAnimationFrame(frame);
      unsub();
    };
  }, [pathname, isLoading, syncVisibleFromStore]);

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isLoading || fetchingRef.current) return;

    fetchingRef.current = true;
    setIsFetchingNextPage(true);

    try {
      if (isSearching) {
        const source = searchSourceRef.current;
        const start = page * POSTS_PER_PAGE;
        const chunk = source.slice(start, start + POSTS_PER_PAGE);

        if (!chunk.length) {
          setHasNextPage(false);
          return;
        }

        setPosts((prev) => mergePostsById(prev, chunk));
        const nextPage = page + 1;
        setPage(nextPage);
        setHasNextPage(nextPage * POSTS_PER_PAGE < source.length);
        return;
      }

      const { posts: chunk, hasMore } = await getPostsPage(page);
      const nextChunk = mergePostsById(chunk);

      if (!nextChunk.length) {
        setHasNextPage(false);
        return;
      }

      appendToCache(nextChunk);
      setPosts((prev) => mergePostsById(prev, nextChunk));
      setPage((p) => p + 1);
      setHasNextPage(hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      fetchingRef.current = false;
      setIsFetchingNextPage(false);
    }
  }, [
    appendToCache,
    hasNextPage,
    isLoading,
    isSearching,
    page,
  ]);

  const loadMoreRef = useLoadMoreOnScroll(
    fetchNextPage,
    hasNextPage && !isLoading,
  );

  const removePost = useCallback(
    (id: number) => {
      removeFromCache(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      searchSourceRef.current = searchSourceRef.current.filter(
        (p) => p.id !== id,
      );
      setTotalFiltered((n) => Math.max(0, n - 1));
    },
    [removeFromCache],
  );

  return {
    posts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    loadMoreRef,
    totalFiltered: isSearching ? totalFiltered : posts.length,
    totalLoaded: posts.length,
    isSearching,
    removePost,
  };
}
