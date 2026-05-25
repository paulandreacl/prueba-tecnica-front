import type { ReactNode } from "react";
import { classNames } from "@/lib/utils";

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

const labelClass =
  "m-0 text-xs font-semibold uppercase tracking-wider text-zinc-500";

export default function SectionLabel({
  children,
  className,
}: SectionLabelProps) {
  return <p className={classNames(labelClass, className)}>{children}</p>;
}
