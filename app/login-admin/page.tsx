"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginAdmin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    const user = data.user;

    const { data: perfil, error: perfilError } = await supabase
      .from("profiles")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (perfilError || !perfil) {
      alert("Este usuario no tiene perfil asignado");
      return;
    }

    if (perfil.rol !== "admin") {
      alert("Este usuario no tiene permisos de administrador");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6 py-16">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-[#003B7A] mb-3">
          Ingreso Administrador
        </h1>

        <p className="text-gray-600 mb-8">
          Accede para gestionar docentes, grados, unidades y contenidos curriculares.
        </p>

        <form onSubmit={iniciarSesion} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="admin@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#003B7A]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#003B7A]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#003B7A] hover:bg-[#002F63] text-white py-3 rounded-lg font-bold"
          >
            Entrar como Administrador
          </button>
        </form>

        <Link
          href="/"
          className="block text-center text-[#003B7A] font-semibold mt-6"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}