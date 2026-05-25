"use client";

import { Button, Modal } from "@heroui/react";

type ConfirmModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
  tone?: "danger" | "default";
};

export default function ConfirmModal({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  isPending = false,
  tone = "default",
}: ConfirmModalProps) {
  const isDanger = tone === "danger";

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isPending}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[360px]">
          <Modal.Header className="flex-col items-start gap-1 pb-0">
            <Modal.Heading className="text-lg font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="pt-2 text-muted">{description}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close" isDisabled={isPending}>
              {cancelLabel}
            </Button>
            <Button
              variant={isDanger ? "danger" : "primary"}
              isPending={isPending}
              onPress={async () => {
                await onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
