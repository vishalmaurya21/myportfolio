'use client';

import { useEffect, useRef, useState } from 'react';

const LINES = [
  { type: 'prompt', text: '$ whoami' },
  { type: 'output', text: 'vishal_maurya  →  Backend Engineer' },
  { type: 'blank', text: '' },
  { type: 'prompt', text: '$ skills --category languages' },
  { type: 'tag', text: '  [java]  [python]  [php]' },
  { type: 'prompt', text: '$ skills --category frameworks' },
  { type: 'tag', text: '  [spring-boot]  [laravel]' },
  { type: 'prompt', text: '$ skills --category databases' },
  { type: 'tag', text: '  [mysql]  [mongodb]' },
  { type: 'prompt', text: '$ skills --category devops' },
  { type: 'tag', text: '  [git]  [docker]  [linux]' },
  // { type: 'prompt', text: '$ skills --category Tools' },
  // { type: 'tag', text: '  [git]  [docker]  [linux]' },
  { type: 'blank', text: '' },
  { type: 'success', text: '\u2713  status: available_for_hire  uptime: 99.9%' },
];

const CATS = [
  {
    id: 'languages', label: 'Languages', color: '#e31616',
    skills: [
      { name: 'Java', level: 85 },
      { name: 'Python', level: 75 },
      { name: 'PHP', level: 70 },
    ],
  },
  {
    id: 'frameworks', label: 'Frameworks', color: '#3b82f6',
    skills: [
      { name: 'Spring Boot', level: 82 },
      { name: 'Laravel', level: 74 },
    ],
  },
  {
    id: 'databases', label: 'Databases', color: '#10b981',
    skills: [
      { name: 'MySQL', level: 85 },
      { name: 'MongoDB', level: 72 },
    ],
  },
  {
    id: 'devops', label: 'DevOps & Tools', color: '#f59e0b',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 75 },
    ],
  },
];

export default function TerminalSkills() {
  const [count, setCount] = useState(0);
  const [activeCat, setActiveCat] = useState('languages');
  const [barsOn, setBarsOn] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const tmr = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const step = () => {
            i++;
            setCount(i);
            if (i < LINES.length) {
              tmr.current = setTimeout(step, 145);
            } else {
              tmr.current = setTimeout(() => setBarsOn(true), 400);
            }
          };
          tmr.current = setTimeout(step, 500);
        }
      },
      { threshold: 0.15 }
    );
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => { obs.disconnect(); if (tmr.current) clearTimeout(tmr.current); };
  }, []);

  const cat = CATS.find(c => c.id === activeCat)!;

  const switchCat = (id: string) => {
    setActiveCat(id);
    setBarsOn(false);
    setTimeout(() => setBarsOn(true), 60);
  };

  return (
    <div ref={wrapRef} className="ts-wrap">

      {/* ── Terminal window ── */}
      <div className="ts-terminal" aria-label="Terminal showing backend skills">
        <div className="ts-titlebar">
          <div className="ts-lights">
            <span className="ts-light ts-close" aria-hidden="true" />
            <span className="ts-light ts-minimize" aria-hidden="true" />
            <span className="ts-light ts-maximize" aria-hidden="true" />
          </div>
          <span className="ts-termtitle">bash — vishal@server:~</span>
          <span style={{ width: 64 }} />
        </div>

        <div className="ts-body" role="log" aria-live="polite">
          {LINES.slice(0, count).map((line, i) => (
            <div key={i} className={`ts-line ts-${line.type}`}>
              {line.type === 'blank' ? '\u00A0' : line.text}
              {i === count - 1 && count < LINES.length && (
                <span className="ts-cursor" aria-hidden="true" />
              )}
            </div>
          ))}
          {count >= LINES.length && (
            <div className="ts-line ts-prompt">
              $&nbsp;<span className="ts-cursor" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* ── Category tabs + bars ── */}
      <div className="ts-skills">
        <div className="ts-tabs" role="tablist" aria-label="Skill categories">
          {CATS.map(c => (
            <button
              key={c.id}
              role="tab"
              aria-selected={activeCat === c.id}
              className={`ts-tab${activeCat === c.id ? ' ts-tab--active' : ''}`}
              onClick={() => switchCat(c.id)}
              style={{ '--tc': c.color } as React.CSSProperties}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="ts-bars" role="tabpanel">
          {cat.skills.map((s, i) => (
            <div key={s.name} className="ts-bar-row" style={{ animationDelay: `${i * 90}ms` }}>
              <div className="ts-bar-meta">
                <span className="ts-bar-name">{s.name}</span>
                <span className="ts-bar-pct" style={{ color: cat.color }}>{s.level}%</span>
              </div>
              <div className="ts-bar-track">
                <div
                  className="ts-bar-fill"
                  style={{
                    width: barsOn ? `${s.level}%` : '0%',
                    background: cat.color,
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
