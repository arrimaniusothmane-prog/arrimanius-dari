import { NextResponse } from "next/server";
import {
  ApiError,
  getSessionUser,
  updateUserRecord,
} from "../../../../server/auth";
import { toPublicUser } from "../../../../server/db";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser)
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  return NextResponse.json(toPublicUser(sessionUser));
}

export async function PATCH(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser)
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });

  const patch: Parameters<typeof updateUserRecord>[1] = {};
  if (typeof body.name === "string") patch.name = body.name;
  if (typeof body.email === "string") patch.email = body.email;
  if (typeof body.phone === "string") patch.phone = body.phone;
  if (typeof body.avatar === "string") patch.avatar = body.avatar;
  if (typeof body.companyName === "string") patch.companyName = body.companyName;
  if (typeof body.bio === "string") patch.bio = body.bio;
  if (typeof body.location === "string") patch.location = body.location;
  if (typeof body.licenseNumber === "string") patch.licenseNumber = body.licenseNumber;

  try {
    const updated = updateUserRecord(sessionUser.id, patch);
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}