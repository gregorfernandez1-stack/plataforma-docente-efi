import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function BibliotecaPorGrado({
  params,
  searchParams,
}: {
  params: { grado: string };
  searchParams: { nivel?: string };
}) {
  const grado = params.grado;
  const nivel = searchParams.nivel || "";

  const { data: unidades } = await supabase
    .from("unidades")
    .select("*")
    .eq("grado", grado)
    .eq("nivel", nivel)
    .order("created_at", { ascending: true });

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
          Biblioteca curricular
        </h1>

        <p className="text-gray-600 mb-8">
          Nivel: <strong>{nivel}</strong> | Grado: <strong>{grado}°</strong>
        </p>

        {/* 1. UNIDADES */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#003B7A] mb-4">
            1. Unidades didácticas
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {unidades?.map((u, i) => (
              <div key={u.id} className="p-5 bg-blue-50 rounded-xl border">
                <h3 className="font-bold text-[#003B7A]">
                  Unidad {i + 1}
                </h3>
                <p className="mt-2 font-semibold">
                  {u.unidad || u.titulo}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. ASPECTOS */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            2. Aspectos curriculares
          </h2>

          {unidades?.map((u) => (
            <div key={u.id} className="bg-purple-50 p-5 rounded-xl mb-4">
              <p><b>Competencias:</b> {u.competencias_especificas}</p>
              <p><b>Indicadores:</b> {u.indicadores}</p>
              <p><b>Contenidos:</b> {u.contenidos}</p>
            </div>
          ))}
        </div>

        {/* 3. SECUENCIAS */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            3. Secuencias y actividades
          </h2>

          {unidades?.map((u) => (
            <div key={u.id} className="bg-green-50 p-5 rounded-xl mb-4">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(u.secuencias, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        {/* 4. DOCUMENTOS */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            4. Documentos curriculares
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded">📘 Diseño curricular</div>
            <div className="p-4 border rounded">📜 Ordenanzas</div>
            <div className="p-4 border rounded">📗 Guías didácticas</div>
            <div className="p-4 border rounded">📅 Calendario escolar</div>
            <div className="p-4 border rounded">🏛 Normativas</div>
            <div className="p-4 border rounded">📁 Otros</div>
          </div>
        </div>
      </section>
    </main>
  );
}