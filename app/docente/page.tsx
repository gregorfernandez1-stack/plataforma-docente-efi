"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PanelDocente() {
  const router = useRouter();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="flex min-h-screen bg-[#F5F7FA] font-sans">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#1E6091] text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-10">Docente</h2>

          <nav className="flex flex-col gap-3">
            <Link
              href="/docente"
              className="bg-[#144d74] px-4 py-2 rounded-lg font-semibold"
            >
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

      {/* CONTENIDO */}
      <section className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E6091] mb-3">
              Panel Docente
            </h1>
            <p className="text-gray-700 text-lg">
              Bienvenido. Desde aquí podrás crear, consultar y gestionar tus
              planificaciones de Educación Física.
            </p>
          </div>

          {/* TARJETAS */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/docente/nueva-planificacion"
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-2xl font-bold text-[#1E6091] mb-3">
                Nueva planificación
              </h2>
              <p className="text-gray-700">
                Selecciona grado, período y unidad para crear una planificación.
              </p>
            </Link>

            <Link
              href="/docente/mis-planificaciones"
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-2xl font-bold text-[#1E6091] mb-3">
                Mis planificaciones
              </h2>
              <p className="text-gray-700">
                Consulta, edita y organiza tus planificaciones guardadas.
              </p>
            </Link>

            <Link
              href="/docente/biblioteca"
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-2xl font-bold text-[#1E6091] mb-3">
                Biblioteca curricular
              </h2>
              <p className="text-gray-700">
                Revisa unidades, contenidos, competencias e indicadores.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}