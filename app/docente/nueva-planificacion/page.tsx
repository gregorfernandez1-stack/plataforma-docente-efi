"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NuevaPlanificacion() {
  const router = useRouter();

  const [centro, setCentro] = useState("");
  const [docente, setDocente] = useState("");
  const [regional, setRegional] = useState("");
  const [distrito, setDistrito] = useState("");
  const [nivel, setNivel] = useState("");
  const [grado, setGrado] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [tiempoAsignado, setTiempoAsignado] = useState("");
  const [fecha, setFecha] = useState("");
  const [unidadSeleccionada, setUnidadSeleccionada] = useState("");
  const [situacion, setSituacion] = useState("");
  const [generandoSituacion, setGenerandoSituacion] = useState(false);

  const [unidadesDelGrado, setUnidadesDelGrado] = useState<any[]>([]);
  const [cargandoUnidades, setCargandoUnidades] = useState(false);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  const codigoDistrito =
    regional && distrito ? `${regional}-${distrito.padStart(2, "0")}` : "";

  const unidadData = unidadesDelGrado.find(
    (unidad: any) => String(unidad.id) === unidadSeleccionada
  );

  const obtenerSecuencias = () => {
    if (!unidadData?.secuencias) return [];

    if (Array.isArray(unidadData.secuencias)) return unidadData.secuencias;

    if (typeof unidadData.secuencias === "string") {
      try {
        const parsed = JSON.parse(unidadData.secuencias);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  const secuenciasUnidad = obtenerSecuencias();

  useEffect(() => {
    cargarPerfilDocente();
  }, []);

  useEffect(() => {
    if (nivel && grado) {
      cargarUnidadesDesdeSupabase();
    } else {
      setUnidadesDelGrado([]);
      setUnidadSeleccionada("");
    }
  }, [nivel, grado]);

  const cargarPerfilDocente = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Debes iniciar sesión.");
      router.push("/login-docente");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("nombre, centro, rol, autorizado")
      .eq("email", user.email)
      .single();

    if (error || !profile) {
      alert("Tu perfil no está configurado. Contacta al administrador.");
      await supabase.auth.signOut();
      router.push("/login-docente");
      return;
    }

    if (profile.rol !== "docente" || !profile.autorizado) {
      alert("Tu cuenta docente no está autorizada.");
      await supabase.auth.signOut();
      router.push("/login-docente");
      return;
    }

    if (!profile.nombre || !profile.centro) {
      alert("Tu perfil no tiene nombre o centro asignado.");
      await supabase.auth.signOut();
      router.push("/login-docente");
      return;
    }

    setDocente(profile.nombre);
    setCentro(profile.centro);
    setCargandoPerfil(false);
  };

  const cargarUnidadesDesdeSupabase = async () => {
    setCargandoUnidades(true);

    const { data, error } = await supabase
      .from("unidades")
      .select("*")
      .eq("nivel", nivel)
      .eq("grado", grado)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      alert("Error cargando unidades desde Supabase");
      setUnidadesDelGrado([]);
    } else {
      setUnidadesDelGrado(data || []);
    }

    setCargandoUnidades(false);
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const generarSituacionConIA = async () => {
    if (!nivel || !grado || !unidadSeleccionada || !unidadData) {
      alert("Primero selecciona nivel, grado y unidad.");
      return "";
    }

    setGenerandoSituacion(true);

    try {
      const res = await fetch("/api/ia/generar-situacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nivel,
          grado,
          unidad: unidadData.titulo || "",
          centro,
          docente,
          ejeTransversal: unidadData.eje_transversal || "",
          estrategias: unidadData.estrategias || "",
          competencias: unidadData.competencias_especificas || "",
          indicadores: unidadData.indicadores_logro || "",
          contenidos: {
            conceptual: unidadData.contenidos_conceptuales || "",
            procedimental: unidadData.contenidos_procedimentales || "",
            actitudinal: unidadData.contenidos_actitudinales || "",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error generando la situación con IA.");
        return "";
      }

      if (data.texto) {
        setSituacion(data.texto);
        return data.texto;
      }

      alert("No se pudo generar la situación.");
      return "";
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al conectar con la IA.");
      return "";
    } finally {
      setGenerandoSituacion(false);
    }
  };

  const guardarPlanificacion = async () => {
    if (
      !centro ||
      !docente ||
      !nivel ||
      !grado ||
      !periodo ||
      !unidadSeleccionada ||
      !unidadData
    ) {
      alert("Completa nivel, grado, período y unidad.");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Debes iniciar sesión para guardar la planificación.");
      return;
    }

    const situacionFinal = situacion.trim();

    if (!situacionFinal) {
      alert("Genera o redacta la situación de aprendizaje antes de guardar.");
      return;
    }

    const { error } = await supabase.from("planificaciones").insert([
      {
        user_id: user.id,
        centro,
        docente,
        regional,
        distrito,
        codigo_distrito: codigoDistrito,
        nivel,
        grado,
        periodo,
        tiempo_asignado: tiempoAsignado,
        fecha,
        unidad: unidadData.titulo || "",
        situacion: situacionFinal,
        eje_transversal: unidadData.eje_transversal || "",
        estrategias: unidadData.estrategias || "",
        grupos_competencias: unidadData.grupos_competencias || "",
        competencias_especificas: unidadData.competencias_especificas || "",
        areas_articuladas: unidadData.areas_articuladas || "",
        indicadores: unidadData.indicadores_logro || "",
        contenidos: {
          conceptual: unidadData.contenidos_conceptuales || "",
          procedimental: unidadData.contenidos_procedimentales || "",
          actitudinal: unidadData.contenidos_actitudinales || "",
        },
        secuencias: secuenciasUnidad,
      },
    ]);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("Planificación guardada correctamente");
      router.push("/docente/mis-planificaciones");
    }
  };

  if (cargandoPerfil) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <p className="text-[#1E6091] font-bold">Cargando perfil docente...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#F5F7FA] font-sans">
      <aside className="w-[260px] bg-[#1E6091] text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-10">Docente</h2>

          <nav className="flex flex-col gap-3">
            <Link
              href="/docente"
              className="hover:bg-[#144d74] px-4 py-2 rounded-lg"
            >
              Panel
            </Link>

            <Link
              href="/docente/nueva-planificacion"
              className="bg-[#144d74] px-4 py-2 rounded-lg font-semibold"
            >
              Nueva planificación
            </Link>

            <Link
              href="/docente/mis-planificaciones"
              className="hover:bg-[#144d74] px-4 py-2 rounded-lg"
            >
              Mis planificaciones
            </Link>

            <Link
              href="/docente/biblioteca"
              className="hover:bg-[#144d74] px-4 py-2 rounded-lg"
            >
              Biblioteca curricular
            </Link>
          </nav>
        </div>

        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
        >
          Cerrar sesión
        </button>
      </aside>

      <section className="flex-1 p-10">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1E6091]">
                Planificación de Unidad
              </h1>
              <p className="text-gray-700 mt-2">
                El nombre del docente y el centro se cargan desde el perfil
                autorizado.
              </p>
            </div>

            <Link
              href="/docente"
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
            >
              ← Volver
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <input
                value={centro}
                readOnly
                placeholder="Centro educativo"
                className="border p-3 rounded-lg w-full bg-gray-100 cursor-not-allowed"
              />

              <p className="text-gray-600 text-sm mt-2">
                <strong>Asignatura:</strong> Educación Física
              </p>
            </div>

            <input
              value={docente}
              readOnly
              placeholder="Nombre del docente"
              className="border p-3 rounded-lg bg-gray-100 cursor-not-allowed"
            />

            <select
              value={regional}
              onChange={(e) => setRegional(e.target.value)}
              className="border p-3 rounded-lg"
            >
              <option value="">Regional</option>
              {[...Array(18)].map((_, i) => (
                <option key={i} value={String(i + 1)}>
                  Regional {i + 1}
                </option>
              ))}
            </select>

            <select
              value={distrito}
              onChange={(e) => setDistrito(e.target.value)}
              className="border p-3 rounded-lg"
            >
              <option value="">Distrito</option>
              {[...Array(10)].map((_, i) => (
                <option key={i} value={String(i + 1)}>
                  Distrito {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>

            <input
              value={codigoDistrito}
              readOnly
              placeholder="Código distrito"
              className="border p-3 rounded-lg bg-gray-100"
            />

            <select
              value={nivel}
              onChange={(e) => {
                setNivel(e.target.value);
                setGrado("");
                setUnidadSeleccionada("");
                setSituacion("");
              }}
              className="border p-3 rounded-lg"
            >
              <option value="">Nivel educativo</option>
              <option value="Primario">Primario</option>
              <option value="Secundario">Secundario</option>
            </select>

            <select
              value={grado}
              onChange={(e) => {
                setGrado(e.target.value);
                setUnidadSeleccionada("");
                setSituacion("");
              }}
              className="border p-3 rounded-lg"
              disabled={!nivel}
            >
              <option value="">
                {nivel ? "Grado" : "Primero selecciona un nivel"}
              </option>
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <option key={g} value={String(g)}>
                  {g}°
                </option>
              ))}
            </select>

            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="border p-3 rounded-lg"
            >
              <option value="">Período</option>
              {[1, 2, 3, 4].map((p) => (
                <option key={p} value={String(p)}>
                  Período {p}
                </option>
              ))}
            </select>

            <input
              value={tiempoAsignado}
              onChange={(e) => setTiempoAsignado(e.target.value)}
              placeholder="Tiempo asignado (Ej: 1 mes)"
              className="border p-3 rounded-lg"
            />

            <input
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              placeholder="Fecha (Ej: abril-mayo)"
              className="border p-3 rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold text-[#1E6091]">
              Unidad didáctica
            </label>

            <select
              value={unidadSeleccionada}
              onChange={(e) => {
                setUnidadSeleccionada(e.target.value);
                setSituacion("");
              }}
              className="w-full border p-3 rounded-lg mt-2"
              disabled={
                !nivel ||
                !grado ||
                cargandoUnidades ||
                unidadesDelGrado.length === 0
              }
            >
              <option value="">
                {!nivel
                  ? "Primero selecciona un nivel"
                  : !grado
                  ? "Primero selecciona un grado"
                  : cargandoUnidades
                  ? "Cargando unidades..."
                  : unidadesDelGrado.length === 0
                  ? "No hay unidades guardadas para este nivel y grado"
                  : "Seleccionar unidad didáctica"}
              </option>

              {unidadesDelGrado.map((unidad: any) => (
                <option key={unidad.id} value={String(unidad.id)}>
                  {unidad.titulo}
                </option>
              ))}
            </select>
          </div>

          {unidadData && (
            <div className="mb-8 border border-gray-200 rounded-2xl overflow-hidden bg-white">
              <div className="bg-[#1E6091] text-white px-6 py-4">
                <h2 className="text-xl font-bold">
                  Aspectos curriculares de la unidad
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  Información cargada desde la biblioteca curricular.
                </p>
              </div>

              <div className="p-6 grid gap-5">
                <div>
                  <h3 className="font-bold text-[#1E6091] mb-2">Unidad</h3>
                  <p className="text-gray-700">{unidadData.titulo}</p>
                </div>

                <div>
                  <h3 className="font-bold text-[#1E6091] mb-2">
                    Eje transversal
                  </h3>
                  <p className="text-gray-700">
                    {unidadData.eje_transversal}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[#1E6091] mb-2">
                    Estrategias
                  </h3>
                  <p className="text-gray-700">{unidadData.estrategias}</p>
                </div>

                <div>
                  <h3 className="font-bold text-[#1E6091] mb-2">
                    Competencias específicas
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {unidadData.competencias_especificas}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[#1E6091] mb-2">
                    Grupos de competencias
                  </h3>

                  <ul className="list-disc ml-6 text-gray-700">
                    {(Array.isArray(unidadData.grupos_competencias)
                      ? unidadData.grupos_competencias
                      : []
                    ).map((grupo: string, index: number) => (
                      <li key={index}>{grupo}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[#1E6091] mb-2">
                    Áreas articuladas
                  </h3>

                  <ul className="list-disc ml-6 text-gray-700">
                    {(Array.isArray(unidadData.areas_articuladas)
                      ? unidadData.areas_articuladas
                      : []
                    ).map((area: string, index: number) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[#1E6091] mb-3">
                    Contenidos curriculares
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-xl p-4 bg-gray-50">
                      <h4 className="font-bold text-gray-800 mb-2">
                        Conceptual
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {unidadData.contenidos_conceptuales}
                      </p>
                    </div>

                    <div className="border rounded-xl p-4 bg-gray-50">
                      <h4 className="font-bold text-gray-800 mb-2">
                        Procedimental
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {unidadData.contenidos_procedimentales}
                      </p>
                    </div>

                    <div className="border rounded-xl p-4 bg-gray-50">
                      <h4 className="font-bold text-gray-800 mb-2">
                        Actitudinal
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {unidadData.contenidos_actitudinales}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#1E6091] mb-2">
                    Indicadores de logro
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {unidadData.indicadores_logro}
                  </p>
                </div>

                <div className="border border-[#BFDCEB] rounded-2xl p-6 bg-[#EAF4FB]">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1E6091]">
                        Situación de aprendizaje
                      </h2>
                      <p className="text-sm text-gray-700 mt-1">
                        Puedes generarla con IA pedagógica y editarla antes de
                        guardar.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={generarSituacionConIA}
                      disabled={!unidadData || generandoSituacion}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg font-bold"
                    >
                      {generandoSituacion ? "Generando..." : "Generar con IA"}
                    </button>
                  </div>

                  <textarea
                    value={situacion}
                    onChange={(e) => setSituacion(e.target.value)}
                    rows={8}
                    className="w-full border p-4 rounded-lg bg-white"
                    placeholder="Puedes redactar manualmente o generar una situación con IA..."
                  />
                </div>

                <div>
                  <h3 className="font-bold text-[#1E6091] mb-3">
  Temas y secuencias
</h3>

                  {secuenciasUnidad.length === 0 ? (
                    <p className="text-gray-500">
                      Esta unidad no tiene temas registrados.
                    </p>
                  ) : (
                    <div className="grid gap-4">
                      {secuenciasUnidad.map((secuencia: any, index: number) => (
                        <div
                          key={index}
                          className="border rounded-xl overflow-hidden"
                        >
                          <div className="bg-blue-50 px-4 py-3 font-bold text-[#1E6091]">
  Tema {index + 1}: {secuencia.nombre}
</div>

<ul className="list-disc ml-8 py-4 pr-4 text-gray-700">
  {(secuencia.actividades || []).map(
    (actividad: string, i: number) => (
      <li key={i}>
        <strong>Secuencia {i + 1}:</strong> {actividad}
      </li>
    )
  )}
</ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={guardarPlanificacion}
              className="bg-[#1E6091] hover:bg-[#144d74] text-white px-6 py-3 rounded-lg font-bold"
            >
              Guardar planificación
            </button>

            <Link
              href="/docente"
              className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg font-bold"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}