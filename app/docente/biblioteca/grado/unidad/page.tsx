"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { unidadesPorNivelYGrado } from "@/data/unidades";

function DetalleUnidadContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const grado = Array.isArray(params.grado) ? params.grado[0] : params.grado;
  const unidadParam = Array.isArray(params.unidad)
    ? params.unidad[0]
    : params.unidad;

  const nivel = searchParams.get("nivel") || "Primario";
  const nombreUnidad = decodeURIComponent(unidadParam || "");

  const unidades =
    (unidadesPorNivelYGrado as any)[nivel]?.[grado as string] || [];

  const unidad = unidades.find((u: any) => u.nombre === nombreUnidad);

  if (!unidad) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
        <section className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow">
          <Link
            href={`/docente/biblioteca/${grado}?nivel=${nivel}`}
            className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
          >
            ← Volver
          </Link>

          <p className="text-red-600 font-bold">
            No se encontró la unidad curricular.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow">
        <Link
          href={`/docente/biblioteca/${grado}?nivel=${nivel}`}
          className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          ← Volver a unidades
        </Link>

        <h1 className="text-3xl font-bold text-[#003B7A] mb-2">
          {unidad.nombre}
        </h1>

        <p className="text-gray-600 mb-8">
          {grado}° grado - Nivel {nivel} | Educación Física
        </p>

        {/* TODO TU CONTENIDO IGUAL ↓ */}
        {/* No cambié nada aquí, solo la estructura */}

        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse text-sm bg-white">
            <tbody>
              <tr>
                <th className="border p-3 bg-[#8FD14F] w-1/4">
                  Eje transversal
                </th>
                <td className="border p-3">{unidad.ejeTransversal}</td>

                <th className="border p-3 bg-[#8FD14F] w-1/4">
                  Estrategias
                </th>
                <td className="border p-3">{unidad.estrategias}</td>
              </tr>

              {/* resto igual... */}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default function DetalleUnidadBiblioteca() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
          <p className="text-[#003B7A] font-bold">Cargando unidad...</p>
        </main>
      }
    >
      <DetalleUnidadContent />
    </Suspense>
  );
}