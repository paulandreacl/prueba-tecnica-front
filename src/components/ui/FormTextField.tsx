"use client";

import { FieldError, Input, TextArea, TextField } from "@heroui/react";
import FormSection from "@/components/ui/FormSection";
import SectionLabel from "@/components/ui/SectionLabel";

type FormTextFieldProps = {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
};

export default function FormTextField({
  label,
  value,
  error,
  onChange,
  onBlur,
  placeholder,
  multiline = false,
  rows = 8,
}: FormTextFieldProps) {
  const showError = Boolean(error);

  return (
    <FormSection>
      <SectionLabel>{label}</SectionLabel>
      <TextField
        isRequired
        fullWidth
        isInvalid={showError}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-label={label}
      >
        {multiline ? (
          <TextArea placeholder={placeholder} rows={rows} />
        ) : (
          <Input placeholder={placeholder} />
        )}
        {showError && error ? <FieldError>{error}</FieldError> : null}
      </TextField>
    </FormSection>
  );
}
