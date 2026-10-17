import Link from "next/link";

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8 text-stone-200">
      <section className="space-y-6">
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-white">Términos y Condiciones</h1>
          <p className="mt-3 text-stone-300">Lee atentamente los términos y condiciones para comprender los derechos y responsabilidades de ambas partes.</p>
        </div>
        <div>
          <h2 className="text-2xl font-medium text-white">Propiedad Intelectual</h2>
          <p className="mt-2 text-stone-300">Todos los derechos de propiedad intelectual de los servicios brindados pertenecen exclusivamente a Bama Fotografía (Mayra Nicole Barros). Sin embargo, el cliente tendrá el derecho de uso de las imágenes por las cuales haya pagado.</p>
        </div>

        <div>
          <h2 className="text-2xl font-medium text-white">Entrega</h2>
          <p className="mt-2 text-stone-300">El material fotográfico se entregará únicamente si el pago se ha efectuado en su totalidad dentro de los plazos acordados.</p>
        </div>

        <div>
          <h2 className="text-2xl font-medium text-white">Presupuesto</h2>
          <p className="mt-2 text-stone-300">El “presupuesto base” incluye una hora de sesión presencial, tiempo de pre y postproducción, desgaste del equipo (una cámara con sus accesorios, dos objetivos intercambiables, luces y flash speedlight si es necesario), entrega del material digital, y por supuesto, el tiempo y conocimientos de la fotógrafa. Este presupuesto no incluye viáticos fuera del casco céntrico de San Fernando del Valle de Catamarca (entiéndase las cuatro avenidas), ayudantes de iluminación, segunda cámara, fotografías impresas, fotolibros ni horas extras.</p>
        </div>

        <div>
          <h2 className="text-2xl font-medium text-white">Contacto</h2>
          <p className="mt-2 text-stone-300">Para coordinar, solicitar presupuesto o hacer consultas, podés escribirme por WhatsApp:</p>
          <p className="mt-2"><a className="text-sky-400" href="https://api.whatsapp.com/send/?phone=543834577609&text=Hola%20Mayra%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20tus%20servicios.&type=phone_number&app_absent=0" target="_blank" rel="noreferrer">Enviar mensaje por WhatsApp</a></p>
        </div>
      </section>

      <div className="mt-10">
        <Link href="/" className="text-sm text-stone-300">← Volver al inicio</Link>
      </div>
    </main>
  );
}
