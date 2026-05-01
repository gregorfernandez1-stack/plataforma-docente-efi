"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { unidadesPorNivelYGrado } from "@/data/unidades";

export default function UnidadesDelGrado() {
  const params = useParams();
  const searchParams = useSearchParams();

  const grado = Array.isArray(params.grado) ? params.grado[0] : params.grado;
  const nivel = searchParams.get("nivel") || "Primario";

  const unidades =
    (unidadesPorNivelYGrado as any)[nivel]?.[grado as string] || [];

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow">
        <Link
          href="/docente/biblioteca"
          className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          ← Volver a biblioteca
        </Link>

        <h1 className="text-3xl font-bold text-[#003B7A] mb-2">
          {grado}° grado - Nivel {nivel}
        </h1>

        <p className="text-gray-600 mb-8">
          Unidades curriculares disponibles.
        </p>

        {unidades.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-xl">
            <p className="text-yellow-800 font-semibold">
              No hay unidades disponibles para este nivel y grado.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {unidades.map((unidad: any, index: number) => (
              <Link
                key={index}
                href={`/docente/biblioteca/${grado}/${encodeURIComponent(
                  unidad.nombre
                )}?nivel=${nivel}`}
                className="border rounded-xl p-6 bg-white hover:bg-blue-50 transition shadow-sm"
              >
                <h2 className="text-xl font-bold text-[#003B7A]">
                  {unidad.nombre}
                </h2>

                <p className="text-gray-600 mt-3 line-clamp-3">
                  {unidad.indicadores}
                </p>

                <p className="text-sm text-green-700 font-semibold mt-4">
                  Ver detalle completo →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}