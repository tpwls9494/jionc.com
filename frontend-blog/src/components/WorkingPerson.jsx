export default function WorkingPerson() {
  return (
    <div className="working-person">
      <svg
        viewBox="0 0 200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Floor shadow */}
        <ellipse cx="100" cy="170" rx="70" ry="6" fill="rgba(0,0,0,0.08)" />

        {/* Desk legs */}
        <rect x="50" y="105" width="3" height="55" rx="1" fill="#2a2a2a" />
        <rect x="147" y="105" width="3" height="55" rx="1" fill="#2a2a2a" />

        {/* Desk surface */}
        <rect x="42" y="100" width="116" height="6" rx="2" fill="#1a1a1a" />

        {/* Chair back */}
        <rect x="72" y="85" width="4" height="50" rx="2" fill="#3a3a3a" />
        <rect x="124" y="85" width="4" height="50" rx="2" fill="#3a3a3a" />
        <rect x="70" y="82" width="60" height="6" rx="3" fill="#2a2a2a" />

        {/* Chair seat */}
        <rect x="68" y="130" width="64" height="5" rx="2" fill="#2a2a2a" />

        {/* Chair legs */}
        <line x1="75" y1="135" x2="70" y2="162" stroke="#3a3a3a" strokeWidth="3" strokeLinecap="round" />
        <line x1="125" y1="135" x2="130" y2="162" stroke="#3a3a3a" strokeWidth="3" strokeLinecap="round" />

        {/* Chair wheels */}
        <circle cx="68" cy="164" r="3" fill="#555" />
        <circle cx="132" cy="164" r="3" fill="#555" />

        {/* MacBook base */}
        <rect x="78" y="94" width="44" height="6" rx="1" fill="#555" />

        {/* MacBook screen */}
        <g className="laptop-screen">
          <rect x="80" y="62" width="40" height="32" rx="2" fill="#1a1a1a" />
          <rect x="82" y="64" width="36" height="26" rx="1" fill="#0f172a" />
          {/* Screen content lines */}
          <g className="screen-lines">
            <rect x="85" y="68" width="16" height="1.5" rx="0.5" fill="#38bdf8" opacity="0.8" />
            <rect x="85" y="72" width="24" height="1.5" rx="0.5" fill="#a78bfa" opacity="0.6" />
            <rect x="85" y="76" width="20" height="1.5" rx="0.5" fill="#34d399" opacity="0.7" />
            <rect x="85" y="80" width="12" height="1.5" rx="0.5" fill="#fb923c" opacity="0.5" />
            <rect x="85" y="84" width="28" height="1.5" rx="0.5" fill="#38bdf8" opacity="0.4" />
          </g>
          {/* Screen glow */}
          <rect x="82" y="64" width="36" height="26" rx="1" fill="url(#screenGlow)" opacity="0.15" />
        </g>

        {/* Person body */}
        <g className="person-body">
          {/* Torso */}
          <path
            d="M92 108 C92 95, 90 88, 100 85 C110 88, 108 95, 108 108"
            fill="#1a1a1a"
          />
          {/* Neck */}
          <rect x="96" y="78" width="8" height="8" rx="3" fill="#e8c4a0" />
          {/* Head */}
          <g className="person-head">
            <ellipse cx="100" cy="70" rx="12" ry="13" fill="#e8c4a0" />
            {/* Hair */}
            <path
              d="M88 67 C88 58, 92 53, 100 52 C108 53, 112 58, 112 67 C112 62, 108 58, 100 57 C92 58, 88 62, 88 67Z"
              fill="#1a1a1a"
            />
            {/* Glasses */}
            <circle cx="95" cy="70" r="4" fill="none" stroke="#555" strokeWidth="1" />
            <circle cx="105" cy="70" r="4" fill="none" stroke="#555" strokeWidth="1" />
            <line x1="99" y1="70" x2="101" y2="70" stroke="#555" strokeWidth="1" />
            {/* Eyes behind glasses */}
            <g className="person-eyes">
              <ellipse cx="95" cy="70" rx="1.2" ry="1.5" fill="#1a1a1a" />
              <ellipse cx="105" cy="70" rx="1.2" ry="1.5" fill="#1a1a1a" />
            </g>
            {/* Mouth */}
            <path d="M97 75 Q100 77 103 75" fill="none" stroke="#c4956a" strokeWidth="0.8" strokeLinecap="round" />
          </g>

          {/* Left arm (typing) */}
          <g className="arm-left">
            <path
              d="M92 95 C85 98, 82 100, 86 100"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="86" cy="100" r="3" fill="#e8c4a0" />
          </g>

          {/* Right arm (typing) */}
          <g className="arm-right">
            <path
              d="M108 95 C115 98, 118 100, 114 100"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="114" cy="100" r="3" fill="#e8c4a0" />
          </g>

          {/* Legs */}
          <path d="M94 108 L90 130 L96 130" fill="#2a2a2a" />
          <path d="M106 108 L110 130 L104 130" fill="#2a2a2a" />
          {/* Shoes */}
          <rect x="86" y="128" width="12" height="4" rx="2" fill="#1a1a1a" />
          <rect x="102" y="128" width="12" height="4" rx="2" fill="#1a1a1a" />
        </g>

        {/* Coffee mug on desk */}
        <g className="coffee-mug">
          <rect x="130" y="88" width="10" height="12" rx="2" fill="#e5e5e5" />
          <path d="M140 91 C144 91, 144 97, 140 97" fill="none" stroke="#e5e5e5" strokeWidth="1.5" />
          {/* Steam */}
          <g className="steam">
            <path d="M133 86 Q134 82 133 78" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeLinecap="round" />
            <path d="M136 87 Q137 83 136 79" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeLinecap="round" />
          </g>
        </g>

        {/* Small plant on desk */}
        <g>
          <rect x="52" y="90" width="8" height="10" rx="2" fill="#d4a574" />
          <circle cx="56" cy="86" r="6" fill="#22c55e" opacity="0.7" />
          <circle cx="53" cy="84" r="4" fill="#16a34a" opacity="0.6" />
          <circle cx="59" cy="83" r="4" fill="#15803d" opacity="0.5" />
        </g>

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="screenGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
