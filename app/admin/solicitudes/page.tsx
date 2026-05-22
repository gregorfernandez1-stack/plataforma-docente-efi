"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function SolicitudesDocentesPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aprobando, setAprobando] = useState<string | null>(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("solicitudes_docentes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando solicitudes:", error);
      setLoading(false);
      return;
    }

    setSolicitudes(data || []);
    setLoading(false);
  };

  const aprobarDocente = async (solicitud: any) => {
    try {
      setAprobando(solicitud.id);

      const res = await fetch("/api/admin/aprobar-docente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: solicitud.id,
          nombre: solicitud.nombre,
          correo: solicitud.correo,
          centro: solicitud.centro,
        }),
      });

      const resultado = await res.json();

      if (!res.ok) {
        alert(resultado.error || "Error al aprobar docente");
        return;
      }

      alert("Docente aprobado correctamente");
      await cargarSolicitudes();
    } catch (error) {
      console.error("Error aprobando docente:", error);
      alert("Ocurrió un error al aprobar el docente");
    } finally {
      setAprobando(null);
    }
  };
return (
<div className="min-h-screen bg-[#F5F7FA] flex">

   <AdminSidebar />

   <main className="ml-[170px] w-full p-6">
      {/* contenido */}
   </main>

</div>
)

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 mb-6 text-[#003B7A] font-bold hover:underline"
        >
          ← Volver al panel
        </Link>

        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#003B7A]">
                Solicitudes de docentes
              </h1>
              <p className="text-gray-600 mt-2">
                Revisa, aprueba y administra las solicitudes de acceso de los
                docentes al sistema.
              </p>
            </div>

            <div className="bg-[#003B7A]/10 text-[#003B7A] px-5 py-3 rounded-xl font-bold">
              Total: {solicitudes.length}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500 font-semibold">
              Cargando solicitudes...
            </div>
          ) : solicitudes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
              <p className="text-gray-500 font-semibold">
                No hay solicitudes registradas.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {solicitudes.map((solicitud) => {
                const aprobado = solicitud.estado === "aprobado";

                return (
                  <div
                    key={solicitud.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition bg-white"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-[#003B7A]/10 flex items-center justify-center text-xl">
                          🧑‍🏫
                        </div>

                        <div>
                          <h2 className="text-lg font-extrabold text-gray-800">
                            {solicitud.nombre}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {solicitud.correo}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-3">
                        <span className="font-bold text-gray-700">
                          Centro educativo:
                        </span>{" "}
                        {solicitud.centro}
                      </p>

                      <span
                        className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full ${
                          aprobado
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {aprobado ? "Aprobado" : "Pendiente"}
                      </span>
                    </div>

                    <div>
                      {aprobado ? (
                        <button
                          disabled
                          className="bg-gray-200 text-gray-500 px-5 py-3 rounded-xl font-bold cursor-not-allowed"
                        >
                          Aprobado
                        </button>
                      ) : (
                        <button
                          onClick={() => aprobarDocente(solicitud)}
                          disabled={aprobando === solicitud.id}
                          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold transition disabled:opacity-60"
                        >
                          {aprobando === solicitud.id
                            ? "Aprobando..."
                            : "Aprobar docente"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}