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
      <aside className="w-[280px] bg-[#1E6091] text-white p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">👨‍🏫</span>
            </div>

            <h2 className="text-2xl font-extrabold">Panel Docente</h2>
            <p className="text-white/75 text-sm mt-1">
              Educación Física
            </p>
          </div>

          <nav className="grid gap-3">
            <Link
              href="/docente"
              className="bg-white/20 px-4 py-3 rounded-xl font-bold"
            >
              Panel principal
            </Link>

            <Link
              href="/docente/nueva-planificacion"
              className="hover:bg-white/15 px-4 py-3 rounded-xl font-semibold transition"
            >
              Nueva planificación
            </Link>

            <Link
              href="/docente/mis-planificaciones"
              className="hover:bg-white/15 px-4 py-3 rounded-xl font-semibold transition"
            >
              Mis planificaciones
            </Link>

            <Link
              href="/docente/biblioteca"
              className="hover:bg-white/15 px-4 py-3 rounded-xl font-semibold transition"
            >
              Biblioteca curricular
            </Link>

            <Link
              href="/"
              className="hover:bg-white/15 px-4 py-3 rounded-xl font-semibold transition"
            >
              Ir al inicio
            </Link>
          </nav>
        </div>

        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-bold transition"
        >
          Cerrar sesión
        </button>
      </aside>

      <section className="flex-1 p-8 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
            <p className="text-sm font-bold text-[#1E6091] mb-2">
              Área docente
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#003B7A] mb-3">
              Bienvenido al panel docente
            </h1>

            <p className="text-gray-600 text-lg max-w-3xl">
              Desde aquí puedes crear, consultar y gestionar tus planificaciones
              de unidad y secuencias diarias de Educación Física.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <p className="text-gray-500 text-sm font-semibold">
                Módulo principal
              </p>
              <h2 className="text-2xl font-extrabold text-[#1E6091] mt-2">
                Planificaciones
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Crea y administra tus clases.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <p className="text-gray-500 text-sm font-semibold">
                Biblioteca
              </p>
              <h2 className="text-2xl font-extrabold text-[#1E6091] mt-2">
                Curricular
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Consulta unidades y contenidos.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <p className="text-gray-500 text-sm font-semibold">
                Rol activo
              </p>
              <h2 className="text-2xl font-extrabold text-[#1E6091] mt-2">
                Docente
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Acceso autorizado al sistema.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Link
              href="/docente/nueva-planificacion"
              className="group bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-[#1E6091]/10 rounded-2xl flex items-center justify-center mb-5">
                <span className="text-3xl">📝</span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#003B7A] mb-3">
                Nueva planificación
              </h2>

              <p className="text-gray-600 leading-relaxed">
                Selecciona grado, período y unidad para crear una planificación
                de clase o de unidad.
              </p>

              <span className="inline-block mt-6 bg-[#1E6091] text-white px-5 py-3 rounded-xl font-bold">
                Crear planificación
              </span>
            </Link>

            <Link
              href="/docente/mis-planificaciones"
              className="group bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-5">
                <span className="text-3xl">📄</span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#003B7A] mb-3">
                Mis planificaciones
              </h2>

              <p className="text-gray-600 leading-relaxed">
                Consulta, edita y organiza todas las planificaciones que has
                guardado en el sistema.
              </p>

              <span className="inline-block mt-6 bg-[#1E6091] text-white px-5 py-3 rounded-xl font-bold">
                Ver planificaciones
              </span>
            </Link>

            <Link
              href="/docente/biblioteca"
              className="group bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
                <span className="text-3xl">📚</span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#003B7A] mb-3">
                Biblioteca curricular
              </h2>

              <p className="text-gray-600 leading-relaxed">
                Revisa unidades, contenidos, competencias, indicadores y
                secuencias disponibles.
              </p>

              <span className="inline-block mt-6 bg-[#1E6091] text-white px-5 py-3 rounded-xl font-bold">
                Abrir biblioteca
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}