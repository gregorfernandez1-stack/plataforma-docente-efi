"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevaUnidadPage() {
  const router = useRouter();

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

  const [secuencias, setSecuencias] = useState<any[]>([
    {
      nombre: "Nueva secuencia",
      actividades: ["Nueva actividad"],
    },
  ]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarSecuencia = () => {
    setSecuencias([
      ...secuencias,
      {
        nombre: "Nueva secuencia",
        actividades: ["Nueva actividad"],
      },
    ]);
  };

  const eliminarSecuencia = (index: number) => {
    const nuevas = [...secuencias];
    nuevas.splice(index, 1);
    setSecuencias(nuevas);
  };

  const cambiarNombreSecuencia = (index: number, valor: string) => {
    const nuevas = [...secuencias];
    nuevas[index].nombre = valor;
    setSecuencias(nuevas);
  };

  const agregarActividad = (index: number) => {
    const nuevas = [...secuencias];
    nuevas[index].actividades.push("Nueva actividad");
    setSecuencias(nuevas);
  };

  const cambiarActividad = (
    secuenciaIndex: number,
    actividadIndex: number,
    valor: string
  ) => {
    const nuevas = [...secuencias];
    nuevas[secuenciaIndex].actividades[actividadIndex] = valor;
    setSecuencias(nuevas);
  };

  const eliminarActividad = (secuenciaIndex: number, actividadIndex: number) => {
    const nuevas = [...secuencias];
    nuevas[secuenciaIndex].actividades.splice(actividadIndex, 1);
    setSecuencias(nuevas);
  };

  const guardarUnidad = async (e: any) => {
    e.preventDefault();

    if (!form.nivel || !form.grado || !form.titulo) {
      alert("Completa nivel, grado y nombre de la unidad.");
      return;
    }

    const { error } = await supabase.from("unidades").insert([
      {
        ...form,
        secuencias,
      },
    ]);

    if (error) {
      alert("Error al guardar: " + error.message);
      console.log(error);
      return;
    }

    alert("Unidad creada correctamente");
    router.push("/admin/unidades");
  };

  const inputStyle =
    "border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#003B7A]";

  const textareaStyle =
    "border border-gray-300 p-3 rounded-lg w-full min-h-[90px] focus:outline-none focus:ring-2 focus:ring-[#003B7A]";

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
        <Link
          href="/admin/unidades"
          className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          ← Volver a unidades
        </Link>

        <h1 className="text-3xl font-bold text-[#003B7A] mb-6">
          Nueva Unidad Curricular
        </h1>

        <form onSubmit={guardarUnidad} className="space-y-8">
       <div className="grid md:grid-cols-3 gap-5">

  {/* NIVEL */}
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

  {/* GRADO */}
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
  </select>

  {/* NOMBRE UNIDAD */}
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
              Secuencias y actividades
            </div>

            <div className="p-5 space-y-6">
              {secuencias.map((secuencia, i) => (
                <div
                  key={i}
                  className="border border-gray-300 rounded-xl p-5 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[#003B7A]">
                      Secuencia {i + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => eliminarSecuencia(i)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Eliminar secuencia
                    </button>
                  </div>

                  <input
                    value={secuencia.nombre}
                    onChange={(e) =>
                      cambiarNombreSecuencia(i, e.target.value)
                    }
                    placeholder="Nombre de la secuencia"
                    className={inputStyle}
                  />

                  <h4 className="font-bold mt-5 mb-3">Actividades</h4>

                  <div className="space-y-3">
                    {secuencia.actividades.map(
                      (actividad: string, j: number) => (
                        <div key={j} className="flex gap-3">
                          <textarea
                            value={actividad}
                            onChange={(e) =>
                              cambiarActividad(i, j, e.target.value)
                            }
                            placeholder="Actividad"
                            className="border border-gray-300 p-3 rounded-lg w-full min-h-[70px]"
                          />

                          <button
                            type="button"
                            onClick={() => eliminarActividad(i, j)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg font-bold"
                          >
                            X
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => agregarActividad(i)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold"
                  >
                    + Agregar actividad
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={agregarSecuencia}
                className="bg-[#003B7A] hover:bg-[#002F63] text-white px-5 py-3 rounded-lg font-bold"
              >
                + Agregar secuencia
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              Guardar unidad
            </button>

            <Link
              href="/admin/unidades"
              className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg font-bold"
            >
              ← Volver
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}