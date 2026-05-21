"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Momento = {
  tiempo: string;
  actividades: string;
  evidencia: string;
  metacognicion: string;
  recursos: string;
};

type SecuenciaDidactica = {
  titulo: string;
  intencion_pedagogica: string;
  estrategias: string;
  inicio: Momento;
  desarrollo: Momento;
  cierre: Momento;
  evaluacion: {
    tecnica: string;
    instrumento: string;
  };
  acomodacion: string;
};

type Tema = {
  tema: string;
  secuencias: SecuenciaDidactica[];
};

const momentoVacio = (tiempo: string): Momento => ({
  tiempo,
  actividades: "",
  evidencia: "",
  metacognicion: "",
  recursos: "",
});

const nuevaSecuencia = (numero: number): SecuenciaDidactica => ({
  titulo: `Secuencia ${numero}`,
  intencion_pedagogica: "",
  estrategias: "",
  inicio: momentoVacio("10"),
  desarrollo: momentoVacio("25"),
  cierre: momentoVacio("10"),
  evaluacion: {
    tecnica: "Observación directa",
    instrumento: "Registro anecdótico",
  },
  acomodacion:
    "Adecuación de actividades según las necesidades individuales del estudiante.",
});

export default function EditarSecuencias() {
  const { id } = useParams();
  const router = useRouter();

  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  const normalizarTemas = (valor: any): Tema[] => {
    if (!valor) return [];

    try {
      const datos = Array.isArray(valor) ? valor : JSON.parse(valor);

      return datos.map((item: any, index: number) => {
        if (item.tema && Array.isArray(item.secuencias)) {
          return item;
        }

        return {
          tema: item.nombre || `Tema ${index + 1}`,
          secuencias: (item.actividades || []).map(
            (actividad: string, i: number) => ({
              ...nuevaSecuencia(i + 1),
              titulo: `Secuencia ${i + 1}`,
              desarrollo: {
                ...momentoVacio("25"),
                actividades: actividad,
              },
            })
          ),
        };
      });
    } catch {
      return [];
    }
  };

  const cargar = async () => {
    const { data, error } = await supabase
      .from("planificaciones")
      .select("secuencias")
      .eq("id", id)
      .single();

    if (error) {
      alert("Error cargando temas y secuencias");
      setLoading(false);
      return;
    }

    setTemas(normalizarTemas(data?.secuencias || []));
    setLoading(false);
  };

  const agregarTema = () => {
    setTemas([
      ...temas,
      {
        tema: "Nuevo tema",
        secuencias: [nuevaSecuencia(1)],
      },
    ]);
  };

  const eliminarTema = (temaIndex: number) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este tema?");
    if (!confirmar) return;

    const nuevos = [...temas];
    nuevos.splice(temaIndex, 1);
    setTemas(nuevos);
  };

  const cambiarTema = (temaIndex: number, valor: string) => {
    const nuevos = [...temas];
    nuevos[temaIndex].tema = valor;
    setTemas(nuevos);
  };

  const agregarSecuencia = (temaIndex: number) => {
    const nuevos = [...temas];
    const numero = nuevos[temaIndex].secuencias.length + 1;
    nuevos[temaIndex].secuencias.push(nuevaSecuencia(numero));
    setTemas(nuevos);
  };

  const eliminarSecuencia = (temaIndex: number, secIndex: number) => {
    const nuevos = [...temas];
    nuevos[temaIndex].secuencias.splice(secIndex, 1);
    setTemas(nuevos);
  };

  const cambiarCampoSecuencia = (
    temaIndex: number,
    secIndex: number,
    campo: keyof SecuenciaDidactica,
    valor: any
  ) => {
    const nuevos = [...temas];
    (nuevos[temaIndex].secuencias[secIndex] as any)[campo] = valor;
    setTemas(nuevos);
  };

  const cambiarMomento = (
    temaIndex: number,
    secIndex: number,
    momento: "inicio" | "desarrollo" | "cierre",
    campo: keyof Momento,
    valor: string
  ) => {
    const nuevos = [...temas];
    nuevos[temaIndex].secuencias[secIndex][momento][campo] = valor;
    setTemas(nuevos);
  };

  const cambiarEvaluacion = (
    temaIndex: number,
    secIndex: number,
    campo: "tecnica" | "instrumento",
    valor: string
  ) => {
    const nuevos = [...temas];
    nuevos[temaIndex].secuencias[secIndex].evaluacion[campo] = valor;
    setTemas(nuevos);
  };

  const guardar = async () => {
    const { error } = await supabase
      .from("planificaciones")
      .update({ secuencias: temas })
      .eq("id", id);

    if (error) {
      alert("Error guardando: " + error.message);
    } else {
      alert("Temas y secuencias actualizados correctamente");
      router.push("/docente/mis-planificaciones");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <p className="text-[#003B7A] font-bold">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow">
        <Link
          href="/docente/mis-planificaciones"
          className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          ← Volver a mis planificaciones
        </Link>

        <h1 className="text-3xl font-bold text-[#003B7A] mb-2">
          Editar temas y secuencias didácticas
        </h1>

        <p className="text-gray-600 mb-8">
          Personaliza los temas y las secuencias sin romper la coherencia
          curricular de la unidad.
        </p>

        <button
          onClick={agregarTema}
          className="mb-6 bg-green-600 text-white px-5 py-3 rounded-lg font-bold"
        >
          + Agregar tema
        </button>

        {temas.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
            <p className="text-yellow-800 font-semibold">
              Esta planificación no tiene temas registrados.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {temas.map((tema, temaIndex) => (
              <div
                key={temaIndex}
                className="border rounded-2xl p-6 bg-blue-50"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
                  <input
                    value={tema.tema}
                    onChange={(e) => cambiarTema(temaIndex, e.target.value)}
                    className="flex-1 border p-3 rounded-lg font-bold text-[#003B7A]"
                  />

                  <button
                    onClick={() => eliminarTema(temaIndex)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
                  >
                    Eliminar tema
                  </button>
                </div>

                <button
                  onClick={() => agregarSecuencia(temaIndex)}
                  className="mb-5 bg-[#003B7A] text-white px-4 py-2 rounded-lg font-bold"
                >
                  + Agregar secuencia
                </button>

                <div className="space-y-6">
                  {tema.secuencias.map((sec, secIndex) => (
                    <div
                      key={secIndex}
                      className="bg-white border rounded-xl p-5"
                    >
                      <div className="flex flex-col md:flex-row gap-3 mb-4">
                        <input
                          value={sec.titulo}
                          onChange={(e) =>
                            cambiarCampoSecuencia(
                              temaIndex,
                              secIndex,
                              "titulo",
                              e.target.value
                            )
                          }
                          className="flex-1 border p-3 rounded-lg font-bold text-green-700"
                        />

                        <button
                          onClick={() =>
                            eliminarSecuencia(temaIndex, secIndex)
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
                        >
                          Eliminar secuencia
                        </button>
                      </div>

                      <div className="grid gap-4 mb-5">
                        <CampoTexto
                          label="Intención pedagógica"
                          value={sec.intencion_pedagogica}
                          onChange={(valor) =>
                            cambiarCampoSecuencia(
                              temaIndex,
                              secIndex,
                              "intencion_pedagogica",
                              valor
                            )
                          }
                        />

                        <CampoTexto
                          label="Estrategias de enseñanza-aprendizaje"
                          value={sec.estrategias}
                          onChange={(valor) =>
                            cambiarCampoSecuencia(
                              temaIndex,
                              secIndex,
                              "estrategias",
                              valor
                            )
                          }
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-5">
                        <EditorMomento
                          titulo="Inicio"
                          datos={sec.inicio}
                          onChange={(campo, valor) =>
                            cambiarMomento(
                              temaIndex,
                              secIndex,
                              "inicio",
                              campo,
                              valor
                            )
                          }
                        />

                        <EditorMomento
                          titulo="Desarrollo"
                          datos={sec.desarrollo}
                          onChange={(campo, valor) =>
                            cambiarMomento(
                              temaIndex,
                              secIndex,
                              "desarrollo",
                              campo,
                              valor
                            )
                          }
                        />

                        <EditorMomento
                          titulo="Cierre"
                          datos={sec.cierre}
                          onChange={(campo, valor) =>
                            cambiarMomento(
                              temaIndex,
                              secIndex,
                              "cierre",
                              campo,
                              valor
                            )
                          }
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-5 mt-5">
                        <div className="border rounded-xl p-4 bg-gray-50">
                          <h3 className="font-bold text-gray-800 mb-3">
                            Evaluación
                          </h3>

                          <label className="block text-sm font-semibold mb-1">
                            Técnica
                          </label>
                          <select
                            value={sec.evaluacion?.tecnica || ""}
                            onChange={(e) =>
                              cambiarEvaluacion(
                                temaIndex,
                                secIndex,
                                "tecnica",
                                e.target.value
                              )
                            }
                            className="w-full border p-2 rounded mb-3"
                          >
                            <option>Observación directa</option>
                            <option>Desempeño</option>
                            <option>Preguntas orales</option>
                            <option>Producción motriz</option>
                          </select>

                          <label className="block text-sm font-semibold mb-1">
                            Instrumento
                          </label>
                          <select
                            value={sec.evaluacion?.instrumento || ""}
                            onChange={(e) =>
                              cambiarEvaluacion(
                                temaIndex,
                                secIndex,
                                "instrumento",
                                e.target.value
                              )
                            }
                            className="w-full border p-2 rounded"
                          >
                            <option>Registro anecdótico</option>
                            <option>Lista de cotejo</option>
                            <option>Escala estimativa</option>
                            <option>Rúbrica</option>
                          </select>
                        </div>

                        <CampoTexto
                          label="Acomodación curricular"
                          value={sec.acomodacion}
                          onChange={(valor) =>
                            cambiarCampoSecuencia(
                              temaIndex,
                              secIndex,
                              "acomodacion",
                              valor
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={guardar}
          className="mt-8 bg-[#003B7A] text-white px-6 py-3 rounded-lg font-bold"
        >
          Guardar cambios
        </button>
      </section>
    </main>
  );
}

function CampoTexto({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
}) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <label className="block font-bold text-gray-800 mb-2">{label}</label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full border p-3 rounded-lg bg-white"
      />
    </div>
  );
}

function EditorMomento({
  titulo,
  datos,
  onChange,
}: {
  titulo: string;
  datos: Momento;
  onChange: (campo: keyof Momento, valor: string) => void;
}) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <h3 className="font-bold text-[#003B7A] mb-3">{titulo}</h3>

      <label className="block text-sm font-semibold mb-1">Tiempo</label>
      <input
        value={datos?.tiempo || ""}
        onChange={(e) => onChange("tiempo", e.target.value)}
        className="w-full border p-2 rounded mb-3"
        placeholder="Ej: 10"
      />

      <label className="block text-sm font-semibold mb-1">Actividades</label>
      <textarea
        value={datos?.actividades || ""}
        onChange={(e) => onChange("actividades", e.target.value)}
        rows={4}
        className="w-full border p-2 rounded mb-3"
      />

      <label className="block text-sm font-semibold mb-1">Evidencia</label>
      <textarea
        value={datos?.evidencia || ""}
        onChange={(e) => onChange("evidencia", e.target.value)}
        rows={3}
        className="w-full border p-2 rounded mb-3"
      />

      <label className="block text-sm font-semibold mb-1">Metacognición</label>
      <textarea
        value={datos?.metacognicion || ""}
        onChange={(e) => onChange("metacognicion", e.target.value)}
        rows={3}
        className="w-full border p-2 rounded mb-3"
      />

      <label className="block text-sm font-semibold mb-1">Recursos</label>
      <textarea
        value={datos?.recursos || ""}
        onChange={(e) => onChange("recursos", e.target.value)}
        rows={3}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}