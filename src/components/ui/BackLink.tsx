import Link from "next/link";
import type { ReactNode } from "react";
import { classNames } from "@/lib/utils";

type BackLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function BackLink({ href, children, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={classNames(
        "text-sm text-zinc-500 no-underline hover:text-foreground hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
