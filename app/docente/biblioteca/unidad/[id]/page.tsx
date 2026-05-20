import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function UnidadDetalle({
  params,
}: {
  params: { id: string };
}) {
  const { data: unidad, error } = await supabase
    .from("unidades")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    console.error("Error cargando unidad:", error.message);
  }

  if (!unidad) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
        <section className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
          <Link
            href="/docente/biblioteca"
            className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
          >
            ← Volver a biblioteca
          </Link>

          <p className="text-red-600 font-semibold">
            No se encontró la unidad.
          </p>
        </section>
      </main>
    );
  }

  const limpiarSecuencias = (valor: any) => {
    if (!valor) return [];

    try {
      if (Array.isArray(valor)) return valor;

      if (typeof valor === "string") {
        const parsed = JSON.parse(valor);

        if (typeof parsed === "string") {
          return JSON.parse(parsed);
        }

        return parsed;
      }
    } catch {
      return [];
    }

    return [];
  };

  const secuencias = limpiarSecuencias(unidad.secuencias);

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
        <Link
          href={`/docente/biblioteca/${unidad.grado}?nivel=${unidad.nivel}`}
          className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          ← Volver al grado
        </Link>

        <h1 className="text-3xl font-bold text-[#003B7A] mb-2">
          {unidad.unidad || unidad.titulo || "Unidad sin título"}
        </h1>

        <p className="text-gray-600 mb-8">
          Nivel: <strong>{unidad.nivel}</strong> | Grado:{" "}
          <strong>{unidad.grado}°</strong>
        </p>

        <div className="mb-8 bg-purple-50 p-6 rounded-xl border">
          <h2 className="text-xl font-bold text-purple-700 mb-4">
            Aspectos curriculares
          </h2>

          <p><b>Grupos de competencias:</b> {unidad.grupos_competencias || "No registrado"}</p>
          <p><b>Competencias específicas:</b> {unidad.competencias_especificas || "No registrado"}</p>
          <p><b>Eje transversal:</b> {unidad.eje_transversal || "No registrado"}</p>
          <p><b>Áreas articuladas:</b> {unidad.areas_articuladas || "No registrado"}</p>
          <p><b>Estrategias:</b> {unidad.estrategias || "No registrado"}</p>
          <p><b>Contenidos conceptuales:</b> {unidad.contenidos_conceptuales || "No registrado"}</p>
          <p><b>Contenidos procedimentales:</b> {unidad.contenidos_procedimentales || "No registrado"}</p>
          <p><b>Contenidos actitudinales:</b> {unidad.contenidos_actitudinales || "No registrado"}</p>
          <p><b>Indicadores de logro:</b> {unidad.indicadores_logro || "No registrado"}</p>
        </div>

        <div className="mb-8 bg-green-50 p-6 rounded-xl border">
         <h2 className="text-xl font-bold text-green-700 mb-4">
  Temas y secuencias
</h2>

          {secuencias.length === 0 ? (
            <p>No hay secuencias registradas.</p>
          ) : (
            <div className="space-y-4">
              {secuencias.map((sec: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                <h3 className="font-bold text-green-700 mb-2">
  Tema {index + 1}: {sec.nombre}
</h3>

<ul className="list-disc pl-6">
  {sec.actividades?.map((act: string, i: number) => (
    <li key={i}>
      <strong>Secuencia {i + 1}:</strong> {act}
    </li>
  ))}
</ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/docente/nueva-planificacion?unidad=${unidad.id}`}
          className="inline-block bg-[#003B7A] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800"
        >
          Usar esta unidad
        </Link>
      </section>
    </main>
  );
}