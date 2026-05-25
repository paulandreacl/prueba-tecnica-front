import List from "@/components/posts/List";
import PageTitle from "@/components/ui/PageTitle";
import { fetchPostsPageServer } from "@/lib/api.server";

export const revalidate = 60;

export default async function ListPage() {
  let posts: Awaited<ReturnType<typeof fetchPostsPageServer>>["posts"] = [];
  let hasMore = true;
  let initialLoadFailed = false;

  try {
    const result = await fetchPostsPageServer(0);
    posts = result.posts;
    hasMore = result.hasMore;
  } catch {
    initialLoadFailed = true;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Listado de posts</PageTitle>
      <List
        initialPosts={posts}
        initialHasMore={hasMore && posts.length > 0}
        initialLoadFailed={initialLoadFailed}
      />
    </div>
  );
}
