import { API_BASE, POSTS_PER_PAGE } from "./constants";
import type { Post } from "../types/post";

const REVALIDATE_SECONDS = 60;

export async function fetchPostsPageServer(
  page: number,
  limit = POSTS_PER_PAGE,
): Promise<{ posts: Post[]; hasMore: boolean }> {
  const res = await fetch(
    `${API_BASE}/posts?_page=${page + 1}&_limit=${limit}`,
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  if (!res.ok) {
    throw new Error("No se pudieron cargar las publicaciones");
  }

  const posts: Post[] = await res.json();
  return {
    posts,
    hasMore: posts.length >= limit,
  };
}
