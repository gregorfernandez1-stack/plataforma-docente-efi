"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tema = {
  tema: string;
  secuencias: string[];
};

export default function NuevaUnidadPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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
      tema: "Explorando el concepto",
      secuencias: [""],
    },
  ]);

  const inputStyle =
    "border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#003B7A]";

  const textareaStyle =
    "border border-gray-300 p-3 rounded-lg w-full min-h-[90px] focus:outline-none focus:ring-2 focus:ring-[#003B7A]";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    const nuevos = [...temas];
    nuevos[index].tema = valor;
    setTemas(nuevos);
  };

  const agregarSecuencia = (temaIndex: number) => {
    const nuevos = [...temas];
    nuevos[temaIndex].secuencias.push("");
    setTemas(nuevos);
  };

  const cambiarSecuencia = (
    temaIndex: number,
    secuenciaIndex: number,
    valor: string
  ) => {
    const nuevos = [...temas];
    nuevos[temaIndex].secuencias[secuenciaIndex] = valor;
    setTemas(nuevos);
  };

  const eliminarSecuencia = (temaIndex: number, secuenciaIndex: number) => {
    const nuevos = [...temas];

    if (nuevos[temaIndex].secuencias.length === 1) return;

    nuevos[temaIndex].secuencias.splice(secuenciaIndex, 1);
    setTemas(nuevos);
  };

  const guardarUnidad = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setLoading(true);

    const { error } = await supabase.from("unidades").insert([
      {
        ...form,
        temas: temasLimpios,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error al guardar: " + error.message);
      console.log(error);
      return;
    }

    alert("Unidad creada correctamente");
    router.push("/admin/unidades");
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      <aside className="w-[170px] bg-[#003B7A] text-white min-h-screen p-4 fixed left-0 top-0">
        <h2 className="text-lg font-bold mb-8">Administrador</h2>

        <nav className="space-y-3">
          <Link
            href="/admin"
            className="block bg-white/15 hover:bg-white/25 px-3 py-3 rounded-md text-sm font-semibold"
          >
            Panel principal
          </Link>

          <Link
            href="/admin/solicitudes"
            className="block bg-white/15 hover:bg-white/25 px-3 py-3 rounded-md text-sm font-semibold"
          >
            Solicitudes docentes
          </Link>

          <Link
            href="/admin/unidades"
            className="block bg-white/25 px-3 py-3 rounded-md text-sm font-semibold"
          >
            Unidades didácticas
          </Link>

          <Link
            href="/admin/documentos"
            className="block bg-white/15 hover:bg-white/25 px-3 py-3 rounded-md text-sm font-semibold"
          >
            Documentos curriculares
          </Link>

          <Link
            href="/"
            className="block bg-white/15 hover:bg-white/25 px-3 py-3 rounded-md text-sm font-semibold"
          >
            Ir al inicio
          </Link>

          <button
            onClick={cerrarSesion}
            className="w-full bg-red-600 hover:bg-red-700 px-3 py-3 rounded-md text-sm font-bold mt-6"
          >
            Cerrar sesión
          </button>
        </nav>
      </aside>

      <main className="ml-[170px] min-h-screen w-full px-6 py-10">
        <section className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
          <Link
            href="/admin/unidades"
            className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
          >
            ← Volver a unidades
          </Link>

          <h1 className="text-3xl font-bold text-[#003B7A] mb-2">
            Nueva Unidad Curricular
          </h1>

          <p className="text-gray-600 mb-6">
            Registra la unidad, los aspectos curriculares, temas y secuencias
            resumidas. La plataforma orienta la planificación, pero el docente
            debe consultar la guía didáctica para el desarrollo completo.
          </p>

          <form onSubmit={guardarUnidad} className="space-y-8">
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
                            className="border border-gray-300 p-3 rounded-lg w-full min-h-[70px]"
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
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-bold"
              >
                {loading ? "Guardando..." : "Guardar unidad"}
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
    </div>
  );
}