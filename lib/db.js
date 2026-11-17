import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'db.json');
const NAMES = ['Aarav','Ananya','Vivaan','Diya','Aditya','Isha','Kabir','Meera','Rohan','Saanvi','Arjun','Riya','Karan','Priya','Dev','Neha','Yash','Tara','Ishaan','Kavya','Rahul','Simran','Vihaan','Anika','Nikhil','Pooja','Aryan','Sneha','Manav','Zoya'];
const PLACES = ['Kanpur','Lucknow','Delhi University','IIT Kanpur','Pune','Mumbai','Bangalore','Jaipur','Chandigarh','Hyderabad'];
const INTERESTS = ['Music','Travel','Coding','Cricket','Movies','Reading','Coffee','Gym','Photography','Anime','Cooking','Dancing','Gaming','Art','Hiking'];
const BIOS = ['Chai over coffee, always.','Looking for someone to share playlists with.','Weekend trekker, weekday overthinker.','Will beat you at Mario Kart.','Bookworm with a sarcastic streak.','Foodie who can actually cook.','Here for good conversations.','Night owl, early-morning gym person.'];

function seed() {
  const profiles = NAMES.map((name, i) => ({
    id: i + 1,
    name,
    age: 19 + (i % 9),
    photo: `https://i.pravatar.cc/500?img=${i + 1}`,
    bio: BIOS[i % BIOS.length],
    city: PLACES[i % PLACES.length],
    interests: [0, 1, 2].map((k) => INTERESTS[(i * 3 + k * 4) % INTERESTS.length]),
  }));
  // Private: इन्होंने पहले से user को like किया हुआ है (कभी API में नहीं जाएगा)
  const admirers = profiles.filter((p) => p.id % 3 === 0).map((p) => p.id);
  return { profiles, admirers, swipes: {}, matches: [] };
}

export function readDb() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    const db = seed();
    writeDb(db);
    return db;
  }
}

export function writeDb(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}