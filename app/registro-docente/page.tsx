"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegistroDocentePage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [centro, setCentro] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"error" | "success" | "info">("info");

  const mostrarMensaje = (
    texto: string,
    tipo: "error" | "success" | "info" = "info"
  ) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const enviarSolicitud = async () => {
    setMensaje("");

    if (!nombre || !correo || !centro || !password || !confirmarPassword) {
      mostrarMensaje("Completa todos los campos antes de enviar la solicitud.", "error");
      return;
    }

    if (password.length < 6) {
      mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    if (password !== confirmarPassword) {
      mostrarMensaje("Las contraseñas no coinciden. Verifica e intenta nuevamente.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/registro-docente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          correo,
          centro,
          password,
        }),
      });

      const resultado = await res.json();

      if (!res.ok) {
        mostrarMensaje(
          resultado.error || "No se pudo enviar la solicitud.",
          "error"
        );
        return;
      }

      mostrarMensaje(
        "Solicitud enviada correctamente. Tu cuenta fue creada, pero debes esperar la autorización del administrador para iniciar sesión.",
        "success"
      );

      setNombre("");
      setCorreo("");
      setCentro("");
      setPassword("");
      setConfirmarPassword("");
    } catch (error) {
      mostrarMensaje("Ocurrió un error inesperado. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EAF4FB] via-[#F5F9FC] to-[#DDEEF7] flex items-center justify-center px-6 py-16">
      <section className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-[#EAF4FB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>

          <h1 className="text-3xl font-bold text-[#1E6091] mb-3">
            Solicitud de registro docente
          </h1>

          <p className="text-gray-600">
            Crea tu cuenta docente. El administrador revisará y autorizará tu
            acceso.
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
            {tipoMensaje === "success" ? "✅ " : tipoMensaje === "error" ? "⚠️ " : "ℹ️ "}
            {mensaje}
          </div>
        )}

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E6091]"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E6091]"
          />

          <input
            type="text"
            placeholder="Centro educativo"
            value={centro}
            onChange={(e) => setCentro(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E6091]"
          />

          <input
            type="password"
            placeholder="Crear contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E6091]"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E6091]"
          />

          <button
            onClick={enviarSolicitud}
            disabled={loading}
            className="w-full bg-[#1E6091] hover:bg-[#144d74] disabled:bg-gray-400 text-white py-3 rounded-xl font-bold transition"
          >
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>
        </div>

        <div className="mt-6 text-center space-y-3">
          <Link
            href="/login-docente"
            className="block text-[#1E6091] font-semibold hover:underline"
          >
            Ya tengo cuenta docente
          </Link>

          <Link href="/" className="block text-gray-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}