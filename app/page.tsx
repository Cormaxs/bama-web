import Image from "next/image";
import Link from "next/link";
import {
  buildImageUrl,
  getAllGalleryImages,
  getGalleryCollections,
  getGalleryData,
} from "@/lib/gallery";
import FaqAccordion from "@/components/faq-accordion";
import HeroCarousel from "@/components/hero-carousel";


export default async function Home() {
  const gallery = await getGalleryData();
  const collections = getGalleryCollections(gallery);
  const firstImages = getAllGalleryImages(gallery);

  // Build a flat list of all images across collections for the carousel
  const carouselImages = collections.flatMap((c) =>
    (c.files || []).map((file) => ({
      id: file.id,
      name: file.name,
      url: buildImageUrl(file.url, 1600),
      albumSlug: c.slug,
    }))
  );

  return (
    <div className="bg-stone-950 text-stone-100">
      <main id="inicio">
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-16">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-stone-700 bg-stone-900/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-stone-300">
              Fotografía · paisajes · retratos 
            </p>

            <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl">
              Descubre el Mundo a Través de Mi Lente
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-300">Fotografía con criterio.</p>

          

            
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <HeroCarousel images={carouselImages} />
            </div>
          </div>
        </section>

        <section id="colecciones" className="border-y border-stone-800 bg-[#f3f4f6] py-20 text-[#14110f]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#585b72]">Colecciones</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#14110f] sm:text-4xl">
                  Un poco de mi trabajo
                </h2>
              </div>
              <Link href="/galeria" className="text-sm text-[#24252d] transition hover:text-[#14110f]">
                Ver todas →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/galeria/${collection.slug}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-[#dfe2ea] bg-white shadow-[0_8px_24px_rgba(20,17,15,0.06)]"
                >
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={buildImageUrl(collection.files[0]?.url ?? firstImages[0]?.url ?? "", 900)}
                      alt={collection.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#585b72]">Álbum</p>
                    <h3 className="text-xl font-medium text-[#14110f]">{collection.name}</h3>
                    <p className="text-sm text-[#2d2f3a]">{collection.files.length} imágenes</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[1.75rem] border border-stone-800 bg-stone-900/60 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-400">Cobertura</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Catamarca y Tucumán
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-7 text-[#e3d8cf] sm:text-[15px]">
                <div className="rounded-2xl border border-[#3b2c27] bg-[#1d1714] p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d6b9a7]">Disponibilidad</p>
                  <p className="mt-2 text-sm font-medium text-[#f7f1eb]">Sesiones por provincia y viajes de trabajo coordinados.</p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-[#3b2c27] bg-[#171310]">
                <div className="h-56 w-full bg-[#171310] sm:h-64">
                  <iframe
                    title="Mapa de Catamarca y Tucumán"
                    src="https://www.google.com/maps?q=Catamarca+Tucum%C3%A1n+Argentina&z=7&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.18em] text-stone-400">
                  <span>Región norte</span>
                  <a
                    href="https://www.openstreetmap.org/#map=7/-27.274/-66.400"
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-200 transition hover:text-white"
                  >
                    Ver mapa
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:pl-2">
              <FaqAccordion
                items={[
                  {
                    question: "¿Cuál es el tiempo de entrega?",
                    answer:
                      "Dependiendo del servicio contratado, la entrega de hasta 300 fotos se realizará en un máximo de cinco días hábiles. Para eventos con mayores requerimientos, el plazo máximo es de 15 días.",
                  },
                  {
                    question: "¿Cómo se entrega el material?",
                    answer:
                      "Los archivos se entregan de manera digital a través de un link de Google Fotos. Se recomienda descargar la carpeta completa, ya que los archivos solo se guardarán por un mes. Las fotos y fotolibros impresos tienen un costo adicional.",
                  },
                  {
                    question: "¿Puedo pedir presupuesto y cuánto tiempo es válido?",
                    answer:
                      "Sí, podés solicitar un presupuesto de forma gratuita, que será válido por dos meses, a menos que congeles el precio con el pago de una seña.",
                  },
                  {
                    question: "¿Puedo cambiar la fecha?",
                    answer:
                      "Es posible reprogramar la fecha y/u hora de la sesión bajo ciertas condiciones. Deberás presentar motivos válidos y coordinar la disponibilidad horaria de ambas partes.",
                  },
                  {
                    question: "¿Qué pasa si la fotógrafa no puede asistir al evento?",
                    answer:
                      "Si por algún motivo no puedo asistir, se contratará a otro profesional del mismo nivel y por el mismo valor.",
                  },
                  {
                    question: "¿Si llego tarde a una sesión cuánto tiempo me esperan?",
                    answer:
                      "Se espera un máximo de 15 minutos. Pasado ese tiempo, la fotógrafa puede cancelar la sesión sin derecho a devolución de la seña.",
                  },
                  {
                    question: "¿Puedo hacer consultas en horarios no comerciales?",
                    answer:
                      "Podés hacer consultas fuera del horario comercial (9 a 12 hs y 17 a 21 hs). Sin embargo, es posible que la respuesta no sea inmediata.",
                  },
                  {
                    question: "¿Puedo cancelar?",
                    answer:
                      "En caso de cancelación, debés avisar con un mínimo de 48 horas de anticipación. De no ser así, perderás la seña y la sesión.",
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* portfolio removed per user request to avoid image saturation */}
      </main>

      
    </div>
  );
}
