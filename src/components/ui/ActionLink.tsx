import Link from "next/link";
import type { ReactNode } from "react";
import { classNames } from "@/lib/utils";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const variantClass: Record<NonNullable<ActionLinkProps["variant"]>, string> = {
  primary:
    "inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-blue-700",
  secondary:
    "inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-foreground no-underline hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800",
};

export default function ActionLink({
  href,
  children,
  variant = "primary",
  className,
}: ActionLinkProps) {
  return (
    <Link href={href} className={classNames(variantClass[variant], className)}>
      {children}
    </Link>
  );
}
