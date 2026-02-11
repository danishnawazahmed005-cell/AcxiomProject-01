import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): { userId: number; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    return decoded;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string): void {
  if (typeof window !== 'undefined') {
    document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}`;
  }
}

export function getAuthCookie(): string | null {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((c) => c.trim().startsWith('auth_token='));
  return authCookie ? authCookie.split('=')[1] : null;
}

export function removeAuthCookie(): void {
  if (typeof window !== 'undefined') {
    document.cookie = 'auth_token=; path=/; max-age=0';
  }
}
