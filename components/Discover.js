'use client';
import { useEffect, useRef, useState } from 'react';

const THRESHOLD = 100;

function Card({ p }) {
  return (
    <>
      <img src={p.photo} alt={p.name} draggable={false} />
      <div className="info">
        <h2>{p.name}, {p.age}</h2>
        <p>📍 {p.city}</p>
        <p>{p.bio}</p>
        <div className="chips">{p.interests.map((i) => <span key={i}>{i}</span>)}</div>
      </div>
    </>
  );
}

export default function Discover() {
  const [queue, setQueue] = useState(null);
  const [match, setMatch] = useState(null);
  const [drag, setDrag] = useState({ x: 0, active: false, out: false });
  const start = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    fetch('/feed').then((r) => r.json()).then((d) => setQueue(d.profiles));
  }, []);

  async function commit(direction) {
    if (busy.current || !queue?.length) return;
    busy.current = true;
    const p = queue[0];
    setDrag({ x: direction === 'like' ? 600 : -600, active: false, out: true });
    const res = await fetch('/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: p.id, direction }),
    }).then((r) => r.json()).catch(() => ({}));
    setTimeout(() => {
      setQueue((q) => q.slice(1));
      setDrag({ x: 0, active: false, out: false });
      if (res.match) setMatch(res.profile);
      busy.current = false;
    }, 250);
  }

  const onDown = (e) => {
    if (busy.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = e.clientX;
    setDrag({ x: 0, active: true, out: false });
  };
  const onMove = (e) => drag.active && setDrag({ x: e.clientX - start.current, active: true, out: false });
  const onUp = () => {
    if (!drag.active) return;
    if (drag.x > THRESHOLD) commit('like');
    else if (drag.x < -THRESHOLD) commit('pass');
    else setDrag({ x: 0, active: false, out: false });
  };

  if (!queue) return <div className="center">Loading…</div>;
  if (queue.length === 0 && !match) {
    return (
      <div className="empty">
        <div style={{ fontSize: 56 }}>🎉</div>
        <h2>You&apos;re all caught up</h2>
        <p>No more profiles right now. Check back later or see your Matches.</p>
      </div>
    );
  }

  const [top, next] = queue;
  const style = {
    transform: `translateX(${drag.x}px) rotate(${drag.x / 20}deg)`,
    transition: drag.active ? 'none' : 'transform .25s ease',
    opacity: drag.out ? 0 : 1,
  };

  return (
    <>
      <div className="deck">
        {next && <div className="card back"><Card p={next} /></div>}
        {top && (
          <div className="card" style={style} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            <Card p={top} />
            {drag.x > 30 && <div className="stamp like" style={{ opacity: Math.min(drag.x / THRESHOLD, 1) }}>LIKE</div>}
            {drag.x < -30 && <div className="stamp nope" style={{ opacity: Math.min(-drag.x / THRESHOLD, 1) }}>NOPE</div>}
          </div>
        )}
      </div>
      <div className="actions">
        <button aria-label="Pass" onClick={() => commit('pass')}>✖️</button>
        <button aria-label="Like" onClick={() => commit('like')}>💚</button>
      </div>
      {match && (
        <div className="overlay">
          <h1>It&apos;s a match! 🎉</h1>
          <img src={match.photo} alt={match.name} />
          <p>You and {match.name} liked each other.</p>
          <button onClick={() => setMatch(null)}>Keep swiping</button>
        </div>
      )}
    </>
  );
}
