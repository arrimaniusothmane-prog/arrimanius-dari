import { NextResponse } from "next/server";
import {
  ApiError,
  requireAdmin,
  createUserByAdmin,
  AdminCreateInput,
} from "../../../server/auth";
import { readUsers, toPublicUser } from "../../../server/db";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }

  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const users = role
    ? readUsers().filter((u) => u.role === role)
    : readUsers();
  return NextResponse.json(users.map(toPublicUser));
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as AdminCreateInput;
    const user = createUserByAdmin(body);
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}