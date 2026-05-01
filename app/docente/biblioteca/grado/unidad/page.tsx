"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { unidadesPorNivelYGrado } from "@/data/unidades";

export default function DetalleUnidadBiblioteca() {
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

              <tr>
                <th className="border p-3 bg-[#8FD14F]">
                  Competencias fundamentales
                </th>
                <td className="border p-3" colSpan={3}>
                  <ul className="list-disc ml-5">
                    {unidad.gruposCompetencias?.map(
                      (grupo: string, index: number) => (
                        <li key={index}>{grupo}</li>
                      )
                    )}
                  </ul>
                </td>
              </tr>

              <tr>
                <th className="border p-3 bg-[#8FD14F]">
                  Competencias específicas
                </th>
                <td className="border p-3" colSpan={3}>
                  {unidad.competenciasEspecificas}
                </td>
              </tr>

              <tr>
                <th className="border p-3 bg-[#8FD14F]">
                  Áreas articuladas
                </th>
                <td className="border p-3" colSpan={3}>
                  <ul className="list-disc ml-5">
                    {unidad.areasArticuladas?.map(
                      (area: string, index: number) => (
                        <li key={index}>{area}</li>
                      )
                    )}
                  </ul>
                </td>
              </tr>

              <tr>
                <th className="border p-3 bg-[#8FD14F]" colSpan={4}>
                  Contenidos curriculares
                </th>
              </tr>

              <tr>
                <th className="border p-3 bg-gray-100">Conceptual</th>
                <th className="border p-3 bg-gray-100" colSpan={2}>
                  Procedimental
                </th>
                <th className="border p-3 bg-gray-100">Actitudinal</th>
              </tr>

              <tr>
                <td className="border p-3">
                  {unidad.contenidos?.conceptual}
                </td>
                <td className="border p-3" colSpan={2}>
                  {unidad.contenidos?.procedimental}
                </td>
                <td className="border p-3">
                  {unidad.contenidos?.actitudinal}
                </td>
              </tr>

              <tr>
                <th className="border p-3 bg-[#8FD14F]" colSpan={4}>
                  Indicadores de logro
                </th>
              </tr>

              <tr>
                <td className="border p-3" colSpan={4}>
                  {unidad.indicadores}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-[#003B7A] mb-4">
          Secuencias y actividades
        </h2>

        {unidad.secuencias?.map((secuencia: any, i: number) => (
          <div key={i} className="mb-8 border rounded-xl overflow-hidden">
            <div className="bg-[#003B7A] text-white p-4 font-bold">
              Secuencia {i + 1}: {secuencia.nombre}
            </div>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border p-3 text-left w-1/6">Clase</th>
                  <th className="border p-3 text-left">Actividad</th>
                </tr>
              </thead>

              <tbody>
                {secuencia.actividades?.map(
                  (actividad: string, j: number) => (
                    <tr key={j}>
                      <td className="border p-3 font-semibold">
                        Clase {j + 1}
                      </td>
                      <td className="border p-3">{actividad}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ))}
      </section>
    </main>
  );
}