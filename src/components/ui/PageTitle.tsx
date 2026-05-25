import type { ReactNode } from "react";
import { classNames } from "@/lib/utils";

type PageTitleProps = {
  children: ReactNode;
  variant?: "default" | "hero";
  className?: string;
};

const variantClass: Record<NonNullable<PageTitleProps["variant"]>, string> = {
  default:
    "m-0 text-2xl font-bold leading-snug tracking-tight text-foreground",
  hero: "m-0 text-3xl font-bold tracking-tight text-foreground",
};

export default function PageTitle({
  children,
  variant = "default",
  className,
}: PageTitleProps) {
  return (
    <h1 className={classNames(variantClass[variant], className)}>{children}</h1>
  );
}
