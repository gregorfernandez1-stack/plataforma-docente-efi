"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BibliotecaPorGrado() {
  const params = useParams();
  const searchParams = useSearchParams();

  const grado = params.grado as string;
  const nivel = searchParams.get("nivel") || "";

  const [unidades, setUnidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUnidades();
  }, [grado, nivel]);

  const cargarUnidades = async () => {
    setLoading(true);

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

        {loading ? (
          <p className="text-gray-600">Cargando información curricular...</p>
        ) : unidades.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-yellow-800">
            No hay unidades registradas para este nivel y grado.
          </div>
        ) : (
          <>
            {/* 1. UNIDADES DIDÁCTICAS */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#003B7A] mb-4">
                1. Unidades didácticas
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {unidades.map((unidad, index) => (
                  <div
                    key={unidad.id || index}
                    className="border rounded-xl p-5 bg-blue-50 shadow-sm"
                  >
                    <h3 className="text-lg font-bold text-[#003B7A]">
                      Unidad {index + 1}
                    </h3>

                    <p className="text-gray-700 mt-2 font-semibold">
                      {unidad.unidad || unidad.nombre || unidad.titulo || "Sin título"}
                    </p>

                    {unidad.situacion && (
                      <p className="text-gray-600 mt-3 text-sm">
                        <strong>Situación de aprendizaje:</strong>{" "}
                        {unidad.situacion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. ASPECTOS CURRICULARES */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                2. Aspectos curriculares
              </h2>

              <div className="space-y-5">
                {unidades.map((unidad, index) => (
                  <div
                    key={unidad.id || index}
                    className="border rounded-xl p-6 bg-purple-50"
                  >
                    <h3 className="text-lg font-bold text-purple-800 mb-4">
                      {unidad.unidad || unidad.nombre || unidad.titulo || `Unidad ${index + 1}`}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                      <Info titulo="Eje transversal" valor={unidad.eje_transversal} />
                      <Info titulo="Estrategias" valor={unidad.estrategias} />
                      <Info titulo="Competencias específicas" valor={unidad.competencias_especificas} />
                      <Info titulo="Indicadores de logro" valor={unidad.indicadores} />
                      <Info titulo="Grupos de competencias" valor={unidad.grupos_competencias} />
                      <Info titulo="Áreas articuladas" valor={unidad.areas_articuladas} />
                      <Info titulo="Contenidos" valor={unidad.contenidos} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. SECUENCIAS Y ACTIVIDADES */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                3. Secuencias y actividades
              </h2>

              <div className="space-y-5">
                {unidades.map((unidad, index) => (
                  <div
                    key={unidad.id || index}
                    className="border rounded-xl p-6 bg-green-50"
                  >
                    <h3 className="text-lg font-bold text-green-800 mb-3">
                      {unidad.unidad || unidad.nombre || unidad.titulo || `Unidad ${index + 1}`}
                    </h3>

                    {unidad.secuencias ? (
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                        {typeof unidad.secuencias === "string"
                          ? unidad.secuencias
                          : JSON.stringify(unidad.secuencias, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-gray-600">
                        No hay secuencias registradas para esta unidad.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 4. DOCUMENTOS CURRICULARES */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            4. Documentos curriculares
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Documento titulo="Diseño curricular" icono="📘" />
            <Documento titulo="Ordenanzas" icono="📜" />
            <Documento titulo="Guías didácticas" icono="📗" />
            <Documento titulo="Calendario escolar" icono="📅" />
            <Documento titulo="Normativas MINERD / INEFI" icono="🏛" />
            <Documento titulo="Otros documentos" icono="📁" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ titulo, valor }: { titulo: string; valor: any }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h4 className="font-bold text-gray-800 mb-2">{titulo}</h4>

      {valor ? (
        <p className="text-sm whitespace-pre-wrap">
          {typeof valor === "string" ? valor : JSON.stringify(valor, null, 2)}
        </p>
      ) : (
        <p className="text-sm text-gray-400">No registrado</p>
      )}
    </div>
  );
}

function Documento({ titulo, icono }: { titulo: string; icono: string }) {
  return (
    <div className="p-4 border rounded-lg hover:bg-gray-100 bg-white cursor-pointer">
      <span className="mr-2">{icono}</span>
      {titulo}
    </div>
  );
}