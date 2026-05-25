import NextImage from "next/image";
import { isLocalImageSrc, resolvePostImageSrc } from "@/lib/images";

type ThumbnailProps = {
  postId?: number;
  imageUrl?: string | null;
  title: string;
  variant?: "card" | "detail";
  priority?: boolean;
};

const CARD_THUMB = 88;
const DETAIL_IMAGE = { width: 800, height: 320 };

export default function Thumbnail({
  postId,
  imageUrl,
  title,
  variant = "card",
  priority = false,
}: ThumbnailProps) {
  const alt = `Imagen de la publicación: ${title}`;
  const srcOpts = { imageUrl, postId };

  if (variant === "detail") {
    const { width, height } = DETAIL_IMAGE;
    const src = resolvePostImageSrc(srcOpts, width, height);
    return (
      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-foreground/10 bg-zinc-100 [&>span]:!absolute [&>span]:!inset-0 [&>span]:!h-full [&>span]:!max-h-none [&>span]:!max-w-none [&>span]:!w-full">
        <NextImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          unoptimized={isLocalImageSrc(src)}
          sizes="(max-width: 800px) 100vw, 800px"
          className="object-cover"
        />
      </div>
    );
  }

  const src = resolvePostImageSrc(srcOpts, CARD_THUMB, CARD_THUMB);
  return (
    <div className="relative h-[5.5rem] w-[5.5rem] overflow-hidden rounded-lg bg-zinc-100 [&>span]:!absolute [&>span]:!inset-0 [&>span]:!h-full [&>span]:!max-h-none [&>span]:!max-w-none [&>span]:!w-full">
      <NextImage
        src={src}
        alt={alt}
        fill
        loading="lazy"
        unoptimized={isLocalImageSrc(src)}
        sizes={`${CARD_THUMB}px`}
        className="object-cover"
      />
    </div>
  );
}
