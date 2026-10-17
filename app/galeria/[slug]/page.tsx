import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildImageUrl,
  findFolderBySlug,
  getAllFolderSlugs,
  getGalleryData,
  listFolderFiles,
} from "@/lib/gallery";
import PhotoViewer from "@/components/photo-viewer";

export function generateStaticParams() {
  return getAllFolderSlugs().map((slug) => ({ slug }));
}

export default function GalleryCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  return <GalleryCollectionPageInner params={params} />;
}

async function GalleryCollectionPageInner({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gallery = await getGalleryData();
  const folder = findFolderBySlug(slug, gallery);

  if (!folder) {
    notFound();
  }

  const files = listFolderFiles(folder).map((image) => ({
    ...image,
    // keep original URL for full view; provide a thumb for the grid
    url: image.url,
    thumbUrl: buildImageUrl(image.url, 600),
  }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <section>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-stone-400">Colección</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">{folder.name}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-stone-300">
            <Link href="/galeria" className="transition hover:text-white">← Volver a galerías</Link>
            <Link href="/" className="transition hover:text-white">Inicio</Link>
          </div>
        </div>

        {/* PhotoViewer handles grid, thumbnails (through thumbUrl) and full-screen viewer using the image-proxy */}
        <PhotoViewer data={{ id: folder.id, name: folder.name, folders: folder.folders ?? [], files }} />
      </section>
    </main>
  );
}
