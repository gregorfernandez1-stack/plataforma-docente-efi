"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditarSecuencias() {
  const { id } = useParams();
  const router = useRouter();

  const [secuencias, setSecuencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const { data, error } = await supabase
      .from("planificaciones")
      .select("secuencias")
      .eq("id", id)
      .single();

    if (error) {
      alert("Error cargando secuencias");
      return;
    }

    setSecuencias(data?.secuencias || []);
    setLoading(false);
  };

  const agregarSecuencia = () => {
    setSecuencias([
      ...secuencias,
      {
        nombre: "Nueva secuencia",
        actividades: [],
      },
    ]);
  };

  const eliminarSecuencia = (index: number) => {
    const nuevas = [...secuencias];
    nuevas.splice(index, 1);
    setSecuencias(nuevas);
  };

  const cambiarNombre = (index: number, valor: string) => {
    const nuevas = [...secuencias];
    nuevas[index].nombre = valor;
    setSecuencias(nuevas);
  };

  const agregarActividad = (index: number) => {
    const nuevas = [...secuencias];
    nuevas[index].actividades.push("Nueva actividad");
    setSecuencias(nuevas);
  };

  const cambiarActividad = (i: number, j: number, valor: string) => {
    const nuevas = [...secuencias];
    nuevas[i].actividades[j] = valor;
    setSecuencias(nuevas);
  };

  const eliminarActividad = (i: number, j: number) => {
    const nuevas = [...secuencias];
    nuevas[i].actividades.splice(j, 1);
    setSecuencias(nuevas);
  };

  const guardar = async () => {
    const { error } = await supabase
      .from("planificaciones")
      .update({ secuencias })
      .eq("id", id);

    if (error) {
      alert("Error guardando");
    } else {
      alert("Secuencias actualizadas");
      router.push("/docente/mis-planificaciones");
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-6">
      <h1 className="text-3xl font-bold text-[#003B7A] mb-6">
        Editar Secuencias
      </h1>

      <button
        onClick={agregarSecuencia}
        className="mb-6 bg-green-600 text-white px-5 py-2 rounded-lg font-bold"
      >
        + Agregar secuencia
      </button>

      {secuencias.map((sec, i) => (
        <div key={i} className="bg-white p-5 rounded-xl mb-6 shadow">
          <input
            value={sec.nombre}
            onChange={(e) => cambiarNombre(i, e.target.value)}
            className="w-full border p-2 rounded mb-3 font-bold"
          />

          <button
            onClick={() => eliminarSecuencia(i)}
            className="mb-4 bg-red-500 text-white px-3 py-1 rounded"
          >
            Eliminar secuencia
          </button>

          <div>
            <h3 className="font-semibold mb-2">Actividades</h3>

            {sec.actividades.map((act: string, j: number) => (
              <div key={j} className="flex gap-2 mb-2">
                <input
                  value={act}
                  onChange={(e) =>
                    cambiarActividad(i, j, e.target.value)
                  }
                  className="flex-1 border p-2 rounded"
                />

                <button
                  onClick={() => eliminarActividad(i, j)}
                  className="bg-red-600 text-white px-3 rounded"
                >
                  X
                </button>
              </div>
            ))}

            <button
              onClick={() => agregarActividad(i)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              + Actividad
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={guardar}
        className="bg-[#003B7A] text-white px-6 py-3 rounded-lg font-bold"
      >
        Guardar cambios
      </button>
    </main>
  );
}