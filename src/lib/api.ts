import type { Post, PostFormData } from "../types/post";
import {
  API_BASE,
  POSTS_PER_PAGE,
  STORAGE_IMAGES_KEY,
  STORAGE_KEY,
} from "./constants";

async function fetchAllFromApi(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/posts`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("No se pudieron cargar las publicaciones");
  }
  return res.json();
}

function readImageMap(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const raw = localStorage.getItem(STORAGE_IMAGES_KEY);
  if (!raw) return {};

  try {
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function saveImageMap(map: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_IMAGES_KEY, JSON.stringify(map));
}

function setPostImage(id: number, imageUrl: string | null) {
  const map = readImageMap();
  const key = String(id);

  if (imageUrl) {
    map[key] = imageUrl;
  } else {
    delete map[key];
  }

  saveImageMap(map);
}

function stripPostForStorage(post: Post): Post {
  const { id, title, body } = post;
  return { id, title, body };
}

function readLocalPosts(): Post[] | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return null;

    let migrated = false;
    const imageMap = readImageMap();

    const cleaned = data.map((item: Post) => {
      if (!item?.imageUrl) return stripPostForStorage(item);

      imageMap[String(item.id)] = item.imageUrl;
      migrated = true;
      return stripPostForStorage(item);
    });

    if (migrated) {
      saveImageMap(imageMap);
      saveLocalPosts(cleaned);
    }

    return cleaned;
  } catch {
    return null;
  }
}

function saveLocalPosts(posts: Post[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(posts.map(stripPostForStorage)),
  );
}

function withImage(post: Post): Post {
  const imageUrl = readImageMap()[String(post.id)];
  return imageUrl ? { ...post, imageUrl } : post;
}

export function attachImagesToPosts(posts: Post[]): Post[] {
  return posts.map(withImage);
}

export function sortPostsNewestFirst(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.id - a.id);
}

export function mergePostsById(...groups: Post[][]): Post[] {
  const byId = new Map<number, Post>();
  for (const group of groups) {
    for (const post of group) {
      byId.set(post.id, post);
    }
  }
  return sortPostsNewestFirst([...byId.values()]);
}

async function ensurePosts(): Promise<Post[]> {
  const cached = readLocalPosts();
  if (cached) return cached;

  const posts = await fetchAllFromApi();
  saveLocalPosts(posts);
  return posts;
}

function getLocalId(posts: Post[]) {
  if (!posts.length) return 1;
  return Math.max(...posts.map((p) => p.id)) + 1;
}

export async function getAllPosts() {
  return attachImagesToPosts(
    sortPostsNewestFirst(await ensurePosts()),
  );
}

async function fetchPostsPageFromApi(
  page: number,
  limit: number,
): Promise<Post[]> {
  const res = await fetch(
    `${API_BASE}/posts?_page=${page + 1}&_limit=${limit}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error("No se pudieron cargar las publicaciones");
  }
  return res.json();
}

export async function getPostsPage(
  page: number,
  limit = POSTS_PER_PAGE,
): Promise<{ posts: Post[]; hasMore: boolean }> {
  const cached = readLocalPosts();
  if (cached) {
    const sorted = sortPostsNewestFirst(cached);
    const start = page * limit;
    const posts = attachImagesToPosts(sorted.slice(start, start + limit));
    return {
      posts,
      hasMore: start + posts.length < sorted.length,
    };
  }

  const posts = attachImagesToPosts(
    sortPostsNewestFirst(await fetchPostsPageFromApi(page, limit)),
  );
  return {
    posts,
    hasMore: posts.length >= limit,
  };
}

export async function getPost(id: number) {
  const posts = await ensurePosts();
  const post = posts.find((p) => p.id === id);
  return post ? withImage(post) : undefined;
}

export async function createPost(data: PostFormData) {
  if (!data.imageUrl) {
    throw new Error("La imagen es obligatoria.");
  }

  const posts = await ensurePosts();
  const post: Post = {
    id: getLocalId(posts),
    title: data.title,
    body: data.body,
  };

  saveLocalPosts([post, ...posts]);
  setPostImage(post.id, data.imageUrl);

  return withImage(post);
}

export async function updatePost(id: number, data: PostFormData) {
  const posts = await ensurePosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Post = {
    ...posts[index],
    title: data.title,
    body: data.body,
  };

  if (data.imageUrl) {
    setPostImage(id, data.imageUrl);
  }

  const next = [updated, ...posts.filter((p) => p.id !== id)];
  saveLocalPosts(next);
  return withImage(updated);
}

export async function deletePost(id: number) {
  const posts = await ensurePosts();
  setPostImage(id, null);
  saveLocalPosts(posts.filter((p) => p.id !== id));
  return true;
}
