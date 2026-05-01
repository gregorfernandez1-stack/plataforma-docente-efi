import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { nombre, correo, centro, password } = await req.json();

    if (!nombre || !correo || !centro || !password) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email: correo,
        password,
        email_confirm: true,
      });

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: userError?.message || "No se pudo crear el usuario" },
        { status: 400 }
      );
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: userData.user.id,
        email: correo,
        rol: "docente",
        nombre,
        centro,
        autorizado: false,
      },
    ]);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    const { error: solicitudError } = await supabaseAdmin
      .from("solicitudes_docentes")
      .insert([
        {
          user_id: userData.user.id,
          nombre,
          correo,
          centro,
          estado: "pendiente",
        },
      ]);

    if (solicitudError) {
      return NextResponse.json(
        { error: solicitudError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Solicitud enviada correctamente",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}