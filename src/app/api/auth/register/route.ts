import { NextResponse } from "next/server";

export async function POST(request: Request) {
  void request;
  return NextResponse.json(
    { error: "Les inscriptions sont actuellement fermées. Contactez l'administrateur." },
    { status: 403 }
  );
}