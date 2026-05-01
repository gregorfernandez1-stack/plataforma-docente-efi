import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Falta el ID de la solicitud" },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const supabaseEmail = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Buscar solicitud
    const { data: solicitud, error: solicitudFetchError } = await supabaseAdmin
      .from("solicitudes_docentes")
      .select("id, user_id, correo, estado")
      .eq("id", id)
      .single();

    if (solicitudFetchError || !solicitud) {
      return NextResponse.json(
        { error: solicitudFetchError?.message || "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    if (solicitud.estado === "aprobado") {
      return NextResponse.json(
        { error: "Esta solicitud ya fue aprobada" },
        { status: 400 }
      );
    }

    // Autorizar perfil docente
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ autorizado: true })
      .eq("id", solicitud.user_id);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // Marcar solicitud como aprobada
    const { error: updateSolicitudError } = await supabaseAdmin
      .from("solicitudes_docentes")
      .update({ estado: "aprobado" })
      .eq("id", id);

    if (updateSolicitudError) {
      return NextResponse.json(
        { error: updateSolicitudError.message },
        { status: 400 }
      );
    }

    // Enviar correo de acceso al docente aprobado
    const { error: emailError } = await supabaseEmail.auth.signInWithOtp({
      email: solicitud.correo,
      options: {
        emailRedirectTo: `${siteUrl}/docente`,
      },
    });

    if (emailError) {
      return NextResponse.json(
        {
          error:
            "El docente fue aprobado, pero no se pudo enviar el correo de notificación: " +
            emailError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Docente aprobado correctamente. Se envió un correo de acceso al docente.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}