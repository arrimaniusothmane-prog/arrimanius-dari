import { NextResponse } from "next/server";
import {
  ApiError,
  requireAdmin,
  updateUserRecord,
  deleteUserRecord,
} from "../../../../server/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object")
      return NextResponse.json(
        { error: "Corps de requête invalide." },
        { status: 400 }
      );

    const patch: Parameters<typeof updateUserRecord>[1] = {};
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.email === "string") patch.email = body.email;
    if (typeof body.phone === "string") patch.phone = body.phone;
    if (typeof body.avatar === "string") patch.avatar = body.avatar;
    if (typeof body.role === "string") {
      const roles = ["BUYER", "SELLER", "AGENT", "ADMIN"];
      if (roles.includes(body.role)) patch.role = body.role;
    }
    if (typeof body.isVerified === "boolean") patch.isVerified = body.isVerified;
    if (body.status === "ACTIF" || body.status === "SUSPENDU")
      patch.status = body.status;
    if (typeof body.companyName === "string") patch.companyName = body.companyName;
    if (typeof body.location === "string") patch.location = body.location;
    if (typeof body.bio === "string") patch.bio = body.bio;
    if (typeof body.licenseNumber === "string")
      patch.licenseNumber = body.licenseNumber;

    const updated = updateUserRecord(id, patch);
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    deleteUserRecord(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}