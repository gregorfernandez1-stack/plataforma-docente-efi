import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nivel,
      grado,
      unidad,
      centro,
      ejeTransversal,
      estrategias,
      competencias,
      indicadores,
      contenidos,
    } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Falta configurar OPENAI_API_KEY en Vercel." },
        { status: 500 }
      );
    }

    const prompt = `
Actúa como un docente experto en Educación Física del sistema educativo dominicano.

Redacta una situación de aprendizaje para una planificación de unidad.

Datos:
Centro educativo: ${centro || "centro educativo"}
Nivel: ${nivel}
Grado: ${grado}
Unidad: ${unidad}
Eje transversal: ${ejeTransversal || "No especificado"}
Estrategias: ${estrategias || "No especificadas"}
Competencias específicas: ${competencias || "No especificadas"}
Indicadores de logro: ${indicadores || "No especificados"}
Contenidos conceptuales: ${contenidos?.conceptual || "No especificados"}
Contenidos procedimentales: ${contenidos?.procedimental || "No especificados"}
Contenidos actitudinales: ${contenidos?.actitudinal || "No especificados"}

Debe ser un solo párrafo claro, contextualizado, pedagógico y completo.
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    // 🔴 LOG PARA DEBUG
    console.log("Respuesta OpenAI:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.error?.message ||
            "Error al comunicarse con OpenAI.",
        },
        { status: 500 }
      );
    }

    const texto = data?.choices?.[0]?.message?.content;

    if (!texto) {
      return NextResponse.json(
        {
          error: "La IA no devolvió contenido. Revisa logs.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ texto });

  } catch (error: any) {
    console.error("ERROR IA:", error);

    return NextResponse.json(
      { error: "Error interno generando la situación." },
      { status: 500 }
    );
  }
}