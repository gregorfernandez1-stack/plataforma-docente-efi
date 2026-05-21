"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";

export default function DetallePlanificacion() {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [planificacion, setPlanificacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatearGrado = (grado: string) => {
    const mapa: any = {
      "1": "1ro.",
      "2": "2do.",
      "3": "3ro.",
      "4": "4to.",
      "5": "5to.",
      "6": "6to.",
    };

    return mapa[String(grado)] || grado || "—";
  };

  const formatearPeriodo = (periodo: string) => {
    return periodo ? `P${periodo}` : "—";
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Planificacion_${planificacion?.unidad || "sin_titulo"}`,
    pageStyle: `
      @page { size: A4 landscape; margin: 8mm; }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .no-print {
          display: none !important;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        table, tr, td, th {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .sequence-block {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .avoid-break {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .page-break {
          page-break-before: always;
        }

        h1, h2, h3 {
          page-break-after: avoid;
        }

        .situacion-texto {
          white-space: pre-line;
          word-break: break-word;
          overflow-wrap: break-word;
          line-height: 1.25;
          font-size: 10.5px;
        }
      }
    `,
  });

  useEffect(() => {
    if (id) cargarPlanificacion();
  }, [id]);

  const mostrarLista = (valor: any) => {
    if (Array.isArray(valor)) return valor.length > 0 ? valor.join("\n") : "—";
    return valor || "—";
  };

  const cargarPlanificacion = async () => {
    const { data, error } = await supabase
      .from("planificaciones")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert("Error al cargar planificación");
      router.push("/docente/mis-planificaciones");
      return;
    }

    let secuencias = data?.secuencias;

    if (typeof secuencias === "string") {
      try {
        secuencias = JSON.parse(secuencias);
      } catch {
        secuencias = [];
      }
    }

    setPlanificacion({
      ...data,
      secuencias: Array.isArray(secuencias) ? secuencias : [],
    });

    setLoading(false);
  };

  if (loading) return <p className="p-6">Cargando planificación...</p>;

  if (!planificacion) {
    return <p className="p-6">No se encontró la planificación.</p>;
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-[1200px] mx-auto bg-white p-10 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-6 no-print">
          <button
            onClick={() => router.push("/docente/mis-planificaciones")}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
          >
            ← Volver
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Imprimir / PDF
            </button>

            <button
              onClick={() =>
                router.push(`/docente/mis-planificaciones/${id}/editar`)
              }
              className="bg-[#003B7A] hover:bg-[#002d5c] text-white px-4 py-2 rounded-lg font-semibold"
            >
              Editar
            </button>
          </div>
        </div>

        <div ref={printRef}>
          <div className="mb-8 grid grid-cols-[1fr_2fr_1fr] items-center border-b pb-4 avoid-break">
            <div className="flex justify-start">
              <img
                src="/logos/minerd.png"
                alt="Logo Ministerio de Educación"
                className="h-20 object-contain"
              />
            </div>

            <div className="text-center px-4">
              <h1 className="text-2xl md:text-3xl font-bold text-[#003B7A] leading-tight">
                Centro Educativo {planificacion.centro || ""}
              </h1>

              <p className="text-sm md:text-base font-semibold text-gray-700 mt-1">
                Regional {planificacion.regional || "—"} | Distrito Educativo{" "}
                {planificacion.codigo_distrito || "—"}
              </p>

              <h2 className="text-lg md:text-xl font-bold text-[#003B7A] mt-3 tracking-wide uppercase">
                Planificación de Unidad
              </h2>
            </div>

            <div className="flex justify-end">
              <img
                src="/logos/inefi.png"
                alt="Logo INEFI"
                className="h-20 object-contain"
              />
            </div>
          </div>

          <div className="mb-6 avoid-break">
            <div className="bg-[#003B7A] text-white text-center py-2 font-bold border border-black uppercase">
              Datos generales
            </div>

            <table className="w-full text-xs border border-black">
              <thead className="bg-[#003B7A] text-white">
                <tr>
                  <th className="border p-2">Centro</th>
                  <th className="border p-2">Asignatura</th>
                  <th className="border p-2">Docente</th>
                  <th className="border p-2">Nivel</th>
                  <th className="border p-2">Grado</th>
                  <th className="border p-2">Periodo</th>
                  <th className="border p-2">Fecha</th>
                  <th className="border p-2">Regional</th>
                  <th className="border p-2">Distrito</th>
                  <th className="border p-2">Tiempo</th>
                </tr>
              </thead>

              <tbody>
                <tr className="text-center">
                  <td className="border p-2">{planificacion.centro || "—"}</td>
                  <td className="border p-2">Educación Física</td>
                  <td className="border p-2">{planificacion.docente || "—"}</td>
                  <td className="border p-2">{planificacion.nivel || "—"}</td>
                  <td className="border p-2">
                    {formatearGrado(planificacion.grado)}
                  </td>
                  <td className="border p-2">
                    {formatearPeriodo(planificacion.periodo)}
                  </td>
                  <td className="border p-2">{planificacion.fecha || "—"}</td>
                  <td className="border p-2">{planificacion.regional || "—"}</td>
                  <td className="border p-2">
                    {planificacion.codigo_distrito || "—"}
                  </td>
                  <td className="border p-2">
                    {planificacion.tiempo_asignado || "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6 avoid-break">
            <div className="bg-[#003B7A] text-white text-center py-2 font-bold border border-black uppercase">
              Unidad y situación de aprendizaje
            </div>

            <table className="w-full text-[11px] leading-tight border border-black">
              <tbody>
                <tr>
                  <td className="w-1/4 bg-blue-50 border p-2 font-bold text-[#003B7A]">
                    Unidad
                  </td>
                  <td className="border p-2 font-semibold">
                    {planificacion.unidad || "—"}
                  </td>
                </tr>

                <tr>
                  <td className="w-1/4 bg-blue-50 border p-2 font-bold text-[#003B7A] align-top">
                    Situación de aprendizaje
                  </td>
                  <td className="border p-2 align-top text-[10.5px] leading-snug whitespace-pre-line break-words max-w-[700px] situacion-texto">
                    {planificacion.situacion || "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-[#003B7A] mb-3">
            Aspectos curriculares
          </h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-black">
              <tbody>
                <tr>
                  <td className="bg-green-400 font-bold p-3 border">
                    Eje transversal
                  </td>
                  <td className="p-3 border">
                    {planificacion.eje_transversal || "—"}
                  </td>
                  <td className="bg-green-400 font-bold p-3 border">
                    Estrategias
                  </td>
                  <td className="p-3 border">
                    {planificacion.estrategias || "—"}
                  </td>
                </tr>

                <tr>
                  <td className="bg-green-400 font-bold p-3 border">
                    Competencias fundamentales
                  </td>
                  <td colSpan={3} className="p-3 border whitespace-pre-line">
                    {mostrarLista(planificacion.grupos_competencias)}
                  </td>
                </tr>

                <tr>
                  <td className="bg-green-400 font-bold p-3 border">
                    Competencias específicas
                  </td>
                  <td colSpan={3} className="p-3 border">
                    {planificacion.competencias_especificas || "—"}
                  </td>
                </tr>

                <tr>
                  <td className="bg-green-400 font-bold p-3 border">
                    Áreas articuladas
                  </td>
                  <td colSpan={3} className="p-3 border whitespace-pre-line">
                    {mostrarLista(planificacion.areas_articuladas)}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={4}
                    className="bg-green-500 text-center font-bold p-3 border"
                  >
                    Contenidos curriculares
                  </td>
                </tr>

                <tr>
                  <td className="font-bold text-center p-2 border">
                    Conceptual
                  </td>
                  <td className="font-bold text-center p-2 border" colSpan={2}>
                    Procedimental
                  </td>
                  <td className="font-bold text-center p-2 border">
                    Actitudinal
                  </td>
                </tr>

                <tr>
                  <td className="p-3 border">
                    {planificacion.contenidos?.conceptual || "—"}
                  </td>
                  <td className="p-3 border" colSpan={2}>
                    {planificacion.contenidos?.procedimental || "—"}
                  </td>
                  <td className="p-3 border">
                    {planificacion.contenidos?.actitudinal || "—"}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={4}
                    className="bg-green-500 text-center font-bold p-3 border"
                  >
                    Indicadores de logro
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} className="p-3 border">
                    {planificacion.indicadores || "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-[#003B7A] mb-4">
            Temas y secuencias didácticas
          </h2>

          {planificacion.secuencias.length === 0 ? (
            <p>No hay temas registrados.</p>
          ) : (
            planificacion.secuencias.map((tema: any, temaIndex: number) => (
              <div key={temaIndex} className="mb-10 sequence-block">
                <div className="bg-[#003B7A] text-white text-center py-3 font-bold border border-black">
                  Tema {temaIndex + 1}: {tema.tema || "Sin tema"}
                </div>

                {(tema.secuencias || []).map(
                  (sec: any, secIndex: number) => (
                    <div key={secIndex} className="border border-black mb-6">
                      <div className="bg-green-700 text-white px-4 py-2 font-bold">
                        {sec.titulo || `Secuencia ${secIndex + 1}`}
                      </div>

                      <table className="w-full text-xs border-collapse">
                        <tbody>
                          <tr>
                            <td className="border p-2 font-bold w-[25%]">
                              Intención pedagógica
                            </td>

                            <td className="border p-2">
                              {sec.intencion_pedagogica || "—"}
                            </td>
                          </tr>

                          <tr>
                            <td className="border p-2 font-bold">
                              Estrategias
                            </td>

                            <td className="border p-2">
                              {sec.estrategias || "—"}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table className="w-full text-xs border-collapse">
                        <thead className="bg-[#003B7A] text-white">
                          <tr>
                            <th className="border p-2">Momento</th>
                            <th className="border p-2">Tiempo</th>
                            <th className="border p-2">Actividades</th>
                            <th className="border p-2">Evidencia</th>
                            <th className="border p-2">Metacognición</th>
                            <th className="border p-2">Recursos</th>
                          </tr>
                        </thead>

                        <tbody>
                          {["inicio", "desarrollo", "cierre"].map(
                            (momento: any) => {
                              const datos = sec[momento];

                              return (
                                <tr key={momento}>
                                  <td className="border p-2 font-bold capitalize">
                                    {momento}
                                  </td>

                                  <td className="border p-2">
                                    {datos?.tiempo || "—"} min
                                  </td>

                                  <td className="border p-2">
                                    {datos?.actividades || "—"}
                                  </td>

                                  <td className="border p-2">
                                    {datos?.evidencia || "—"}
                                  </td>

                                  <td className="border p-2">
                                    {datos?.metacognicion || "—"}
                                  </td>

                                  <td className="border p-2">
                                    {datos?.recursos || "—"}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>

                      <table className="w-full text-xs border-collapse">
                        <tbody>
                          <tr>
                            <td className="border p-2 font-bold w-[25%]">
                              Evaluación
                            </td>

                            <td className="border p-2">
                              Técnica: {sec.evaluacion?.tecnica || "—"}
                              <br />
                              Instrumento:{" "}
                              {sec.evaluacion?.instrumento || "—"}
                            </td>
                          </tr>

                          <tr>
                            <td className="border p-2 font-bold">
                              Acomodación curricular
                            </td>

                            <td className="border p-2">
                              {sec.acomodacion || "—"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            ))
          )}

          <div className="mt-12 grid grid-cols-3 gap-10 text-center text-sm">
            <div>
              <div className="border-t border-black pt-2">
                Firma del docente
              </div>
            </div>

            <div>
              <div className="border-t border-black pt-2">
                Coordinación pedagógica
              </div>
            </div>

            <div>
              <div className="border-t border-black pt-2">
                Dirección del centro
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}