'use client';
import { useState } from 'react';
import Discover from '@/components/Discover';
import Matches from '@/components/Matches';

export default function Page() {
  const [tab, setTab] = useState('discover');
  return (
    <div className="app">
      <div className="content">
        {tab === 'home' && null /* Placeholder: intentionally blank */}
        {tab === 'discover' && <Discover />}
        {tab === 'matches' && <Matches />}
      </div>
      <nav className="tabs">
        {[['home', '🏠 Home'], ['discover', '🔥 Discover'], ['matches', '💘 Matches']].map(([k, label]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>
        ))}
      </nav>
    </div>
  );
}
