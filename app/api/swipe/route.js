import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { body = {}; }
  const { profileId, direction } = body;
  if (!['like', 'pass'].includes(direction)) {
    return NextResponse.json({ error: "direction must be 'like' or 'pass'" }, { status: 400 });
  }
  const db = readDb();
  const profile = db.profiles.find((p) => p.id === Number(profileId));
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  // Already swiped: idempotent, can never change or re-trigger a match.
  if (profile.id in db.swipes) {
    return NextResponse.json({ match: db.matches.includes(profile.id), alreadySwiped: true });
  }

  db.swipes[profile.id] = direction;
  // Match only if BOTH liked each other.
  const match = direction === 'like' && db.admirers.includes(profile.id);
  if (match) db.matches.push(profile.id);
  writeDb(db);

  // Only reveal profile data on a mutual match.
  return NextResponse.json({ match, profile: match ? profile : undefined });
}
