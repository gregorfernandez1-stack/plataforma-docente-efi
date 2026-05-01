import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { grado, unidad, contenido } = await req.json();

    const prompt = `
Actúa como un docente experto en Educación Física del sistema educativo dominicano.

Crea una situación de aprendizaje para:

Grado: ${grado}
Unidad: ${unidad}
Contenido: ${contenido}

Debe incluir:
- Contexto
- Problema
- Actividad
- Producto esperado

Redacta en lenguaje claro, pedagógico y aplicable en aula.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    const texto = data.choices?.[0]?.message?.content;

    return NextResponse.json({ texto });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}