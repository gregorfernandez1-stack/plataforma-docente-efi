import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function BibliotecaCurricular() {
  const niveles = ["Primario", "Secundario"];
  const grados = ["1", "2", "3", "4", "5", "6"];

  const { data: documentos } = await supabase
    .from("documentos_curriculares")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <section className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow">
        
        <Link
          href="/docente"
          className="inline-block mb-6 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          ← Volver
        </Link>

        <h1 className="text-3xl font-bold text-[#003B7A] mb-2">
          Biblioteca curricular
        </h1>

        <p className="text-gray-600 mb-8">
          Selecciona el nivel y grado para consultar las unidades,
          aspectos curriculares y secuencias.
        </p>

        {/* 🔵 NIVELES Y GRADOS */}
        {niveles.map((nivel) => (
          <div key={nivel} className="mb-10">
            <h2 className="text-2xl font-bold text-[#003B7A] mb-4">
              Nivel {nivel}
            </h2>

            <div className="grid md:grid-cols-3 gap-5">
              {grados.map((grado) => (
                <Link
                  key={`${nivel}-${grado}`}
                  href={`/docente/biblioteca/${grado}?nivel=${nivel}`}
                  className="border rounded-xl p-6 bg-blue-50 hover:bg-blue-100 transition shadow-sm"
                >
                  <h3 className="text-xl font-bold text-[#003B7A]">
                    {grado}° grado
                  </h3>

                  <p className="text-gray-600 mt-2">
                    Ver unidades curriculares
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* 📄 DOCUMENTOS CURRICULARES */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#003B7A] mb-4">
            Documentos curriculares
          </h2>

          {(!documentos || documentos.length === 0) && (
            <p className="text-gray-500">
              No hay documentos disponibles.
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {documentos?.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                className="p-4 border rounded-lg hover:bg-gray-100 bg-white flex justify-between items-center"
              >
                <span>
                  📄 {doc.titulo}
                </span>

                <span className="text-sm text-gray-500">
                  {doc.tipo}
                </span>
              </a>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}