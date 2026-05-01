"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function MisPlanificaciones() {
  const router = useRouter();
  const [planificaciones, setPlanificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPlanificaciones();
  }, []);

  const cargarPlanificaciones = async () => {
    const { data, error } = await supabase
      .from("planificaciones")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      alert("Error cargando planificaciones");
    } else {
      setPlanificaciones(data || []);
    }

    setLoading(false);
  };

  const eliminarPlanificacion = async (id: number) => {
    const confirmar = confirm("¿Seguro que deseas eliminar esta planificación?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("planificaciones")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      alert("Planificación eliminada correctamente");
      cargarPlanificaciones();
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="flex min-h-screen bg-[#F5F7FA] font-sans">
      <aside className="w-[260px] bg-[#1E6091] text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-10">Docente</h2>

          <nav className="flex flex-col gap-3">
            <Link href="/docente" className="hover:bg-[#144d74] px-4 py-2 rounded-lg">
              Panel
            </Link>

            <Link
              href="/docente/nueva-planificacion"
              className="hover:bg-[#144d74] px-4 py-2 rounded-lg"
            >
              Nueva planificación
            </Link>

            <Link
              href="/docente/mis-planificaciones"
              className="bg-[#144d74] px-4 py-2 rounded-lg font-semibold"
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#1E6091] mb-2">
                Mis planificaciones
              </h1>
              <p className="text-gray-700">
                Consulta, edita, elimina o personaliza tus planificaciones guardadas.
              </p>
            </div>

            <Link
              href="/docente/nueva-planificacion"
              className="bg-[#1E6091] hover:bg-[#144d74] text-white px-5 py-3 rounded-lg font-bold"
            >
              + Nueva planificación
            </Link>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-700">Cargando planificaciones...</p>
            </div>
          ) : planificaciones.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
              <h2 className="text-2xl font-bold text-[#1E6091] mb-3">
                No hay planificaciones guardadas
              </h2>
              <p className="text-gray-700 mb-6">
                Crea tu primera planificación para comenzar a organizar tus clases.
              </p>

              <Link
                href="/docente/nueva-planificacion"
                className="inline-block bg-[#1E6091] hover:bg-[#144d74] text-white px-6 py-3 rounded-lg font-bold"
              >
                Crear planificación
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {planificaciones.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="mb-4">
                    <span className="inline-block bg-[#EAF4FB] text-[#1E6091] px-3 py-1 rounded-full text-sm font-bold mb-3">
                      {p.grado ? `${p.grado} grado` : "Grado no registrado"}
                    </span>

                    <h2 className="text-2xl font-bold text-[#1E6091] mb-2">
                      {p.unidad || "Unidad sin título"}
                    </h2>
                  </div>

                  <div className="space-y-2 text-gray-700 mb-5">
                    <p>
                      <strong>Docente:</strong> {p.docente || "No registrado"}
                    </p>

                    <p>
                      <strong>Periodo:</strong> {p.periodo || "No registrado"}
                    </p>

                    <p>
                      <strong>Fecha:</strong> {p.fecha || "No registrada"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/docente/mis-planificaciones/${p.id}`}
                      className="bg-[#1E6091] hover:bg-[#144d74] text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Ver
                    </Link>

                    <Link
                      href={`/docente/mis-planificaciones/${p.id}/editar`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Editar
                    </Link>

                    <Link
                      href={`/docente/mis-planificaciones/secuencias/${p.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Secuencias
                    </Link>

                    <button
                      onClick={() => eliminarPlanificacion(p.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}