import { NextResponse } from "next/server";
import { ApiError, requireAdmin } from "../../../server/auth";
import { readDemands, createDemande } from "../../../server/demands";
import { DemandeType } from "../../../types";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");
  let demands = readDemands();

  if (type && Object.values(DemandeType).includes(type as DemandeType)) {
    demands = demands.filter((d) => d.type === type);
  }
  if (status) {
    demands = demands.filter((d) => d.status === status);
  }

  return NextResponse.json(demands);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type?: string;
      title?: string;
      message?: string;
      name?: string;
      email?: string;
      phone?: string;
      data?: Record<string, string>;
    };

    if (!body.type || !Object.values(DemandeType).includes(body.type as DemandeType)) {
      return NextResponse.json({ error: "Type de demande invalide." }, { status: 400 });
    }
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Titre requis." }, { status: 400 });
    }

    const demande = createDemande({
      type: body.type as DemandeType,
      title: body.title.trim(),
      message: (body.message ?? "").trim(),
      name: (body.name ?? "").trim(),
      email: (body.email ?? "").trim(),
      phone: (body.phone ?? "").trim(),
      data: body.data ?? {},
    });

    return NextResponse.json(demande, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
