"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecuperarPassword() {
  const [correo, setCorreo] = useState("");
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

  const recuperar = async (e: any) => {
    e.preventDefault();
    setMensaje("");

    if (!correo) {
      mostrarMensaje("Ingresa tu correo electrónico.", "error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(correo, {
        redirectTo: "http://localhost:3000/actualizar-password",
      });

      if (error) {
        mostrarMensaje(
          "No se pudo enviar el correo. Verifica el email e intenta nuevamente.",
          "error"
        );
        return;
      }

      mostrarMensaje(
        "Te enviamos un enlace para restablecer tu contraseña. Revisa tu correo (incluye spam).",
        "success"
      );
    } catch (err) {
      mostrarMensaje("Ocurrió un error inesperado.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
      <form
        onSubmit={recuperar}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-sm border"
      >
        <h1 className="text-2xl font-bold text-[#003B7A] mb-4 text-center">
          Recuperar contraseña
        </h1>

        <p className="text-sm text-gray-600 mb-5 text-center">
          Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
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
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003B7A] mb-4"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-[#003B7A] hover:bg-[#002c5a] disabled:bg-gray-400 text-white py-3 rounded-xl font-bold transition"
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
    </main>
  );
}