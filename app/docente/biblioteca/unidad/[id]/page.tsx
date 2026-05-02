import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function UnidadDetalle({
  params,
}: {
  params: { id: string };
}) {
  const { data: unidad } = await supabase
    .from("unidades")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!unidad) {
    return (
      <main className="p-10">
        <p>No se encontró la unidad.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
        
        {/* 🔙 VOLVER */}
        <Link
          href="/docente/biblioteca"
          className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          ← Volver
        </Link>

        {/* 📘 TÍTULO */}
        <h1 className="text-3xl font-bold text-[#003B7A] mb-4">
          {unidad.unidad || unidad.titulo}
        </h1>

        {/* 📌 SITUACIÓN */}
        {unidad.situacion && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">
              Situación de aprendizaje
            </h2>
            <p className="text-gray-700">{unidad.situacion}</p>
          </div>
        )}

        {/* 🟣 ASPECTOS CURRICULARES */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-3">
            Aspectos curriculares
          </h2>

          <div className="space-y-3 text-gray-700">
            <p><b>Eje transversal:</b> {unidad.eje_transversal}</p>
            <p><b>Estrategias:</b> {unidad.estrategias}</p>
            <p><b>Competencias:</b> {unidad.competencias_especificas}</p>
            <p><b>Indicadores:</b> {unidad.indicadores}</p>
            <p><b>Contenidos:</b> {unidad.contenidos}</p>
          </div>
        </div>

        {/* 🟢 SECUENCIAS */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-3">
            Secuencias y actividades
          </h2>

          <pre className="bg-green-50 p-4 rounded-xl text-sm whitespace-pre-wrap">
            {JSON.stringify(unidad.secuencias, null, 2)}
          </pre>
        </div>

        {/* 🔥 BOTÓN CLAVE */}
        <div className="mt-8">
          <Link
            href={`/docente/nueva-planificacion?unidad=${unidad.id}`}
            className="bg-[#003B7A] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800"
          >
            Usar esta unidad
          </Link>
        </div>

      </section>
    </main>
  );
}