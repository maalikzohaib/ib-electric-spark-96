import React from 'react';

interface IconProps {
  name: 'check' | 'celebration' | 'rocket' | 'chart' | 'key' | 'target' | 'shield' | 'trending-up' | 'test' | 'books' | 'bug' | 'confetti' | 'lightbulb' | 'alert-circle' | 'refresh' | 'zap';
  size?: number;
  color?: string;
  className?: string;
}

const iconPaths: Record<string, JSX.Element> = {
  check: (
    <polyline points="20 6 9 17 4 12" />
  ),
  celebration: (
    <>
      <path d="M14.5 2l-1 2.5-2.5 1 2.5 1 1 2.5 1-2.5 2.5-1-2.5-1z" />
      <path d="M7 12l-1 2-2 1 2 1 1 2 1-2 2-1-2-1z" />
      <path d="M19 17l-.5 1.5-1.5.5 1.5.5.5 1.5.5-1.5 1.5-.5-1.5-.5z" />
      <line x1="12" y1="8" x2="12" y2="22" />
      <line x1="8" y1="12" x2="16" y2="20" />
      <line x1="16" y1="12" x2="8" y2="20" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  chart: (
    <>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </>
  ),
  key: (
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  shield: (
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  ),
  'trending-up': (
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>
  ),
  test: (
    <>
      <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
      <line x1="12" y1="7" x2="12" y2="9" />
      <circle cx="12" cy="14" r="1" />
    </>
  ),
  books: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="16" y1="6" x2="16" y2="10" />
      <line x1="12" y1="6" x2="12" y2="10" />
    </>
  ),
  bug: (
    <>
      <rect x="8" y="6" width="8" height="14" rx="4" />
      <path d="m8 6-3-3" />
      <path d="m16 6 3-3" />
      <line x1="4" y1="10" x2="8" y2="10" />
      <line x1="16" y1="10" x2="20" y2="10" />
      <line x1="4" y1="14" x2="8" y2="14" />
      <line x1="16" y1="14" x2="20" y2="14" />
      <path d="m8 20-3 3" />
      <path d="m16 20 3 3" />
    </>
  ),
  confetti: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 8l1.5 1.5" />
      <path d="M14.5 9.5L16 8" />
      <path d="M8 16l1.5-1.5" />
      <path d="M14.5 14.5L16 16" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 6v2" />
      <path d="M12 16v2" />
      <path d="M6 12h2" />
      <path d="M16 12h2" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  refresh: (
    <>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </>
  ),
  zap: (
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  ),
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = 'currentColor',
  className = '' 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {iconPaths[name]}
    </svg>
  );
};

export default Icon;
