import type { ReactNode } from "react";
import { classNames } from "@/lib/utils";

type PageContentProps = {
  children: ReactNode;
  className?: string;
};

export default function PageContent({ children, className }: PageContentProps) {
  return (
    <main
      className={classNames(
        "flex w-full max-w-full flex-col gap-5",
        className,
      )}
    >
      {children}
    </main>
  );
}
