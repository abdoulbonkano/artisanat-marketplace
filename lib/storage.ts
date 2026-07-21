import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "products");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function isAllowedImage(file: File): boolean {
  return ALLOWED_TYPES.has(file.type) && file.size <= MAX_SIZE_BYTES;
}

function extensionFor(file: File): string {
  return file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
}

// Vercel's serverless functions don't have a writable, persistent filesystem,
// so production relies on Vercel Blob. Local dev falls back to disk when no
// token is configured, to avoid requiring a Blob store just to run locally.
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function saveProductImage(file: File): Promise<string> {
  if (useBlob) {
    const filename = `products/${randomUUID()}.${extensionFor(file)}`;
    const blob = await put(filename, file, { access: "public" });
    return blob.url;
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${randomUUID()}.${extensionFor(file)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/products/${filename}`;
}

export async function deleteProductImage(url: string): Promise<void> {
  if (useBlob) {
    await del(url);
    return;
  }

  const filename = path.basename(url);
  await fs.rm(path.join(UPLOADS_DIR, filename), { force: true });
}

export async function saveShopImage(file: File, kind: "logo" | "banner"): Promise<string> {
  if (useBlob) {
    const filename = `shops/${kind}/${randomUUID()}.${extensionFor(file)}`;
    const blob = await put(filename, file, { access: "public" });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads", "shops", kind);
  await fs.mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}.${extensionFor(file)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/shops/${kind}/${filename}`;
}

export async function deleteShopImage(url: string): Promise<void> {
  if (useBlob) {
    await del(url);
    return;
  }

  await fs.rm(path.join(process.cwd(), "public", url), { force: true });
}
