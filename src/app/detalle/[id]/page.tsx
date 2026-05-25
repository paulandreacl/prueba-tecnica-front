import DetailLoader from "@/components/posts/DetailLoader";

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailPage({ params }: DetailPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return <p className="text-foreground">Publicación no encontrada.</p>;
  }

  return <DetailLoader key={id} id={id} />;
}
