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

  const obtenerTemas = (valor: any) => {
    if (!valor) return [];

    try {
      if (Array.isArray(valor)) return valor;

      if (typeof valor === "string") {
        const parsed = JSON.parse(valor);

        if (typeof parsed === "string") {
          return JSON.parse(parsed);
        }

        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      return [];
    }

    return [];
  };

  const temas = obtenerTemas(unidad.temas_nuevo);

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

          <p>
            <b>Grupos de competencias:</b>{" "}
            {unidad.grupos_competencias || "No registrado"}
          </p>
          <p>
            <b>Competencias específicas:</b>{" "}
            {unidad.competencias_especificas || "No registrado"}
          </p>
          <p>
            <b>Eje transversal:</b>{" "}
            {unidad.eje_transversal || "No registrado"}
          </p>
          <p>
            <b>Áreas articuladas:</b>{" "}
            {unidad.areas_articuladas || "No registrado"}
          </p>
          <p>
            <b>Estrategias:</b> {unidad.estrategias || "No registrado"}
          </p>
          <p>
            <b>Contenidos conceptuales:</b>{" "}
            {unidad.contenidos_conceptuales || "No registrado"}
          </p>
          <p>
            <b>Contenidos procedimentales:</b>{" "}
            {unidad.contenidos_procedimentales || "No registrado"}
          </p>
          <p>
            <b>Contenidos actitudinales:</b>{" "}
            {unidad.contenidos_actitudinales || "No registrado"}
          </p>
          <p>
            <b>Indicadores de logro:</b>{" "}
            {unidad.indicadores_logro || "No registrado"}
          </p>
        </div>

        <div className="mb-8 bg-green-50 p-6 rounded-xl border">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Temas y secuencias
          </h2>

          {temas.length === 0 ? (
            <p>No hay temas registrados.</p>
          ) : (
            <div className="space-y-6">
              {temas.map((tema: any, temaIndex: number) => (
                <div
                  key={temaIndex}
                  className="bg-white p-5 rounded-xl border"
                >
                  <h3 className="font-bold text-[#003B7A] text-xl mb-4">
                    Tema {temaIndex + 1}: {tema.tema}
                  </h3>

                  {tema.secuencias?.length > 0 ? (
                    <div className="space-y-5">
                      {tema.secuencias.map((sec: any, secIndex: number) => (
                        <div
                          key={secIndex}
                          className="bg-green-50 border rounded-xl p-5"
                        >
                          <h4 className="font-bold text-green-800 text-lg mb-3">
                            {sec.titulo || `Secuencia ${secIndex + 1}`}
                          </h4>

                          {sec.intencion_pedagogica && (
                            <p className="mb-3">
                              <b>Intención pedagógica:</b>{" "}
                              {sec.intencion_pedagogica}
                            </p>
                          )}

                          <p className="mb-3">
                            <b>Estrategias:</b>{" "}
                            {sec.estrategias || unidad.estrategias || "No registrado"}
                          </p>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <Momento titulo="Inicio" datos={sec.inicio} />
                            <Momento titulo="Desarrollo" datos={sec.desarrollo} />
                            <Momento titulo="Cierre" datos={sec.cierre} />
                          </div>

                          <div className="bg-white rounded-lg border p-4 mb-3">
                            <h5 className="font-bold text-gray-800 mb-2">
                              Evaluación
                            </h5>

                            <p>
                              <b>Técnica:</b>{" "}
                              {sec.evaluacion?.tecnica || "No registrado"}
                            </p>

                            <p>
                              <b>Instrumento:</b>{" "}
                              {sec.evaluacion?.instrumento || "No registrado"}
                            </p>
                          </div>

                          <div className="bg-white rounded-lg border p-4">
                            <h5 className="font-bold text-gray-800 mb-2">
                              Acomodación curricular
                            </h5>

                            <p>
                              {sec.acomodacion || "No registrada"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Este tema no tiene secuencias registradas.
                    </p>
                  )}
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

function Momento({ titulo, datos }: { titulo: string; datos: any }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <h5 className="font-bold text-gray-800 mb-2">{titulo}</h5>

      <p>
        <b>Tiempo:</b> {datos?.tiempo || "No registrado"} min
      </p>

      <p>
        <b>Actividades:</b> {datos?.actividades || "No registrado"}
      </p>

      <p>
        <b>Evidencia:</b> {datos?.evidencia || "No registrada"}
      </p>

      <p>
        <b>Metacognición:</b> {datos?.metacognicion || "No registrada"}
      </p>

      <p>
        <b>Recursos:</b> {datos?.recursos || "No registrados"}
      </p>
    </div>
  );
}