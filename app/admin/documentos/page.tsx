"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminPage() {
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    cargarPendientes();
  }, []);

  const cargarPendientes = async () => {
    const { count, error } = await supabase
      .from("solicitudes_docentes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("estado", "pendiente");

    if (error) {
      console.error(
        "Error cargando solicitudes pendientes:",
        error
      );
      return;
    }

    setPendientes(count || 0);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">

      <AdminSidebar />

      <section className="ml-[170px] flex-1 p-10">

        <div className="bg-white rounded-2xl shadow p-8 mb-8 border border-gray-100">
          <h1 className="text-4xl font-extrabold text-[#003B7A]">
            Panel de Administrador
          </h1>

          <p className="text-gray-600 mt-3 max-w-3xl">
            Administra el Sistema de Planificación en Educación Física por
            Competencia. Desde aquí puedes aprobar docentes, organizar
            unidades, temas, secuencias y documentos curriculares.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-gray-500 text-sm font-semibold">
              Módulo activo
            </p>

            <h2 className="text-2xl font-extrabold text-[#003B7A] mt-2">
              Biblioteca curricular
            </h2>

            <p className="text-gray-600 text-sm mt-2">
              Administra unidades didácticas, temas, secuencias y documentos.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-gray-500 text-sm font-semibold">
              Solicitudes pendientes
            </p>

            <h2 className="text-3xl font-extrabold text-red-600 mt-2">
              {pendientes}
            </h2>

            <p className="text-gray-600 text-sm mt-2">
              Docentes esperando aprobación.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-gray-500 text-sm font-semibold">
              Acceso
            </p>

            <h2 className="text-2xl font-extrabold text-[#003B7A] mt-2">
              Administrador
            </h2>

            <p className="text-gray-600 text-sm mt-2">
              Gestión general del sistema.
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <Link
            href="/admin/solicitudes"
            className="bg-white rounded-2xl shadow p-8 border hover:shadow-xl transition"
          >
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-2xl">🧑‍🏫</span>
            </div>

            <h3 className="text-2xl font-bold text-[#003B7A]">
              Solicitudes docentes
            </h3>

            <p className="text-gray-600 mt-2">
              Revisa las solicitudes de docentes registrados y aprueba el acceso.
            </p>

            <span className="inline-flex items-center gap-2 mt-5 bg-[#003B7A] text-white px-5 py-3 rounded-xl font-bold">
              Ver solicitudes
            </span>
          </Link>


          <Link
            href="/admin/unidades"
            className="bg-white rounded-2xl shadow p-8 border hover:shadow-xl transition"
          >
            <div className="w-14 h-14 bg-[#003B7A]/10 rounded-xl flex items-center justify-center mb-5">
              <span className="text-2xl">📚</span>
            </div>

            <h3 className="text-2xl font-bold text-[#003B7A]">
              Unidades didácticas
            </h3>

            <p className="text-gray-600 mt-2">
              Crear, editar y organizar unidades, temas y secuencias.
            </p>

            <span className="inline-block mt-5 bg-[#003B7A] text-white px-5 py-3 rounded-xl font-bold">
              Gestionar unidades
            </span>
          </Link>


          <Link
            href="/admin/documentos"
            className="bg-white rounded-2xl shadow p-8 border hover:shadow-xl transition"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-2xl">📄</span>
            </div>

            <h3 className="text-2xl font-bold text-[#003B7A]">
              Documentos curriculares
            </h3>

            <p className="text-gray-600 mt-2">
              Subir diseño curricular, ordenanzas, guías didácticas,
              calendario y normativas.
            </p>

            <span className="inline-block mt-5 bg-[#003B7A] text-white px-5 py-3 rounded-xl font-bold">
              Gestionar documentos
            </span>
          </Link>

        </div>

      </section>

    </div>
  );
}