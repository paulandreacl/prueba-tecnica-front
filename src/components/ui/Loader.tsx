"use client";

import { Spinner } from "@heroui/react";

type LoaderProps = {
  label?: string;
};

export default function Loader({ label = "Cargando..." }: LoaderProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Spinner size="md" />
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
