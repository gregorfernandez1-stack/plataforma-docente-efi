import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { unidadesPorGrado } from "../data/unidades";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function importarUnidades() {
  const filas: any[] = [];

  for (const [grado, unidades] of Object.entries(unidadesPorGrado)) {
    for (const unidad of unidades as any[]) {
      filas.push({
        nivel: "Primario",
        grado,
        titulo: unidad.nombre,
        eje_transversal: unidad.ejeTransversal || "",
        estrategias: unidad.estrategias || "",
        grupos_competencias: unidad.gruposCompetencias || [],
        competencias_especificas: unidad.competenciasEspecificas || "",
        areas_articuladas: unidad.areasArticuladas || [],
        contenidos_conceptuales: unidad.contenidos?.conceptual || "",
        contenidos_procedimentales: unidad.contenidos?.procedimental || "",
        contenidos_actitudinales: unidad.contenidos?.actitudinal || "",
        indicadores_logro: unidad.indicadores || "",
        secuencias: unidad.secuencias || [],
      });
    }
  }

  console.log(`Unidades preparadas: ${filas.length}`);

  for (const fila of filas) {
    const { data: existe } = await supabase
      .from("unidades")
      .select("id")
      .eq("nivel", fila.nivel)
      .eq("grado", fila.grado)
      .eq("titulo", fila.titulo)
      .maybeSingle();

    if (existe) {
      console.log(`Ya existe: ${fila.grado} - ${fila.titulo}`);
      continue;
    }

    const { error } = await supabase.from("unidades").insert([fila]);

    if (error) {
      console.error(`Error importando ${fila.titulo}:`, error.message);
    } else {
      console.log(`Importada: ${fila.grado} - ${fila.titulo}`);
    }
  }

  console.log("Importación finalizada.");
}

importarUnidades();