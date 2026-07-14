import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "products");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function isAllowedImage(file: File): boolean {
  return ALLOWED_TYPES.has(file.type) && file.size <= MAX_SIZE_BYTES;
}

export async function saveProductImage(file: File): Promise<string> {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/products/${filename}`;
}

export async function deleteProductImage(url: string): Promise<void> {
  const filename = path.basename(url);
  await fs.rm(path.join(UPLOADS_DIR, filename), { force: true });
}
