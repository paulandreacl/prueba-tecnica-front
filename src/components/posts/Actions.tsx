"use client";

import { Eye, Pencil, TrashBin } from "@gravity-ui/icons";
import { IconButton } from "../ui/buttons/IconButton";

type ActionsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function Actions({ onView, onEdit, onDelete }: ActionsProps) {
  return (
    <div className="flex gap-1">
      <IconButton
        variant="tertiary"
        aria-label="Ver detalle de la publicación"
        onPress={onView}
        isDisabled={!onView}
      >
        <Eye />
      </IconButton>
      <IconButton
        variant="tertiary"
        aria-label="Editar publicación"
        onPress={onEdit}
        isDisabled={!onEdit}
      >
        <Pencil />
      </IconButton>
      <IconButton
        variant="danger"
        aria-label="Eliminar publicación"
        onPress={onDelete}
        isDisabled={!onDelete}
      >
        <TrashBin />
      </IconButton>
    </div>
  );
}
