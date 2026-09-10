import type { Demande, DemandeStatus } from "@/types";

export async function createDemande(input: {
  type: string;
  title: string;
  message?: string;
  name?: string;
  email?: string;
  phone?: string;
  data?: Record<string, string>;
}): Promise<Demande> {
  const res = await fetch("/api/demands", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Erreur lors de l'envoi de la demande.");
  return res.json();
}

export async function listDemandes(params?: {
  type?: string;
  status?: string;
}): Promise<Demande[]> {
  const url = new URL("/api/demands", window.location.origin);
  if (params?.type) url.searchParams.set("type", params.type);
  if (params?.status) url.searchParams.set("status", params.status);
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Erreur lors du chargement des demandes.");
  return res.json();
}

export async function updateDemandeStatus(
  id: string,
  status: DemandeStatus
): Promise<Demande> {
  const res = await fetch(`/api/demands/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour.");
  return res.json();
}

export async function deleteDemande(id: string): Promise<void> {
  const res = await fetch(`/api/demands/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression.");
}
