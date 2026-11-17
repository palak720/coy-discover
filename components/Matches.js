'use client';
import { useEffect, useState } from 'react';

export default function Matches() {
  const [matches, setMatches] = useState(null);
  useEffect(() => {
    fetch('/matches').then((r) => r.json()).then((d) => setMatches(d.matches));
  }, []);

  if (!matches) return <div className="center">Loading…</div>;
  return (
    <>
      <h1 className="title">Matches</h1>
      {matches.length === 0 ? (
        <div className="empty"><div style={{ fontSize: 48 }}>💔</div>No matches yet. Keep swiping!</div>
      ) : (
        <div className="list">
          {matches.map((p) => (
            <div className="row" key={p.id}>
              <img src={p.photo} alt={p.name} />
              <div><strong>{p.name}, {p.age}</strong><br /><small>{p.city}</small></div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
