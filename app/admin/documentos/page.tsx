"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDocumentos() {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("Diseño curricular");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [documentos, setDocumentos] = useState<any[]>([]);

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    const { data, error } = await supabase
      .from("documentos_curriculares")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando documentos:", error.message);
      setDocumentos([]);
      return;
    }

    setDocumentos(data || []);
  };

  const subirDocumento = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !tipo || !archivo) {
      setMensaje("Completa el título, tipo y selecciona un archivo.");
      return;
    }

    setSubiendo(true);
    setMensaje("");

    const nombreArchivo = `${Date.now()}-${archivo.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documentos-curriculares")
      .upload(nombreArchivo, archivo);

    if (uploadError) {
      setMensaje(`Error al subir el archivo: ${uploadError.message}`);
      setSubiendo(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("documentos-curriculares")
      .getPublicUrl(nombreArchivo);

    const { error: insertError } = await supabase
      .from("documentos_curriculares")
      .insert([
        {
          titulo,
          tipo,
          descripcion,
          url: publicUrlData.publicUrl,
        },
      ]);

    if (insertError) {
      setMensaje(`El archivo subió, pero no se guardó: ${insertError.message}`);
      setSubiendo(false);
      return;
    }

    setTitulo("");
    setTipo("Diseño curricular");
    setDescripcion("");
    setArchivo(null);
    setMensaje("Documento subido correctamente.");
    setSubiendo(false);
    cargarDocumentos();
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">
        <Link
          href="/admin"
          className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          ← Volver al panel admin
        </Link>

        <h1 className="text-3xl font-bold text-[#003B7A] mb-2">
          Documentos curriculares
        </h1>

        <p className="text-gray-600 mb-8">
          Sube documentos para que los docentes puedan consultarlos desde la
          biblioteca curricular.
        </p>

        <form onSubmit={subirDocumento} className="space-y-5 mb-10">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Título del documento"
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option>Diseño curricular</option>
            <option>Ordenanza</option>
            <option>Guía didáctica</option>
            <option>Calendario escolar</option>
            <option>Normativa MINERD / INEFI</option>
            <option>Otros documentos</option>
          </select>

          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded-lg p-3"
            rows={3}
            placeholder="Descripción"
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="w-full border rounded-lg p-3"
          />

          {mensaje && <p className="font-semibold text-[#003B7A]">{mensaje}</p>}

          <button
            type="submit"
            disabled={subiendo}
            className="bg-[#003B7A] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 disabled:opacity-60"
          >
            {subiendo ? "Subiendo..." : "Subir documento"}
          </button>
        </form>

        <h2 className="text-2xl font-bold text-[#003B7A] mb-4">
          Documentos subidos
        </h2>

        {documentos.length === 0 ? (
          <p className="text-gray-500">No hay documentos registrados.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {documentos.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border rounded-lg hover:bg-gray-100 bg-white"
              >
                <h3 className="font-bold text-[#003B7A]">📄 {doc.titulo}</h3>
                <p className="text-sm text-gray-600">{doc.tipo}</p>
                {doc.descripcion && (
                  <p className="text-sm text-gray-500 mt-2">
                    {doc.descripcion}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}