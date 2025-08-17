import React from 'react';

const Logo = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M50 2.5 L93.3 26.25 V73.75 L50 97.5 L6.7 73.75 V26.25 Z"
        fill="url(#logoGradient)"
        stroke="#1e3a8a"
        strokeWidth="3"
      />
      <text
        x="50"
        y="62"
        fontFamily="Inter, sans-serif"
        fontSize="50"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        letterSpacing="-2"
      >
        A
      </text>
    </svg>
  </div>
);

export default Logo;
