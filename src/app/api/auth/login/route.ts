import { NextResponse } from "next/server";
import { authenticate, withSession, ApiError } from "../../../../server/auth";
import { toPublicUser } from "../../../../server/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  try {
    const user = await authenticate(email, password);
    return withSession(NextResponse.json(toPublicUser(user)), user.id);
  } catch (error) {
    if (error instanceof ApiError)
      return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}