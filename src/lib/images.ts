//Images API to get random images
const IMAGE_HOST = "https://picsum.photos";

export function getPostImageUrl(
  postIdOrSeed: number | string,
  width: number,
  height: number,
) {
  const seed =
    typeof postIdOrSeed === "number" ? `post-${postIdOrSeed}` : postIdOrSeed;
  return `${IMAGE_HOST}/seed/${seed}/${width}/${height}`;
}

export function resolvePostImageSrc(
  opts: {
    imageUrl?: string | null;
    postId?: number;
  },
  width: number,
  height: number,
): string {
  if (opts.imageUrl) return opts.imageUrl;
  if (opts.postId !== undefined) {
    return getPostImageUrl(opts.postId, width, height);
  }
  return getPostImageUrl("post-nuevo", width, height);
}

export function isLocalImageSrc(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}
