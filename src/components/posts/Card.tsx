import Link from "next/link";
import { Card as HeroCard } from "@heroui/react";
import { Post } from "../../types/post";
import Actions from "./Actions";
import Thumbnail from "./Thumbnail";

type CardProps = {
  post: Post;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function Card({ post, onView, onEdit, onDelete }: CardProps) {
  const detailHref = `/detalle/${post.id}`;

  return (
    <HeroCard className="w-full">
      <div className="flex items-start gap-3">
        <Link
          href={detailHref}
          className="block shrink-0 no-underline"
          aria-label={`Ver detalle de ${post.title}`}
        >
          <Thumbnail
            postId={post.id}
            imageUrl={post.imageUrl}
            title={post.title}
            variant="card"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-start gap-2">
            <Link
              href={detailHref}
              className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold leading-snug text-foreground no-underline hover:underline"
            >
              {post.title}
            </Link>
            <div className="shrink-0">
              <Actions onView={onView} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </div>
          <p className="m-0 line-clamp-3 text-[0.8125rem] leading-snug text-zinc-500">
            {post.body}
          </p>
        </div>
      </div>
    </HeroCard>
  );
}
