import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  if (!/^[\w.-]+$/.test(name))
    return new Response("Non trouvé", { status: 404 });

  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const type = CONTENT_TYPE_BY_EXT[ext];
  if (!type) return new Response("Non trouvé", { status: 404 });

  try {
    const bytes = await readFile(path.join(UPLOAD_DIR, name));
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Non trouvé", { status: 404 });
  }
}