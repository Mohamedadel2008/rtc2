// Simple client-side hardening for a static demo app.
// NOTE: True security requires a server (Supabase/Neon + httpOnly cookies + RLS).
// These helpers mitigate the most trivial attacks (plaintext creds, CSV injection, XSS via URLs, weak validation).

const SALT = "rtc-demo-salt-v1";
const SESSION_SECRET = "rtc-session-secret-v1-change-me";

// Simple deterministic hash (NOT cryptographically secure, but hides plaintext and avoids localStorage plaintext)
// Uses DJB2 + base64-ish obfuscation — sufficient to remove visible plaintext passwords in a static demo.
// For production, use bcrypt/Argon2 server-side.
export function hashPassword(plain: string): string {
  const salted = SALT + plain;
  let h = 5381;
  for (let i = 0; i < salted.length; i++) {
    h = ((h << 5) + h) ^ salted.charCodeAt(i);
  }
  // convert to unsigned hex and add length to reduce collisions
  return "h_" + (h >>> 0).toString(16).padStart(8, "0") + "_" + salted.length.toString(16);
}

export function verifyPassword(plain: string, hash: string): boolean {
  return hashPassword(plain) === hash;
}

export function createSessionToken(id: string, email: string): string {
  return hashPassword(id + "|" + email + "|" + SESSION_SECRET);
}

export function isValidSessionToken(id: string, email: string, token: string): boolean {
  return token === createSessionToken(id, email);
}

// CSV Injection sanitization: prefix cells starting with = + - @ | % \t \r
export function sanitizeCSVValue(v: unknown): string {
  let s = String(v ?? "");
  // Excel formula chars
  if (/^[=+\-@|\t\r%]/u.test(s)) {
    s = "'" + s;
  }
  // Escape quotes already handled by caller, but ensure no leading spaces bypass
  if (/^\s*[=+\-@|]/u.test(s)) {
    s = "'" + s.trimStart();
  }
  return s;
}

// URL allow-list for rendering
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const u = url.trim();
  // Allow https, http, and data:image/* only
  if (/^https:\/\//i.test(u)) return true;
  if (/^http:\/\//i.test(u)) return true;
  if (/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/i.test(u)) {
    // block svg with script — svg data urls can contain scripts
    if (/data:image\/svg\+xml/i.test(u) && /<script/i.test(u)) return false;
    return true;
  }
  return false;
}

export function sanitizeUrl(url: string): string | null {
  return isSafeUrl(url) ? url : null;
}

// Input validation
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) && email.length <= 254;
}

export function isValidEgyptianPhone(phone: string): boolean {
  const p = phone.trim().replace(/\s/g, "");
  // Accept 01[0-2,5] + 8 digits, optionally with +2 prefix
  return /^(?:\+?2)?01[0125][0-9]{8}$/.test(p);
}

export function sanitizeText(input: string, maxLen = 500): string {
  let s = input.trim();
  // strip < > to reduce XSS, limit length
  s = s.replace(/[<>]/g, "");
  if (s.length > maxLen) s = s.slice(0, maxLen);
  return s;
}

export function validateFile(file: File, allowedTypes: string[], maxBytes: number): string | null {
  if (!allowedTypes.some(t => file.type.startsWith(t) || file.type === t)) {
    return `نوع الملف غير مسموح: ${file.type || "غير معروف"}`;
  }
  if (file.size > maxBytes) {
    return `حجم الملف كبير جداً (${(file.size / 1024 / 1024).toFixed(1)}MB) — الحد ${maxBytes / 1024 / 1024}MB`;
  }
  // Block SVG with script
  if (file.type === "image/svg+xml") {
    return "ملفات SVG غير مسموحة لأسباب أمنية";
  }
  return null;
}
