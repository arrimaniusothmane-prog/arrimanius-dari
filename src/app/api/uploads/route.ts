import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 5;

export async function POST(request: Request) {
  try {
    const form = await request.formData().catch(() => null);
    if (!form)
      return NextResponse.json(
        { error: "Corps de requête invalide." },
        { status: 400 }
      );

    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length === 0)
      return NextResponse.json(
        { error: "Aucune photo reçue." },
        { status: 400 }
      );
    if (files.length > MAX_FILES_PER_REQUEST)
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES_PER_REQUEST} photos par envoi.` },
        { status: 400 }
      );

    await mkdir(UPLOAD_DIR, { recursive: true });

    const urls: string[] = [];
    for (const file of files) {
      const type = file.type.toLowerCase();
      if (!ALLOWED_TYPES.has(type))
        return NextResponse.json(
          { error: `Format non pris en charge (${file.name}). Utilisez JPG, PNG, WebP ou GIF.` },
          { status: 400 }
        );
      if (file.size > MAX_FILE_SIZE)
        return NextResponse.json(
          { error: `Photo trop lourde : ${file.name} (max 5 Mo).` },
          { status: 400 }
        );

      const ext = EXT_BY_TYPE[type];
      const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
      const bytes = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOAD_DIR, name), bytes);
      urls.push(`/api/uploads/${name}`);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi." },
      { status: 500 }
    );
  }
}