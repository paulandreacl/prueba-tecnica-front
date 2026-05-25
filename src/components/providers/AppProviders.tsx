"use client";

import { Toast } from "@heroui/react";

type AppProvidersProps = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {children}
      <Toast.Provider
        className="app-toast-region"
        placement="bottom"
        maxVisibleToasts={3}
      />
    </>
  );
}
