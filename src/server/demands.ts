import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { Demande, DemandeType, DemandeStatus } from "../types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "demands.json");

function seed(): Demande[] {
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();
  const threeDaysAgo = new Date(Date.now() - 259200000).toISOString();

  return [
    {
      id: "demande-1",
      type: DemandeType.DEVIS,
      status: DemandeStatus.NOUVELLE,
      title: "Rénovation villa — Casablanca",
      message: "Nous souhaitons rénover notre villa à Anfa. 3 chambres, 2 salles de bain, cuisine entièrement à refaire. Budget estimé 800 000 MAD.",
      name: "Mohammed Alaoui",
      email: "m.alaoui@email.com",
      phone: "+212 6 12 34 56 78",
      data: { ville: "Casablanca", bien: "Villa", surface: "250", budget: "700 000 – 1 500 000 MAD", typeProjet: "RENOVATION" },
      createdAt: twoDaysAgo,
      updatedAt: twoDaysAgo,
    },
    {
      id: "demande-2",
      type: DemandeType.CONTACT,
      status: DemandeStatus.NOUVELLE,
      title: "Question sur investissement locatif",
      message: "Bonjour, je souhaite des renseignements sur les opportunités d'investissement locatif à Rabat. Quels quartiers recommandez-vous pour un rendement optimal ?",
      name: "Sara Benkirane",
      email: "s.benkirane@email.com",
      phone: "+212 6 98 76 54 32",
      data: { sujet: "conseil" },
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: "demande-3",
      type: DemandeType.OFFRE,
      status: DemandeStatus.EN_COURS,
      title: "Offre villa Maarif",
      message: "Je souhaite proposer 1 850 000 MAD pour cette villa. Je suis preneur rapide.",
      name: "Youssef Fassi",
      email: "y.fassi@email.com",
      phone: "+212 6 55 44 33 22",
      data: { propertyId: "prop-1", prix: "1850000", contact: "phone" },
      createdAt: threeDaysAgo,
      updatedAt: twoDaysAgo,
    },
    {
      id: "demande-4",
      type: DemandeType.VISITE,
      status: DemandeStatus.TRAITEE,
      title: "Visite appartement Gauthier",
      message: "Disponible mardi ou jeudi après-midi.",
      name: "Amina Tazi",
      email: "a.tazi@email.com",
      phone: "+212 6 11 22 33 44",
      data: { propertyId: "prop-3", date: "2026-09-15", time: "14:00", visitors: "2" },
      createdAt: threeDaysAgo,
      updatedAt: twoDaysAgo,
    },
  ];
}

function ensureDb(): void {
  if (existsSync(DB_FILE)) return;
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(seed(), null, 2), "utf8");
}

export function readDemands(): Demande[] {
  ensureDb();
  const raw = readFileSync(DB_FILE, "utf8");
  try {
    return JSON.parse(raw) as Demande[];
  } catch {
    const demands = seed();
    writeFileSync(DB_FILE, JSON.stringify(demands, null, 2), "utf8");
    return demands;
  }
}

export function writeDemands(demands: Demande[]): void {
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(demands, null, 2), "utf8");
}

export function createDemande(input: Omit<Demande, "id" | "status" | "createdAt" | "updatedAt">): Demande {
  const now = new Date().toISOString();
  const demande: Demande = {
    ...input,
    id: `demande-${Date.now()}`,
    status: DemandeStatus.NOUVELLE,
    createdAt: now,
    updatedAt: now,
  };
  writeDemands([...readDemands(), demande]);
  return demande;
}

export function updateDemandeStatus(id: string, status: DemandeStatus): Demande | null {
  const demands = readDemands();
  const index = demands.findIndex((d) => d.id === id);
  if (index === -1) return null;
  const updated: Demande = {
    ...demands[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  demands[index] = updated;
  writeDemands(demands);
  return updated;
}

export function deleteDemande(id: string): boolean {
  const demands = readDemands();
  const next = demands.filter((d) => d.id !== id);
  if (next.length === demands.length) return false;
  writeDemands(next);
  return true;
}
