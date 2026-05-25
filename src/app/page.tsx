import ActionLink from "@/components/ui/ActionLink";
import PageTitle from "@/components/ui/PageTitle";
import { APP_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-3">
        <PageTitle variant="hero">{APP_NAME}</PageTitle>
        <p className="max-w-prose text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Explora publicaciones desde una API pública, búscalas, créalas, edítalas
          o elimínalas. Los cambios se guardan en tu navegador para seguir
          trabajando sin perder datos.
        </p>
      </div>

      <ActionLink href="/listado" className="w-fit px-5 py-2.5">
        Ver publicaciones
      </ActionLink>
    </main>
  );
}
