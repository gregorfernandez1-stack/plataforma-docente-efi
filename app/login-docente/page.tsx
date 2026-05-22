"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginDocente() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"error" | "success" | "info">(
    "info"
  );

  const mostrarMensaje = (
    texto: string,
    tipo: "error" | "success" | "info" = "info"
  ) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const handleLogin = async () => {
    setMensaje("");

    if (!email || !password) {
      mostrarMensaje("Completa correo y contraseña para iniciar sesión.", "error");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        mostrarMensaje(
          "Correo o contraseña incorrectos. Verifica e intenta nuevamente.",
          "error"
        );
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, rol, nombre, centro, autorizado")
        .eq("email", data.user.email)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        mostrarMensaje(
          "Tu cuenta no tiene un perfil asignado. Contacta al administrador.",
          "error"
        );
        return;
      }

      if (profile.rol !== "docente") {
        await supabase.auth.signOut();
        mostrarMensaje("Esta cuenta no pertenece al rol docente.", "error");
        return;
      }

      if (!profile.autorizado) {
        await supabase.auth.signOut();
        mostrarMensaje(
          "Tu solicitud aún está pendiente de aprobación por el administrador.",
          "info"
        );
        return;
      }

      if (!profile.nombre || !profile.centro) {
        await supabase.auth.signOut();
        mostrarMensaje(
          "Tu perfil docente está incompleto. Contacta al administrador.",
          "error"
        );
        return;
      }

      mostrarMensaje(
  "Acceso correcto. Ingresando al Sistema de Planificación en Educación Física por Competencia...",
  "success"
);
      router.push("/docente");
    } catch (error) {
      mostrarMensaje("Ocurrió un error inesperado. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EAF4FB] via-[#F5F9FC] to-[#DDEEF7] flex items-center justify-center px-6 py-16">
      <section className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-[#EAF4FB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👨‍🏫</span>
          </div>

          <h1 className="text-3xl font-bold text-[#1E6091] mb-3">
  Ingreso Docente
</h1>

<p className="text-gray-600">
  Accede al Sistema de Planificación en Educación Física por Competencia.
</p>

<p className="text-sm text-gray-500 mt-2">
  Ingresa para gestionar planificaciones, unidades, temas y secuencias.
</p>
        </div>

        {mensaje && (
          <div
            className={`mb-5 rounded-xl px-4 py-3 text-sm font-semibold ${
              tipoMensaje === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : tipoMensaje === "error"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-blue-100 text-blue-700 border border-blue-200"
            }`}
          >
            {tipoMensaje === "success"
              ? "✅ "
              : tipoMensaje === "error"
              ? "⚠️ "
              : "ℹ️ "}
            {mensaje}
          </div>
        )}

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E6091]"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E6091]"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1E6091] hover:bg-[#144d74] disabled:bg-gray-400 text-white py-3 rounded-xl font-bold transition"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>

          <div className="text-right">
            <Link
              href="/recuperar-password"
              className="text-sm text-[#1E6091] font-semibold hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center space-y-3 border-t pt-5">
          <Link
            href="/registro-docente"
            className="block text-[#1E6091] font-semibold hover:underline"
          >
            Solicitar registro docente
          </Link>

          <Link href="/" className="block text-gray-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}