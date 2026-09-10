import { NextResponse } from "next/server";
import { ApiError, requireAdmin } from "../../../../server/auth";
import { updateDemandeStatus, deleteDemande } from "../../../../server/demands";
import { DemandeStatus } from "../../../../types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object")
      return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });

    const { status } = body as { status?: string };
    if (!status || !Object.values(DemandeStatus).includes(status as DemandeStatus)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const updated = updateDemandeStatus(id, status as DemandeStatus);
    if (!updated)
      return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const ok = deleteDemande(id);
    if (!ok)
      return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
