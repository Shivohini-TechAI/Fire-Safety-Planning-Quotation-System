"use client";
export default function AuthIllustration() {
  return (
    <svg viewBox="0 0 680 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060b18" />
          <stop offset="55%" stopColor="#0a1228" />
          <stop offset="100%" stopColor="#0d1730" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
        </linearGradient>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#ff7a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      <rect x="0" y="0" width="680" height="900" fill="url(#skyGrad)" />
      <circle cx="540" cy="160" r="180" fill="url(#glowGrad)" />

      <g opacity="0.5">
        <circle cx="90" cy="90" r="1.6" fill="#ff9a4d" />
        <circle cx="180" cy="60" r="1.2" fill="#d9dce4" />
        <circle cx="260" cy="120" r="1.6" fill="#ff9a4d" />
        <circle cx="380" cy="50" r="1.2" fill="#d9dce4" />
        <circle cx="460" cy="90" r="1.6" fill="#ff9a4d" />
        <circle cx="600" cy="70" r="1.2" fill="#d9dce4" />
        <circle cx="60" cy="200" r="1.2" fill="#d9dce4" />
        <circle cx="320" cy="180" r="1.2" fill="#d9dce4" />
      </g>

      <g opacity="0.9">
        <rect x="0" y="430" width="120" height="300" fill="#0d1730" stroke="#16294e" strokeWidth="0.5" />
        <rect x="20" y="460" width="18" height="22" fill="#1d3563" />
        <rect x="55" y="460" width="18" height="22" fill="#1d3563" />
        <rect x="90" y="460" width="18" height="22" fill="#1d3563" />
        <rect x="20" y="500" width="18" height="22" fill="#1d3563" />
        <rect x="55" y="500" width="18" height="22" fill="#ff7a1a" fillOpacity="0.5" />
        <rect x="90" y="500" width="18" height="22" fill="#1d3563" />
        <rect x="20" y="540" width="18" height="22" fill="#1d3563" />
        <rect x="55" y="540" width="18" height="22" fill="#1d3563" />
        <rect x="90" y="540" width="18" height="22" fill="#ff7a1a" fillOpacity="0.5" />
        <rect x="20" y="580" width="18" height="22" fill="#ff7a1a" fillOpacity="0.5" />
        <rect x="55" y="580" width="18" height="22" fill="#1d3563" />
        <rect x="90" y="580" width="18" height="22" fill="#1d3563" />
        <rect x="20" y="620" width="18" height="22" fill="#1d3563" />
        <rect x="55" y="620" width="18" height="22" fill="#1d3563" />
        <rect x="90" y="620" width="18" height="22" fill="#1d3563" />
        <rect x="20" y="660" width="18" height="22" fill="#1d3563" />
        <rect x="55" y="660" width="18" height="22" fill="#ff7a1a" fillOpacity="0.5" />
        <rect x="90" y="660" width="18" height="22" fill="#1d3563" />
      </g>

      <g opacity="0.95">
        <rect x="560" y="380" width="110" height="350" fill="#0d1730" stroke="#16294e" strokeWidth="0.5" />
        <rect x="578" y="410" width="16" height="20" fill="#1d3563" />
        <rect x="610" y="410" width="16" height="20" fill="#1d3563" />
        <rect x="642" y="410" width="16" height="20" fill="#ff7a1a" fillOpacity="0.5" />
        <rect x="578" y="448" width="16" height="20" fill="#1d3563" />
        <rect x="610" y="448" width="16" height="20" fill="#1d3563" />
        <rect x="642" y="448" width="16" height="20" fill="#1d3563" />
        <rect x="578" y="486" width="16" height="20" fill="#ff7a1a" fillOpacity="0.5" />
        <rect x="610" y="486" width="16" height="20" fill="#1d3563" />
        <rect x="642" y="486" width="16" height="20" fill="#1d3563" />
        <rect x="578" y="524" width="16" height="20" fill="#1d3563" />
        <rect x="610" y="524" width="16" height="20" fill="#ff7a1a" fillOpacity="0.5" />
        <rect x="642" y="524" width="16" height="20" fill="#1d3563" />
        <rect x="578" y="562" width="16" height="20" fill="#1d3563" />
        <rect x="610" y="562" width="16" height="20" fill="#1d3563" />
        <rect x="642" y="562" width="16" height="20" fill="#1d3563" />
        <rect x="578" y="600" width="16" height="20" fill="#1d3563" />
        <rect x="610" y="600" width="16" height="20" fill="#1d3563" />
        <rect x="642" y="600" width="16" height="20" fill="#ff7a1a" fillOpacity="0.5" />
        <rect x="578" y="638" width="16" height="20" fill="#1d3563" />
        <rect x="610" y="638" width="16" height="20" fill="#1d3563" />
        <rect x="642" y="638" width="16" height="20" fill="#1d3563" />
      </g>

      <g>
        <rect x="180" y="260" width="320" height="470" fill="#0a1228" stroke="#1d3563" strokeWidth="1" />
        <rect x="180" y="260" width="320" height="14" fill="#1d3563" />

        <g>
          <rect x="205" y="300" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="255" y="300" width="34" height="40" fill="#ff7a1a" fillOpacity="0.65" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="305" y="300" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="355" y="300" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="405" y="300" width="34" height="40" fill="#ff7a1a" fillOpacity="0.65" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="455" y="300" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />

          <rect x="205" y="360" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="255" y="360" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="305" y="360" width="34" height="40" fill="#ff7a1a" fillOpacity="0.65" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="355" y="360" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="405" y="360" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="455" y="360" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />

          <rect x="205" y="420" width="34" height="40" fill="#ff7a1a" fillOpacity="0.65" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="255" y="420" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="305" y="420" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="355" y="420" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="405" y="420" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="455" y="420" width="34" height="40" fill="#ff7a1a" fillOpacity="0.65" stroke="#1d3563" strokeWidth="0.5" />

          <rect x="205" y="480" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="255" y="480" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="305" y="480" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="355" y="480" width="34" height="40" fill="#ff7a1a" fillOpacity="0.65" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="405" y="480" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="455" y="480" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />

          <rect x="205" y="540" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="255" y="540" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="305" y="540" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="355" y="540" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="405" y="540" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
          <rect x="455" y="540" width="34" height="40" fill="#11203e" stroke="#1d3563" strokeWidth="0.5" />
        </g>

        <rect x="310" y="600" width="60" height="130" fill="#0d1730" stroke="#1d3563" strokeWidth="0.5" />
        <rect x="318" y="612" width="44" height="44" fill="#11203e" />
        <circle cx="355" cy="634" r="2" fill="#ff9a4d" />
      </g>

      <g stroke="#ff7a1a" strokeWidth="0.5" fill="none" opacity="0.85">
        <path d="M260 340 L260 760" markerEnd="url(#arrow)" />
        <path d="M420 340 L420 760" markerEnd="url(#arrow)" />
      </g>

      <g>
        <circle cx="260" cy="780" r="13" fill="#ff7a1a" />
        <circle cx="260" cy="780" r="13" fill="none" stroke="#ff9a4d" strokeWidth="0.5" />
        <path d="M260 772 a8 8 0 1 0 0.01 0" fill="none" stroke="#0a1228" strokeWidth="1.6" />
      </g>
      <g>
        <circle cx="420" cy="780" r="13" fill="#ff7a1a" />
        <circle cx="420" cy="780" r="13" fill="none" stroke="#ff9a4d" strokeWidth="0.5" />
        <path d="M420 772 a8 8 0 1 0 0.01 0" fill="none" stroke="#0a1228" strokeWidth="1.6" />
      </g>

      <g transform="translate(340,815)">
        <path d="M0 -16 C 9 -6 9 6 0 16 C -9 6 -9 -6 0 -16 Z" fill="#0d1730" stroke="#ff7a1a" strokeWidth="1" />
        <path d="M0 -8 C 4 -3 4 4 0 9 C -4 4 -4 -3 0 -8 Z" fill="#ff7a1a" fillOpacity="0.7" />
      </g>

      <rect x="40" y="850" width="600" height="0.5" fill="#16294e" />
    </svg>
  );
}
