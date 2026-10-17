import Image from "next/image";
import Link from "next/link";
import {
  buildImageUrl,
  getAllGalleryImages,
  getGalleryCollections,
  getGalleryData,
} from "@/lib/gallery";

export default async function GaleriaPage() {
  const gallery = await getGalleryData();
  const collections = getGalleryCollections(gallery);
  const allImages = getAllGalleryImages(gallery).map((image) => ({
    ...image,
    url: buildImageUrl(image.url, 600),
  }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/galeria/${collection.slug}`}
            className="group overflow-hidden rounded-[1.75rem] border border-stone-800 bg-stone-950"
          >
            <div className="relative h-80 overflow-hidden">
              <Image
                src={buildImageUrl(collection.files[0]?.url ?? allImages[0]?.url ?? "", 900)}
                alt={collection.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-3 p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">Colección</p>
              <h2 className="text-2xl font-medium text-white">{collection.name}</h2>
              <p className="text-sm text-stone-300">{collection.files.length} fotografías</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Instantáneas / quick selection removed per user request to reduce image saturation */}
    </main>
  );
}
