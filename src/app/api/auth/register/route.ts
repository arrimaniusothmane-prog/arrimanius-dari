import { NextResponse } from "next/server";
import {
  ApiError,
  RegisterInput,
  registerUser,
  withSession,
} from "../../../../server/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterInput;
    const user = registerUser(body);
    return withSession(NextResponse.json(user, { status: 201 }), user.id);
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}