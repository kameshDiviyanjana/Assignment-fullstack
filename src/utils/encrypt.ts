import crypto from "crypto";
import 'dotenv/config';

const algorithm = "aes-256-cbc";

// Read and normalize SECRET_KEY from env (remove surrounding quotes and trim)
let rawSecret = process.env.SECRET_KEY;
let secret = rawSecret ? rawSecret.replace(/^\s*["']?/, "").replace(/["']?\s*$/, "").trim() : undefined;

if (!secret) {
  if (process.env.NODE_ENV !== "production") {
    // Provide a non-secure fallback for local development to avoid startup crashes.
    // WARNING: do NOT use this in production.
    secret = "dev_fallback_secret_please_change_";
    console.warn("WARN: SECRET_KEY is not set — using development fallback secret");
  } else {
    throw new Error("Missing required environment variable SECRET_KEY — set it in .env");
  }
}

// MUST be 32 bytes when derived; scryptSync will derive a 32-byte key
const key = crypto.scryptSync(secret, "salt", 32);

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(text: string): string {
  const parts = text.split(":");
  const ivHex = parts[0];
  const encrypted = parts[1];

  if (parts.length !== 2 || ivHex === undefined || encrypted === undefined) {
    throw new Error("Invalid encrypted text format");
  }

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}