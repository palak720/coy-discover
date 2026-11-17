import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = readDb();
  const matches = db.matches.map((id) => db.profiles.find((p) => p.id === id)).filter(Boolean);
  return NextResponse.json({ matches });
}