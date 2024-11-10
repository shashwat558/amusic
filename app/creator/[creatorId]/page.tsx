import StreamView from "@/app/components/StreamView";

interface PageProps {
  params: Promise<{
    creatorId: string;
  }>;
}

export default async function Create({ params }: PageProps) {
  const { creatorId } = await params; // Resolving the Promise for params

  return <StreamView creatorId={creatorId} playVideo={false} />;
}
