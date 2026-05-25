"use client";

import { SearchField } from "@heroui/react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
};

export default function SearchBar({
  value,
  onChange,
  isDisabled,
}: SearchBarProps) {
  return (
    <SearchField
      fullWidth
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      aria-label="Buscar publicaciones"
    >
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder="Buscar por título o contenido..." />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
