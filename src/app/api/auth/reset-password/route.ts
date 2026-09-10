import { NextResponse } from "next/server";
import { ApiError } from "../../../../server/auth";
import { findUserByEmail } from "../../../../server/db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email : "";
    const user = findUserByEmail(email);
    if (!user)
      throw new ApiError(
        "Adresse email introuvable. Vérifiez vos informations.",
        404
      );
    return NextResponse.json({
      ok: true,
      email: user.email,
      name: user.name,
      password: user.password,
    });
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}