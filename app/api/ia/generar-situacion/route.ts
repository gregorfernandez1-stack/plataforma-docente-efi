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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Falta configurar GEMINI_API_KEY en Vercel." },
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

Debe ser un solo párrafo claro, pedagógico, contextualizado y coherente.
`;

   const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Respuesta Gemini:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.error?.message ||
            "Gemini no pudo generar la situación.",
        },
        { status: 500 }
      );
    }

    const texto =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!texto) {
      return NextResponse.json(
        {
          error: "La IA no devolvió contenido.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ texto });

  } catch (error: any) {
    console.error("ERROR GEMINI:", error);

    return NextResponse.json(
      { error: "Error interno generando la situación." },
      { status: 500 }
    );
  }
}