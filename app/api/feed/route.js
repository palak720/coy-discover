import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Returns only profiles not yet swiped on. Never exposes who liked the user.
export async function GET() {
  const db = readDb();
  const feed = db.profiles.filter((p) => !(p.id in db.swipes));
  return NextResponse.json({ profiles: feed });
}