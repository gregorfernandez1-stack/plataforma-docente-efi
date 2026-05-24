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
      console.error(error);
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
        alert(resultado.error);
        return;
      }

      alert("Docente aprobado");
      cargarSolicitudes();

    } catch (e) {
      console.log(e);
    }

    setAprobando(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">

      <AdminSidebar />

      <section className="ml-[170px] flex-1 p-10">

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 mb-6 text-[#003B7A] font-bold hover:underline"
        >
          ← Volver al panel
        </Link>

        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          <div className="flex justify-between mb-8">

            <div>
              <h1 className="text-3xl font-extrabold text-[#003B7A]">
                Solicitudes docentes
              </h1>

              <p className="text-gray-600 mt-2">
                Revisa y aprueba solicitudes.
              </p>
            </div>

            <div className="bg-[#003B7A]/10 text-[#003B7A] px-5 py-3 rounded-xl font-bold">
              Total: {solicitudes.length}
            </div>

          </div>

          {loading ? (

            <div className="text-center py-10">
              Cargando...
            </div>

          ) : solicitudes.length===0 ? (

            <div className="text-center py-12">

              No hay solicitudes

            </div>

          ) : (

            <div className="grid gap-5">

              {solicitudes.map((solicitud)=>{

                const aprobado =
                solicitud.estado==="aprobado";

                return(

                  <div
                    key={solicitud.id}
                    className="border rounded-xl p-6 bg-white"
                  >

                    <div className="flex justify-between">

                      <div>

                        <h2 className="font-bold text-xl">
                          {solicitud.nombre}
                        </h2>

                        <p>
                          {solicitud.correo}
                        </p>

                        <p className="mt-2">
                          {solicitud.centro}
                        </p>

                      </div>

                      <div>

                        {aprobado ? (

                          <button
                           disabled
                           className="bg-gray-300 px-5 py-3 rounded-xl"
                          >
                            Aprobado
                          </button>

                        ) : (

                          <button
                            onClick={()=>aprobarDocente(solicitud)}
                            disabled={aprobando===solicitud.id}
                            className="bg-green-600 text-white px-5 py-3 rounded-xl"
                          >

                          {aprobando===solicitud.id
                            ? "Aprobando..."
                            :"Aprobar"}

                          </button>

                        )}

                      </div>

                    </div>

                  </div>

                )

              })}

            </div>

          )}

        </section>

      </section>

    </div>
  );

}