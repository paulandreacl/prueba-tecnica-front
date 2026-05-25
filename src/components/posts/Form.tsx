"use client";

import { Button } from "@heroui/react";
import { Form as FormikForm, Formik } from "formik";
import { useMemo } from "react";
import { FileTrigger } from "react-aria-components";
import { MAX_IMAGE_BYTES } from "@/lib/constants";
import { validatePostForm } from "@/lib/postFormValidation";
import type { PostFormData, PostFormValues } from "@/types/post";
import FormSection from "@/components/ui/FormSection";
import FormTextField from "@/components/ui/FormTextField";
import SectionLabel from "@/components/ui/SectionLabel";
import Thumbnail from "./Thumbnail";

type FormProps = {
  onSubmit: (data: PostFormData) => void | Promise<void>;
  defaultValues?: PostFormValues;
  submitLabel?: string;
  previewId?: number;
};

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("No se pudo leer la imagen."));
    };
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

function toInitialValues(defaultValues?: PostFormValues): PostFormValues {
  return {
    title: defaultValues?.title ?? "",
    body: defaultValues?.body ?? "",
    imageUrl: defaultValues?.imageUrl ?? null,
  };
}

export default function Form({
  onSubmit,
  defaultValues,
  submitLabel = "Guardar",
  previewId,
}: FormProps) {
  const initialImageUrl = defaultValues?.imageUrl ?? null;
  const formKey = defaultValues
    ? `edit-${previewId ?? "x"}-${initialImageUrl ? "stored" : "fallback"}`
    : "create";

  const initialValues = useMemo(
    () => toInitialValues(defaultValues),
    [defaultValues],
  );

  return (
    <Formik<PostFormValues>
      key={formKey}
      initialValues={initialValues}
      enableReinitialize
      validate={(values) =>
        validatePostForm(values, {
          initialImageUrl,
          requireImage: !defaultValues,
        })
      }
      onSubmit={async (values, { resetForm }) => {
        const imageUrl = values.imageUrl ?? initialImageUrl ?? undefined;
        if (!defaultValues && !imageUrl) return;

        await onSubmit({
          title: values.title.trim(),
          body: values.body.trim(),
          imageUrl: imageUrl ?? "",
        });
        if (!defaultValues) {
          resetForm();
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        submitCount,
        setFieldValue,
        setFieldTouched,
        setFieldError,
        isSubmitting,
      }) => {
        const showFieldError = (field: keyof PostFormValues) =>
          Boolean(errors[field] && (touched[field] || submitCount > 0));
        async function handleFileSelect(files: FileList | null) {
          const file = files?.[0];
          if (!file) return;

          if (!file.type.startsWith("image/")) {
            setFieldError(
              "imageUrl",
              "Selecciona un archivo de imagen (JPG, PNG, WebP…).",
            );
            setFieldTouched("imageUrl", true, false);
            return;
          }

          if (file.size > MAX_IMAGE_BYTES) {
            setFieldError("imageUrl", "La imagen es muy grande. Máximo ~800 KB.");
            setFieldTouched("imageUrl", true, false);
            return;
          }

          try {
            const dataUrl = await readImageFile(file);
            await setFieldValue("imageUrl", dataUrl);
            setFieldTouched("imageUrl", true, false);
          } catch {
            setFieldError("imageUrl", "No se pudo leer la imagen.");
            setFieldTouched("imageUrl", true, false);
          }
        }

        const showImageError = showFieldError("imageUrl");
        const previewTitle = values.title.trim() || "Vista previa";
        const hasImagePreview = Boolean(values.imageUrl || previewId);

        return (
          <FormikForm className="flex w-full max-w-full flex-col gap-6">
            <FormTextField
              label="Título"
              value={values.title}
              error={showFieldError("title") ? errors.title : undefined}
              onChange={(value) => setFieldValue("title", value)}
              onBlur={() => setFieldTouched("title", true)}
              placeholder="Título de la publicación"
            />

            <FormTextField
              label="Descripción"
              value={values.body}
              error={showFieldError("body") ? errors.body : undefined}
              onChange={(value) => setFieldValue("body", value)}
              onBlur={() => setFieldTouched("body", true)}
              placeholder="Escribe la descripción..."
              multiline
              rows={8}
            />
            <FormSection>
              <SectionLabel>
                {defaultValues ? "Imagen" : "Imagen (obligatoria)"}
              </SectionLabel>

              <div className="flex flex-wrap gap-2">
                <FileTrigger
                  acceptedFileTypes={[
                    "image/png",
                    "image/jpeg",
                    "image/webp",
                    "image/gif",
                  ]}
                  onSelect={handleFileSelect}
                >
                  <Button type="button" variant="secondary">
                    {hasImagePreview ? "Cambiar imagen" : "Seleccionar imagen"}
                  </Button>
                </FileTrigger>
              </div>

              {showImageError && errors.imageUrl && (
                <p className="m-0 text-sm text-red-600" role="alert">
                  {errors.imageUrl}
                </p>
              )}

              {hasImagePreview ? (
                <Thumbnail
                  postId={previewId}
                  imageUrl={values.imageUrl ?? initialImageUrl}
                  title={previewTitle}
                  variant="detail"
                />
              ) : (
                !showImageError && (
                  <p className="text-sm text-muted">
                    Selecciona una imagen para la publicación.
                  </p>
                )
              )}
            </FormSection>

            <Button
              type="submit"
              variant="primary"
              className="w-fit"
              isDisabled={isSubmitting}
            >
              {submitLabel}
            </Button>
          </FormikForm>
        );
      }}
    </Formik>
  );
}
