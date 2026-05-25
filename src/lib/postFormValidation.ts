import type { PostFormValues } from "@/types/post";

type ValidatePostFormOptions = {
  initialImageUrl?: string | null;
  requireImage?: boolean;
};

export function validatePostForm(
  values: PostFormValues,
  options: ValidatePostFormOptions = {},
) {
  const { initialImageUrl, requireImage = true } = options;
  const errors: Partial<Record<keyof PostFormValues, string>> = {};
  const title = values.title.trim();
  const body = values.body.trim();
  const hasImage = Boolean(values.imageUrl || initialImageUrl);

  if (!title) {
    errors.title = "El título es obligatorio.";
  } else if (title.length < 3) {
    errors.title = "El título debe tener al menos 3 caracteres.";
  }

  if (!body) {
    errors.body = "La descripción es obligatoria.";
  } else if (body.length < 10) {
    errors.body = "La descripción debe tener al menos 10 caracteres.";
  }

  if (requireImage && !hasImage) {
    errors.imageUrl = "Debes subir una imagen para continuar.";
  }

  return errors;
}
