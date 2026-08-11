import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import './ScrambledText.css';

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) => {
  const rootRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    if (!rootRef.current) return;
    charsRef.current = Array.from(rootRef.current.querySelectorAll('.char'));
    if (!charsRef.current.length) return;

    const availableChars = scrambleChars || '.:';
    const randomChar = () => availableChars[Math.floor(Math.random() * availableChars.length)] || '.';

    const scrambleChar = (c, tweenDuration) => {
      if (!c.dataset.content || c.dataset.content === ' ' || c.dataset.scrambling === '1') return;
      c.dataset.scrambling = '1';
      const state = { progress: 0 };
      gsap.to(state, {
        overwrite: true,
        duration: tweenDuration,
        progress: 1,
        ease: 'none',
        onUpdate: () => {
          c.textContent = state.progress < 0.7 ? randomChar() : c.dataset.content;
        },
        onComplete: () => {
          c.textContent = c.dataset.content;
          c.dataset.scrambling = '0';
        }
      });
    };

    const handleMove = e => {
      charsRef.current.forEach(c => {
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          scrambleChar(c, Math.max(0.12, duration * (1 - dist / radius) * (1 + speed * 0.5)));
        }
      });
    };

    const el = rootRef.current;
    el.addEventListener('pointermove', handleMove);

    return () => {
      el.removeEventListener('pointermove', handleMove);
    };
  }, [radius, duration, speed, scrambleChars]);

  const textContent = typeof children === 'string' ? children : null;

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>
        {textContent === null
          ? children
          : textContent.split('').map((char, index) => (
            <span key={`${char}-${index}`} className="char" data-content={char}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
      </p>
    </div>
  );
};

export default ScrambledText;
