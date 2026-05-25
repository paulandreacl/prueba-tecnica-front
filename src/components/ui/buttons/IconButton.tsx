"use client";

import { Button } from "@heroui/react";
import type { ButtonRootProps } from "@heroui/react";

type IconButtonProps = {
  children: React.ReactNode;
  "aria-label": string;
} & Pick<ButtonRootProps, "onPress" | "variant" | "isDisabled">;

export function IconButton({
  children,
  onPress,
  variant = "tertiary",
  isDisabled,
  "aria-label": ariaLabel,
}: IconButtonProps) {
  return (
    <Button
      isIconOnly
      size="sm"
      variant={variant}
      onPress={onPress}
      isDisabled={isDisabled}
      aria-label={ariaLabel}
    >
      <span className="inline-flex size-4 items-center justify-center [&_svg]:size-4">
        {children}
      </span>
    </Button>
  );
}
