"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditarPlanificacion() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);

  const [centro, setCentro] = useState("");
  const [docente, setDocente] = useState("");
  const [nivel, setNivel] = useState("");
  const [grado, setGrado] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [fecha, setFecha] = useState("");
  const [regional, setRegional] = useState("");
  const [distrito, setDistrito] = useState("");
  const [codigoDistrito, setCodigoDistrito] = useState("");
  const [tiempoAsignado, setTiempoAsignado] = useState("");
  const [asignatura, setAsignatura] = useState("Educación Física");

  const [unidad, setUnidad] = useState("");
  const [situacion, setSituacion] = useState("");

  const [ejeTransversal, setEjeTransversal] = useState("");
  const [estrategias, setEstrategias] = useState("");
  const [gruposCompetencias, setGruposCompetencias] = useState("");
  const [competenciasEspecificas, setCompetenciasEspecificas] = useState("");
  const [areasArticuladas, setAreasArticuladas] = useState("");
  const [conceptual, setConceptual] = useState("");
  const [procedimental, setProcedimental] = useState("");
  const [actitudinal, setActitudinal] = useState("");
  const [indicadores, setIndicadores] = useState("");

  const [secuencias, setSecuencias] = useState<any[]>([]);

  useEffect(() => {
    if (id) cargarPlanificacion();
  }, [id]);

  const convertirArrayATexto = (valor: any) => {
    if (Array.isArray(valor)) return valor.join("\n");
    return valor || "";
  };

  const convertirTextoAArray = (texto: string) => {
    return texto
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");
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

    let secuenciasGuardadas = data?.secuencias;

    if (typeof secuenciasGuardadas === "string") {
      try {
        secuenciasGuardadas = JSON.parse(secuenciasGuardadas);
      } catch {
        secuenciasGuardadas = [];
      }
    }

    setCentro(data.centro || "");
    setDocente(data.docente || "");
    setNivel(data.nivel || "");
    setGrado(data.grado || "");
    setPeriodo(data.periodo || "");
    setFecha(data.fecha || "");
    setRegional(data.regional || "");
    setDistrito(data.distrito || "");
    setCodigoDistrito(data.codigo_distrito || "");
    setTiempoAsignado(data.tiempo_asignado || "");
    setAsignatura("Educación Física");

    setUnidad(data.unidad || "");
    setSituacion(data.situacion || "");

    setEjeTransversal(data.eje_transversal || "");
    setEstrategias(data.estrategias || "");
    setGruposCompetencias(convertirArrayATexto(data.grupos_competencias));
    setCompetenciasEspecificas(data.competencias_especificas || "");
    setAreasArticuladas(convertirArrayATexto(data.areas_articuladas));

    setConceptual(data.contenidos?.conceptual || "");
    setProcedimental(data.contenidos?.procedimental || "");
    setActitudinal(data.contenidos?.actitudinal || "");

    setIndicadores(data.indicadores || "");

    setSecuencias(Array.isArray(secuenciasGuardadas) ? secuenciasGuardadas : []);
    setLoading(false);
  };

  const agregarSecuencia = () => {
    setSecuencias([...secuencias, { nombre: "", actividades: [""] }]);
  };

  const eliminarSecuencia = (index: number) => {
    setSecuencias(secuencias.filter((_, i) => i !== index));
  };

  const cambiarNombreSecuencia = (index: number, value: string) => {
    const nuevas = [...secuencias];
    nuevas[index].nombre = value;
    setSecuencias(nuevas);
  };

  const agregarActividad = (secIndex: number) => {
    const nuevas = [...secuencias];
    nuevas[secIndex].actividades = [...(nuevas[secIndex].actividades || []), ""];
    setSecuencias(nuevas);
  };

  const eliminarActividad = (secIndex: number, actIndex: number) => {
    const nuevas = [...secuencias];
    nuevas[secIndex].actividades = nuevas[secIndex].actividades.filter(
      (_: string, i: number) => i !== actIndex
    );
    setSecuencias(nuevas);
  };

  const cambiarActividad = (
    secIndex: number,
    actIndex: number,
    value: string
  ) => {
    const nuevas = [...secuencias];
    nuevas[secIndex].actividades[actIndex] = value;
    setSecuencias(nuevas);
  };

  const guardarCambios = async () => {
    const { error } = await supabase
      .from("planificaciones")
      .update({
        centro,
        docente,
        nivel,
        grado,
        periodo,
        fecha,
        regional,
        distrito,
        codigo_distrito: codigoDistrito,
        tiempo_asignado: tiempoAsignado,

        unidad,
        situacion,

        eje_transversal: ejeTransversal,
        estrategias,
        competencias_especificas: competenciasEspecificas,
        grupos_competencias: convertirTextoAArray(gruposCompetencias),
        areas_articuladas: convertirTextoAArray(areasArticuladas),
        indicadores,

        contenidos: {
          conceptual,
          procedimental,
          actitudinal,
        },

        secuencias,
      })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      alert("Planificación actualizada correctamente");
      router.push(`/docente/mis-planificaciones/${id}`);
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push(`/docente/mis-planificaciones/${id}`)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
          >
            ← Volver
          </button>

          <button
            onClick={guardarCambios}
            className="bg-[#003B7A] hover:bg-[#002F63] text-white px-6 py-3 rounded-lg font-bold"
          >
            Guardar cambios
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-[#003B7A] mb-8">
          Editar planificación
        </h1>

        <div className="mb-10 rounded-2xl border overflow-hidden">
          <div className="bg-[#003B7A] text-white text-center py-3">
            <h2 className="text-xl font-bold">Datos generales</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 p-6">
            <input value={centro} onChange={(e) => setCentro(e.target.value)} className="border p-3 rounded-lg" placeholder="Centro educativo" />
            <input value={docente} onChange={(e) => setDocente(e.target.value)} className="border p-3 rounded-lg" placeholder="Docente" />
            <input value={nivel} onChange={(e) => setNivel(e.target.value)} className="border p-3 rounded-lg" placeholder="Nivel" />

            <input value={grado} onChange={(e) => setGrado(e.target.value)} className="border p-3 rounded-lg" placeholder="Grado" />
            <input value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="border p-3 rounded-lg" placeholder="Periodo" />
            <input value={fecha} onChange={(e) => setFecha(e.target.value)} className="border p-3 rounded-lg" placeholder="Fecha" />

            <input value={regional} onChange={(e) => setRegional(e.target.value)} className="border p-3 rounded-lg" placeholder="Regional" />
            <input value={distrito} onChange={(e) => setDistrito(e.target.value)} className="border p-3 rounded-lg" placeholder="Distrito" />
            <input value={codigoDistrito} onChange={(e) => setCodigoDistrito(e.target.value)} className="border p-3 rounded-lg" placeholder="Código distrito" />

            <input value={tiempoAsignado} onChange={(e) => setTiempoAsignado(e.target.value)} className="border p-3 rounded-lg" placeholder="Tiempo asignado" />
            <input value={asignatura} readOnly className="border p-3 rounded-lg bg-gray-100" placeholder="Asignatura" />
          </div>
        </div>

        <div className="mb-10 rounded-2xl border overflow-hidden">
          <div className="bg-[#003B7A] text-white text-center py-3">
            <h2 className="text-xl font-bold">Unidad y situación de aprendizaje</h2>
          </div>

          <div className="p-6 space-y-5">
            <input
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="w-full border p-3 rounded-lg"
              placeholder="Unidad"
            />

            <textarea
              value={situacion}
              onChange={(e) => setSituacion(e.target.value)}
              rows={6}
              className="w-full border p-4 rounded-lg"
              placeholder="Situación de aprendizaje"
            />
          </div>
        </div>

        <div className="mb-10 rounded-2xl border overflow-hidden">
          <div className="bg-[#003B7A] text-white text-center py-3">
            <h2 className="text-xl font-bold">Aspectos curriculares</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 p-6">
            <textarea value={ejeTransversal} onChange={(e) => setEjeTransversal(e.target.value)} className="border p-3 rounded-lg" rows={4} placeholder="Eje transversal" />
            <textarea value={estrategias} onChange={(e) => setEstrategias(e.target.value)} className="border p-3 rounded-lg" rows={4} placeholder="Estrategias de enseñanza y aprendizaje" />

            <textarea value={gruposCompetencias} onChange={(e) => setGruposCompetencias(e.target.value)} className="border p-3 rounded-lg md:col-span-2" rows={6} placeholder="Grupo de competencias fundamentales. Escribe una por línea." />

            <textarea value={competenciasEspecificas} onChange={(e) => setCompetenciasEspecificas(e.target.value)} className="border p-3 rounded-lg md:col-span-2" rows={4} placeholder="Competencias específicas del grado" />

            <textarea value={areasArticuladas} onChange={(e) => setAreasArticuladas(e.target.value)} className="border p-3 rounded-lg md:col-span-2" rows={4} placeholder="Áreas articuladas. Escribe una por línea." />

            <textarea value={conceptual} onChange={(e) => setConceptual(e.target.value)} className="border p-3 rounded-lg" rows={4} placeholder="Contenido conceptual" />
            <textarea value={procedimental} onChange={(e) => setProcedimental(e.target.value)} className="border p-3 rounded-lg" rows={4} placeholder="Contenido procedimental" />
            <textarea value={actitudinal} onChange={(e) => setActitudinal(e.target.value)} className="border p-3 rounded-lg md:col-span-2" rows={4} placeholder="Contenido actitudinal" />

            <textarea value={indicadores} onChange={(e) => setIndicadores(e.target.value)} className="border p-3 rounded-lg md:col-span-2" rows={4} placeholder="Indicadores de logro" />
          </div>
        </div>

        <div className="mb-10 rounded-2xl border overflow-hidden">
          <div className="bg-[#003B7A] text-white text-center py-3">
            <h2 className="text-xl font-bold">Secuencias</h2>
          </div>

          <div className="p-6">
            {secuencias.length === 0 && (
              <p className="text-gray-600 mb-4">No hay secuencias registradas.</p>
            )}

            {secuencias.map((sec, secIndex) => (
              <div key={secIndex} className="border rounded-xl p-5 mb-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-[#003B7A]">
                    Secuencia {secIndex + 1}
                  </h3>

                  <button
                    onClick={() => eliminarSecuencia(secIndex)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Eliminar secuencia
                  </button>
                </div>

                <input
                  value={sec.nombre || ""}
                  onChange={(e) => cambiarNombreSecuencia(secIndex, e.target.value)}
                  className="w-full border p-3 rounded-lg mb-4"
                  placeholder="Nombre de la secuencia"
                />

                <h4 className="font-semibold mb-3">Actividades</h4>

                {(sec.actividades || []).map((act: string, actIndex: number) => (
                  <div key={actIndex} className="flex gap-3 mb-3">
                    <textarea
                      value={act}
                      onChange={(e) => cambiarActividad(secIndex, actIndex, e.target.value)}
                      className="w-full border p-3 rounded-lg"
                      rows={2}
                      placeholder={`Actividad ${actIndex + 1}`}
                    />

                    <button
                      onClick={() => eliminarActividad(secIndex, actIndex)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg"
                    >
                      X
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => agregarActividad(secIndex)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  + Agregar actividad
                </button>
              </div>
            ))}

            <button
              onClick={agregarSecuencia}
              className="bg-[#003B7A] hover:bg-[#002F63] text-white px-5 py-3 rounded-lg font-bold"
            >
              + Agregar secuencia
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={guardarCambios}
            className="bg-[#003B7A] hover:bg-[#002F63] text-white px-8 py-3 rounded-lg font-bold"
          >
            Guardar cambios
          </button>
        </div>
      </section>
    </main>
  );
}