import { create } from "zustand";
import * as postsApi from "../lib/api";
import type { Post, PostFormData } from "../types/post";

type PostsState = {
  posts: Post[];
  loadAllPosts: () => Promise<void>;
  appendPosts: (posts: Post[]) => void;
  removePostById: (id: number) => void;
  upsertPost: (post: Post) => void;
  addPostFirst: (post: Post) => void;
  createPost: (data: PostFormData) => Promise<Post | undefined>;
  updatePost: (id: number, data: PostFormData) => Promise<Post | null>;
  deletePost: (id: number) => Promise<void>;
};

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],

  loadAllPosts: async () => {
    const posts = await postsApi.getAllPosts();
    set({ posts });
  },

  appendPosts: (incoming) =>
    set((state) => ({
      posts: postsApi.mergePostsById(state.posts, incoming),
    })),

  removePostById: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    })),

  upsertPost: (post) =>
    set((state) => ({
      posts: postsApi.mergePostsById([post], state.posts),
    })),

  addPostFirst: (post) =>
    set((state) => ({
      posts: postsApi.mergePostsById([post], state.posts),
    })),

  createPost: async (data) => {
    const post = await postsApi.createPost(data);
    if (post) get().addPostFirst(post);
    return post;
  },

  updatePost: async (id, data) => {
    const updated = await postsApi.updatePost(id, data);
    if (updated) get().upsertPost(updated);
    return updated;
  },

  deletePost: async (id) => {
    await postsApi.deletePost(id);
    get().removePostById(id);
  },
}));
