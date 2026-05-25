import { toast } from "@heroui/react";

const TOAST_TIMEOUT_MS = 5000;
const ERROR_TITLE = "Ocurrió un error";

type SuccessKind = "created" | "updated" | "deleted";

const SUCCESS_COPY: Record<
  SuccessKind,
  { title: string; withTitle: (title: string) => string; fallback: string }
> = {
  created: {
    title: "Publicación creada",
    withTitle: (title) => `«${title}» se guardó correctamente.`,
    fallback: "La publicación se guardó correctamente.",
  },
  updated: {
    title: "Publicación actualizada",
    withTitle: (title) => `«${title}» se actualizó correctamente.`,
    fallback: "La publicación se actualizó correctamente.",
  },
  deleted: {
    title: "Publicación eliminada",
    withTitle: (title) => `«${title}» se eliminó correctamente.`,
    fallback: "La publicación se eliminó correctamente.",
  },
};

export const POST_ERROR = {
  create: "No se pudo crear la publicación.",
  update: "No se pudo guardar los cambios.",
  delete: "No se pudo eliminar la publicación.",
  load: "No se pudieron cargar las publicaciones.",
} as const;

function showSuccess(kind: SuccessKind, title?: string) {
  const copy = SUCCESS_COPY[kind];
  toast.success(copy.title, {
    description: title ? copy.withTitle(title) : copy.fallback,
    timeout: TOAST_TIMEOUT_MS,
  });
}

function showError(description: string) {
  toast.danger(ERROR_TITLE, {
    description,
    timeout: TOAST_TIMEOUT_MS,
  });
}

export function notifyPostCreated(title?: string) {
  showSuccess("created", title);
}

export function notifyPostUpdated(title?: string) {
  showSuccess("updated", title);
}

export function notifyPostDeleted(title?: string) {
  showSuccess("deleted", title);
}

export function notifyPostError(
  message: string = "Inténtalo de nuevo en unos momentos.",
) {
  showError(message);
}

export function notifyPostsLoadError() {
  showError(POST_ERROR.load);
}
