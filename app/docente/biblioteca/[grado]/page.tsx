"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Tema = {
  nombre: string;
  actividades: string[];
};

export default function BibliotecaPorGrado() {
  const params = useParams();
  const searchParams = useSearchParams();

  const grado = params.grado as string;
  const nivel = searchParams.get("nivel") || "";

  const [unidades, setUnidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarUnidades() {
      const { data, error } = await supabase
        .from("unidades")
        .select("*")
        .eq("grado", grado)
        .eq("nivel", nivel)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error cargando unidades:", error.message);
        setUnidades([]);
      } else {
        setUnidades(data || []);
      }

      setLoading(false);
    }

    if (grado && nivel) {
      cargarUnidades();
    }
  }, [grado, nivel]);

  const limpiarLista = (valor: any): string[] => {
    if (!valor) return [];

    if (Array.isArray(valor)) return valor;

    if (typeof valor === "string") {
      try {
        const parsed = JSON.parse(valor);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return valor
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .replaceAll('"', "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return [String(valor)];
  };

  const limpiarTemas = (valor: any): Tema[] => {
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
    } catch (error) {
      console.error("Error limpiando temas:", error);
      return [];
    }

    return [];
  };

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

          {loading ? (
            <p>Cargando unidades...</p>
          ) : unidades.length === 0 ? (
            <p className="text-gray-500">
              No hay unidades registradas para este nivel y grado.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {unidades.map((u, i) => (
                <div key={u.id} className="p-5 bg-blue-50 rounded-xl border">
                  <h3 className="font-bold text-[#003B7A]">Unidad {i + 1}</h3>

                  <p className="mt-2 font-semibold">
                    {u.unidad || u.titulo || "Unidad sin título"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. ASPECTOS CURRICULARES */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            2. Aspectos curriculares
          </h2>

          <div className="space-y-6">
            {unidades.map((u, i) => (
              <div key={u.id} className="bg-purple-50 p-6 rounded-xl border">
                <h3 className="font-bold text-purple-800 mb-4">
                  Unidad {i + 1}: {u.unidad || u.titulo || "Unidad sin título"}
                </h3>

                <Bloque titulo="Grupos de competencias">
                  <Lista items={limpiarLista(u.grupos_competencias)} />
                </Bloque>

                <Bloque titulo="Competencias específicas">
                  <p>{u.competencias_especificas || "No registrado"}</p>
                </Bloque>

                <Bloque titulo="Eje transversal">
                  <p>{u.eje_transversal || "No registrado"}</p>
                </Bloque>

                <Bloque titulo="Áreas articuladas">
                  <Lista items={limpiarLista(u.areas_articuladas)} />
                </Bloque>

                <Bloque titulo="Estrategias">
                  <p>{u.estrategias || "No registrado"}</p>
                </Bloque>

                <Bloque titulo="Contenidos conceptuales">
                  <p>{u.contenidos_conceptuales || "No registrado"}</p>
                </Bloque>

                <Bloque titulo="Contenidos procedimentales">
                  <p>{u.contenidos_procedimentales || "No registrado"}</p>
                </Bloque>

                <Bloque titulo="Contenidos actitudinales">
                  <p>{u.contenidos_actitudinales || "No registrado"}</p>
                </Bloque>

                <Bloque titulo="Indicadores de logro">
                  <p>{u.indicadores_logro || "No registrado"}</p>
                </Bloque>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TEMAS Y SECUENCIAS */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            3. Temas y secuencias
          </h2>

          <div className="space-y-6">
            {unidades.map((u, i) => {
              const temas = limpiarTemas(u.secuencias);

              return (
                <div key={u.id} className="bg-green-50 p-6 rounded-xl border">
                  <h3 className="font-bold text-green-800 mb-4">
                    Unidad {i + 1}: {u.unidad || u.titulo || "Unidad sin título"}
                  </h3>

                  {temas.length === 0 ? (
                    <p className="text-gray-500">No hay temas registrados.</p>
                  ) : (
                    <div className="space-y-4">
                      {temas.map((tema, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <h4 className="font-bold text-green-700 mb-3">
                            Tema {index + 1}: {tema.nombre}
                          </h4>

                          <div className="pl-4 space-y-2">
                            {tema.actividades?.map((secuencia, secIndex) => (
                              <div
                                key={secIndex}
                                className="p-3 rounded bg-gray-50 border"
                              >
                                <strong>Secuencia {secIndex + 1}:</strong>{" "}
                                {secuencia}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 bg-white p-4 rounded-lg border">
      <h4 className="font-bold text-gray-800 mb-2">{titulo}</h4>
      <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Lista({ items }: { items: string[] }) {
  if (!items || items.length === 0) {
    return <p>No registrado</p>;
  }

  return (
    <ul className="list-disc pl-6 space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}