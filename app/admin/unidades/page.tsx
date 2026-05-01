"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUnidades();
  }, []);

  const cargarUnidades = async () => {
    const { data, error } = await supabase
      .from("unidades")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setUnidades(data);
    setLoading(false);
  };

  const eliminarUnidad = async (id: string) => {
    const confirmar = confirm("¿Seguro que deseas eliminar esta unidad?");
    if (!confirmar) return;

    const { error } = await supabase.from("unidades").delete().eq("id", id);

    if (error) {
      alert("Error al eliminar");
      console.log(error);
      return;
    }

    cargarUnidades();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-8">
        <p className="text-[#003B7A] font-semibold">Cargando unidades...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-8 py-10">
      <section className="max-w-6xl mx-auto">
        <Link
          href="/admin"
          className="inline-block mb-6 text-[#003B7A] font-bold hover:underline"
        >
          ← Volver al panel
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h1 className="text-3xl font-extrabold text-[#003B7A]">
                Biblioteca curricular
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona las unidades didácticas, secuencias, actividades y
                aspectos curriculares que utilizarán los docentes.
              </p>
            </div>

            <Link
              href="/admin/unidades/nueva"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow text-center"
            >
              + Nueva unidad
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow p-5 border">
            <p className="text-gray-500 text-sm font-semibold">Total</p>
            <h2 className="text-3xl font-extrabold text-[#003B7A]">
              {unidades.length}
            </h2>
            <p className="text-gray-600 text-sm">unidades registradas</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 border">
            <p className="text-gray-500 text-sm font-semibold">Niveles</p>
            <h2 className="text-3xl font-extrabold text-[#003B7A]">
              {new Set(unidades.map((u) => u.nivel).filter(Boolean)).size}
            </h2>
            <p className="text-gray-600 text-sm">niveles con contenido</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 border">
            <p className="text-gray-500 text-sm font-semibold">Grados</p>
            <h2 className="text-3xl font-extrabold text-[#003B7A]">
              {new Set(unidades.map((u) => u.grado).filter(Boolean)).size}
            </h2>
            <p className="text-gray-600 text-sm">grados configurados</p>
          </div>
        </div>

        {unidades.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center border">
            <h2 className="text-2xl font-bold text-[#003B7A] mb-2">
              No hay unidades creadas
            </h2>
            <p className="text-gray-600 mb-6">
              Comienza creando la primera unidad curricular de Educación Física.
            </p>

            <Link
              href="/admin/unidades/nueva"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold"
            >
              Crear primera unidad
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {unidades.map((unidad) => (
              <section
                key={unidad.id}
                className="bg-white rounded-2xl shadow border border-gray-100 p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-blue-50 text-[#003B7A] px-3 py-1 rounded-full text-sm font-bold">
                        {unidad.nivel || "Nivel no definido"}
                      </span>

                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        Grado {unidad.grado || "—"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-[#003B7A]">
                      {unidad.titulo || "Unidad sin título"}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div className="bg-gray-50 p-4 rounded-xl border">
                        <p className="font-bold text-gray-800">
                          Eje transversal
                        </p>
                        <p className="text-gray-600 mt-1">
                          {unidad.eje_transversal || "No registrado"}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border">
                        <p className="font-bold text-gray-800">
                          Estrategias
                        </p>
                        <p className="text-gray-600 mt-1">
                          {unidad.estrategias || "No registradas"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-50 p-4 rounded-xl border">
                      <p className="font-bold text-gray-800">
                        Competencias específicas
                      </p>
                      <p className="text-gray-600 mt-1">
                        {unidad.competencias_especificas
                          ? unidad.competencias_especificas.slice(0, 220) +
                            "..."
                          : "No registradas"}
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3">
                    <Link
                      href={`/admin/unidades/editar/${unidad.id}`}
                      className="bg-[#003B7A] hover:bg-[#002F63] text-white px-5 py-3 rounded-xl font-bold text-center"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => eliminarUnidad(unidad.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}