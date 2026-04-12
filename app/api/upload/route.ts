import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir } from "fs/promises";
import path from "path";

// GET /api/upload?slotId=xxx — returns saved photo URL if it exists
export async function GET(req: NextRequest) {
  const slotId = req.nextUrl.searchParams.get("slotId");
  if (!slotId) return NextResponse.json({ url: null });

  const safeSlotId = slotId.replace(/[^a-z0-9-_]/gi, "_").slice(0, 60);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  try {
    const files = await readdir(uploadsDir);
    const match = files.find((f) => f.startsWith(safeSlotId + "."));
    if (match) return NextResponse.json({ url: `/uploads/${match}` });
  } catch {
    // directory doesn't exist yet
  }

  return NextResponse.json({ url: null });
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const slotId = formData.get("slotId") as string | null;

    if (!file || !slotId) {
      return NextResponse.json({ error: "Missing file or slotId" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de archivo no permitido." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Imagen demasiado grande (max 8 MB)." }, { status: 400 });
    }

    // Sanitize slot id for filename
    const safeSlotId = slotId.replace(/[^a-z0-9-_]/gi, "_").slice(0, 60);
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `${safeSlotId}.${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: "Error al guardar la imagen." }, { status: 500 });
  }
}
