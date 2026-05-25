"use client";

import { Header } from "@heroui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "../../lib/constants";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/listado", label: "Listado" },
  { href: "/nuevo", label: "Nuevo post" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Header className="sticky top-0 z-50 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
      <nav
        className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3"
        aria-label="Principal"
      >
        <NextLink href="/" className="text-lg font-semibold text-foreground no-underline">
          {APP_NAME}
        </NextLink>

        <div className="flex flex-wrap gap-1">
          {navLinks.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <NextLink
                key={href}
                href={href}
                className={
                  active
                    ? "inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white no-underline"
                    : "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-foreground no-underline hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }
                aria-current={active ? "page" : undefined}
              >
                {label}
              </NextLink>
            );
          })}
        </div>
      </nav>
    </Header>
  );
}
