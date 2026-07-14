import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EAF4FB] via-[#F5F9FC] to-[#DDEEF7] text-[#003B7A] overflow-hidden relative">
      <div className="absolute bottom-[-120px] right-[-120px] w-[360px] h-[360px] bg-[#8FD14F]/25 rounded-full blur-3xl" />
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#1E6091]/15 rounded-full blur-3xl" />

      <section className="relative max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* LOGOS */}
        <header className="flex justify-start mb-10 md:mb-14">
   <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 w-fit">
  <img
    src="/logos/logotuplanefi.png"
    alt="Sistema de Planificación en Educación Física por Competencia"
    className="max-w-[650px] w-full h-auto object-contain"
  />
</div>
        </header>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* TEXTO */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] mb-6 max-w-4xl">
              Sistema de Planificación en Educación Física por Competencia
            </h1>

            <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              Organiza unidades didácticas, competencias, indicadores,
              temas y secuencias desde un solo espacio digital.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/login-docente"
                className="bg-[#1E6091] hover:bg-[#144d74] text-white px-7 py-4 rounded-2xl font-black shadow-sm transition"
              >
                Ingresar como Docente
              </Link>

              <Link
                href="/login-admin"
                className="bg-white hover:bg-[#F0F6FA] border border-[#BFDCEB] text-[#003B7A] px-7 py-4 rounded-2xl font-bold transition"
              >
                Acceso Administrador
              </Link>
            </div>
          </div>

          {/* TARJETAS */}
          <div className="grid gap-5">

            <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm">
              <h2 className="text-3xl font-black text-[#1E6091] mb-3">
                Docente
              </h2>

              <p className="text-gray-700 leading-relaxed">
                Crea, organiza y consulta tus planificaciones por competencias.
              </p>
            </div>

            <div className="bg-white/90 border border-[#BFDCEB] rounded-3xl p-7 shadow-sm">
              <h2 className="text-3xl font-black text-[#003B7A] mb-3">
                Administrador
              </h2>

              <p className="text-gray-700 leading-relaxed">
                Gestiona biblioteca curricular, documentos y recursos docentes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bg-white/90 border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-[#1E6091]">01</p>
                <p className="text-sm text-gray-700 mt-1">
                  Unidades
                </p>
              </div>

              <div className="bg-white/90 border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-[#1E6091]">02</p>
                <p className="text-sm text-gray-700 mt-1">
                  Temas
                </p>
              </div>

              <div className="bg-white/90 border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-[#1E6091]">03</p>
                <p className="text-sm text-gray-700 mt-1">
                  Secuencias
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>
    </main>
  );
}