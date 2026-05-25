import ActionLink from "@/components/ui/ActionLink";
import BackLink from "@/components/ui/BackLink";
import FormSection from "@/components/ui/FormSection";
import PageContent from "@/components/ui/PageContent";
import SectionLabel from "@/components/ui/SectionLabel";
import Thumbnail from "@/components/posts/Thumbnail";
import type { Post } from "@/types/post";

type DetailViewProps = {
  post: Post;
};

export default function DetailView({ post }: DetailViewProps) {
  return (
    <PageContent>
      <BackLink href="/listado">← Volver al listado</BackLink>

      <FormSection>
        <SectionLabel>Título</SectionLabel>
        <p className="text-lg font-semibold leading-snug text-foreground">
          {post.title}
        </p>
      </FormSection>

      <FormSection>
        <SectionLabel>Descripción</SectionLabel>
        <p className="whitespace-pre-wrap break-words text-base leading-relaxed text-foreground">
          {post.body}
        </p>
      </FormSection>

      <Thumbnail
        postId={post.id}
        imageUrl={post.imageUrl}
        title={post.title}
        variant="detail"
        priority
      />

      <div className="flex flex-wrap gap-2">
        <ActionLink href="/listado" variant="secondary">
          Listado
        </ActionLink>
        <ActionLink href={`/editar/${post.id}`}>Editar</ActionLink>
      </div>
    </PageContent>
  );
}
