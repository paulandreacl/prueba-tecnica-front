import type { ReactNode } from "react";
import { classNames } from "@/lib/utils";

type FormSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function FormSection({ children, className }: FormSectionProps) {
  return (
    <section
      className={classNames(
        "flex w-full max-w-full flex-col gap-2",
        className,
      )}
    >
      {children}
    </section>
  );
}
