"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const linkClass = (href: string) =>
    `block px-3 py-3 rounded-md text-sm font-semibold transition ${
      pathname === href
        ? "bg-white/30"
        : "bg-white/15 hover:bg-white/25"
    }`;

  return (
    <aside className="w-[170px] bg-[#003B7A] text-white min-h-screen p-4 fixed left-0 top-0">
      <h2 className="text-lg font-bold mb-8">Administrador</h2>

      <nav className="space-y-3">
        <Link href="/admin" className={linkClass("/admin")}>
          Panel principal
        </Link>

        <Link href="/admin/solicitudes" className={linkClass("/admin/solicitudes")}>
          Solicitudes docentes
        </Link>

        <Link href="/admin/unidades" className={linkClass("/admin/unidades")}>
          Unidades didácticas
        </Link>

        <Link href="/admin/documentos" className={linkClass("/admin/documentos")}>
          Documentos curriculares
        </Link>

        <Link href="/" className={linkClass("/")}>
          Ir al inicio
        </Link>

        <button
          onClick={cerrarSesion}
          className="w-full bg-red-600 hover:bg-red-700 px-3 py-3 rounded-md text-sm font-bold mt-6 transition"
        >
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}