"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

type Tema = {
  tema: string;
  secuencias: string[];
};

export default function EditarUnidadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    nivel: "",
    grado: "",
    titulo: "",
    grupos_competencias: "",
    competencias_especificas: "",
    eje_transversal: "",
    areas_articuladas: "",
    estrategias: "",
    contenidos_conceptuales: "",
    contenidos_procedimentales: "",
    contenidos_actitudinales: "",
    indicadores_logro: "",
  });

  const [temas, setTemas] = useState<Tema[]>([
    {
      tema: "",
      secuencias: [""],
    },
  ]);

  useEffect(() => {
    cargarUnidad();
  }, []);

  const inputStyle =
    "border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#003B7A]";

  const textareaStyle =
    "border border-gray-300 p-3 rounded-lg w-full min-h-[90px] focus:outline-none focus:ring-2 focus:ring-[#003B7A]";

  const normalizarTemas = (valor: any): Tema[] => {
    try {
      let parsed = valor;

      if (typeof valor === "string") {
        parsed = JSON.parse(valor);
      }

      if (!Array.isArray(parsed)) {
        return [{ tema: "", secuencias: [""] }];
      }

      const limpios = parsed.map((item: any) => ({
        tema: item.tema || "",
        secuencias: Array.isArray(item.secuencias)
          ? item.secuencias
          : [""],
      }));

      return limpios.length > 0 ? limpios : [{ tema: "", secuencias: [""] }];
    } catch {
      return [{ tema: "", secuencias: [""] }];
    }
  };

  const cargarUnidad = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("unidades")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert("Error cargando la unidad.");
      console.log(error);
      setLoading(false);
      return;
    }

    setForm({
      nivel: data.nivel || "",
      grado: data.grado || "",
      titulo: data.titulo || data.unidad || "",
      grupos_competencias: data.grupos_competencias || "",
      competencias_especificas: data.competencias_especificas || "",
      eje_transversal: data.eje_transversal || "",
      areas_articuladas: data.areas_articuladas || "",
      estrategias: data.estrategias || "",
      contenidos_conceptuales: data.contenidos_conceptuales || "",
      contenidos_procedimentales: data.contenidos_procedimentales || "",
      contenidos_actitudinales: data.contenidos_actitudinales || "",
      indicadores_logro: data.indicadores_logro || "",
    });

    setTemas(normalizarTemas(data.temas_nuevo || data.temas));

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const agregarTema = () => {
    setTemas([
      ...temas,
      {
        tema: "",
        secuencias: [""],
      },
    ]);
  };

  const eliminarTema = (index: number) => {
    if (temas.length === 1) return;
    setTemas(temas.filter((_, i) => i !== index));
  };

  const cambiarTema = (index: number, valor: string) => {
    const copia = [...temas];
    copia[index].tema = valor;
    setTemas(copia);
  };

  const agregarSecuencia = (temaIndex: number) => {
    const copia = [...temas];
    copia[temaIndex].secuencias.push("");
    setTemas(copia);
  };

  const cambiarSecuencia = (
    temaIndex: number,
    secuenciaIndex: number,
    valor: string
  ) => {
    const copia = [...temas];
    copia[temaIndex].secuencias[secuenciaIndex] = valor;
    setTemas(copia);
  };

  const eliminarSecuencia = (temaIndex: number, secuenciaIndex: number) => {
    const copia = [...temas];

    if (copia[temaIndex].secuencias.length === 1) return;

    copia[temaIndex].secuencias.splice(secuenciaIndex, 1);
    setTemas(copia);
  };

  const guardarCambios = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.nivel || !form.grado || !form.titulo) {
      alert("Completa nivel, grado y nombre de la unidad.");
      return;
    }

    const temasLimpios = temas
      .map((t) => ({
        tema: t.tema.trim(),
        secuencias: t.secuencias.map((s) => s.trim()).filter(Boolean),
      }))
      .filter((t) => t.tema && t.secuencias.length > 0);

    if (temasLimpios.length === 0) {
      alert("Agrega al menos un tema con una secuencia resumida.");
      return;
    }

    setGuardando(true);

    const { error } = await supabase
      .from("unidades")
      .update({
        ...form,
        temas: temasLimpios,
      })
      .eq("id", id);

    setGuardando(false);

    if (error) {
      alert("Error al actualizar la unidad: " + error.message);
      console.log(error);
      return;
    }

    alert("Unidad actualizada correctamente");
    router.push("/admin/unidades");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex">
        <AdminSidebar />

        <section className="ml-[170px] flex-1 p-10">
          <p className="text-[#003B7A] font-bold">Cargando unidad...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      <AdminSidebar />

      <section className="ml-[170px] flex-1 p-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8">
          <Link
            href="/admin/unidades"
            className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
          >
            ← Volver a unidades
          </Link>

          <h1 className="text-3xl font-bold text-[#003B7A] mb-2">
            Editar Unidad Curricular
          </h1>

          <p className="text-gray-600 mb-8">
            Modifica la unidad, sus aspectos curriculares, temas y secuencias
            resumidas. La plataforma orienta la planificación, pero el docente
            debe consultar la guía didáctica para el desarrollo completo.
          </p>

          <form onSubmit={guardarCambios} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-5">
              <select
                name="nivel"
                value={form.nivel}
                onChange={handleChange}
                className={inputStyle}
                required
              >
                <option value="">Seleccionar nivel</option>
                <option value="Primario">Primario</option>
                <option value="Secundario">Secundario</option>
              </select>

              <select
                name="grado"
                value={form.grado}
                onChange={handleChange}
                className={inputStyle}
                required
              >
                <option value="">Seleccionar grado</option>
                <option value="1">1ro.</option>
                <option value="2">2do.</option>
                <option value="3">3ro.</option>
                <option value="4">4to.</option>
                <option value="5">5to.</option>
                <option value="6">6to.</option>
                <option value="1ro.">1ro.</option>
                <option value="2do.">2do.</option>
                <option value="3ro.">3ro.</option>
                <option value="4to.">4to.</option>
                <option value="5to.">5to.</option>
                <option value="6to.">6to.</option>
              </select>

              <input
                name="titulo"
                placeholder="Nombre de la unidad"
                value={form.titulo}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <textarea
                name="grupos_competencias"
                placeholder="Grupos de competencias fundamentales"
                value={form.grupos_competencias}
                onChange={handleChange}
                className={textareaStyle}
              />

              <textarea
                name="competencias_especificas"
                placeholder="Competencias específicas del grado"
                value={form.competencias_especificas}
                onChange={handleChange}
                className={textareaStyle}
              />

              <textarea
                name="eje_transversal"
                placeholder="Eje transversal"
                value={form.eje_transversal}
                onChange={handleChange}
                className={textareaStyle}
              />

              <textarea
                name="areas_articuladas"
                placeholder="Áreas articuladas"
                value={form.areas_articuladas}
                onChange={handleChange}
                className={textareaStyle}
              />

              <textarea
                name="estrategias"
                placeholder="Estrategias"
                value={form.estrategias}
                onChange={handleChange}
                className={textareaStyle}
              />

              <textarea
                name="indicadores_logro"
                placeholder="Indicadores de logro"
                value={form.indicadores_logro}
                onChange={handleChange}
                className={textareaStyle}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#003B7A] mb-4">
                Contenidos curriculares
              </h2>

              <div className="grid md:grid-cols-3 gap-5">
                <textarea
                  name="contenidos_conceptuales"
                  placeholder="Contenidos conceptuales"
                  value={form.contenidos_conceptuales}
                  onChange={handleChange}
                  className={textareaStyle}
                />

                <textarea
                  name="contenidos_procedimentales"
                  placeholder="Contenidos procedimentales"
                  value={form.contenidos_procedimentales}
                  onChange={handleChange}
                  className={textareaStyle}
                />

                <textarea
                  name="contenidos_actitudinales"
                  placeholder="Contenidos actitudinales"
                  value={form.contenidos_actitudinales}
                  onChange={handleChange}
                  className={textareaStyle}
                />
              </div>
            </div>

            <div className="border rounded-2xl overflow-hidden">
              <div className="bg-[#003B7A] text-white text-center py-3 font-bold">
                Temas y secuencias resumidas
              </div>

              <div className="p-5 space-y-6">
                {temas.map((tema, i) => (
                  <div
                    key={i}
                    className="border border-gray-300 rounded-xl p-5 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-[#003B7A]">
                        Tema {i + 1}
                      </h3>

                      <button
                        type="button"
                        onClick={() => eliminarTema(i)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
                      >
                        Eliminar tema
                      </button>
                    </div>

                    <input
                      value={tema.tema}
                      onChange={(e) => cambiarTema(i, e.target.value)}
                      placeholder="Nombre del tema. Ej: Explorando el concepto"
                      className={inputStyle}
                    />

                    <h4 className="font-bold mt-5 mb-3">
                      Secuencias resumidas
                    </h4>

                    <div className="space-y-3">
                      {tema.secuencias.map((secuencia, j) => (
                        <div key={j} className="flex gap-3">
                          <textarea
                            value={secuencia}
                            onChange={(e) =>
                              cambiarSecuencia(i, j, e.target.value)
                            }
                            placeholder="Ej: Cuento sobre la aventura..."
                            className="border border-gray-300 p-3 rounded-lg w-full min-h-[70px] focus:outline-none focus:ring-2 focus:ring-[#003B7A]"
                          />

                          <button
                            type="button"
                            onClick={() => eliminarSecuencia(i, j)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg font-bold"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => agregarSecuencia(i)}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      + Agregar secuencia
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={agregarTema}
                  className="bg-[#003B7A] hover:bg-[#002F63] text-white px-5 py-3 rounded-lg font-bold"
                >
                  + Agregar tema
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-sm text-yellow-900">
              <strong>Nota pedagógica:</strong> no copies el desarrollo completo
              de la guía didáctica. Registra solo temas y secuencias resumidas
              para orientar la planificación docente.
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={guardando}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-bold"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>

              <Link
                href="/admin/unidades"
                className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg font-bold"
              >
                ← Volver
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}