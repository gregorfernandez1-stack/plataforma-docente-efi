"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ActualizarPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
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

  const actualizar = async (e: any) => {
    e.preventDefault();
    setMensaje("");

    if (!password || !confirmarPassword) {
      mostrarMensaje("Completa ambos campos de contraseña.", "error");
      return;
    }

    if (password.length < 6) {
      mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    if (password !== confirmarPassword) {
      mostrarMensaje("Las contraseñas no coinciden.", "error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        mostrarMensaje(
          "No se pudo actualizar la contraseña. Intenta abrir nuevamente el enlace recibido.",
          "error"
        );
        return;
      }

      mostrarMensaje(
        "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
        "success"
      );

      setPassword("");
      setConfirmarPassword("");

      setTimeout(() => {
        router.push("/login-docente");
      }, 2000);
    } catch (error) {
      mostrarMensaje("Ocurrió un error inesperado.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
      <form
        onSubmit={actualizar}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-sm border"
      >
        <h1 className="text-2xl font-bold text-[#003B7A] mb-4 text-center">
          Nueva contraseña
        </h1>

        <p className="text-sm text-gray-600 mb-5 text-center">
          Escribe y confirma tu nueva contraseña para recuperar el acceso.
        </p>

        {mensaje && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm font-semibold ${
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

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003B7A] mb-4"
          required
        />

        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003B7A] mb-4"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold transition"
        >
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </main>
  );
}