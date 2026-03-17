export default function WorkingPerson() {
  return (
    <div className="working-person">
      <svg
        viewBox="0 0 180 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Floor shadow */}
        <ellipse cx="90" cy="162" rx="60" ry="4" fill="rgba(0,0,0,0.06)" />

        {/* === Desk === */}
        <path d="M30 100 L135 97 L135 103 L30 106 Z" fill="#1a1a1a" />
        <rect x="34" y="103" width="3" height="50" rx="1" fill="#333" />
        <rect x="130" y="100" width="3.5" height="52" rx="1" fill="#2a2a2a" />

        {/* === Chair === */}
        <path d="M112 68 L116 68 L118 120 L112 120 Z" fill="#333" />
        <path d="M110 68 C108 72, 108 82, 110 88 L116 88 C118 82, 118 72, 116 68 Z" fill="#2a2a2a" />
        <line x1="110" y1="74" x2="116" y2="74" stroke="#3a3a3a" strokeWidth="0.5" />
        <line x1="110" y1="80" x2="116" y2="80" stroke="#3a3a3a" strokeWidth="0.5" />
        <path d="M95 120 L120 120 L122 127 L93 127 Z" fill="#2a2a2a" />
        <path d="M93 125 L122 125 L122 127 L93 127 Z" fill="#333" />
        <rect x="106" y="127" width="4" height="14" rx="1.5" fill="#444" />
        <path d="M95 141 L120 141" stroke="#444" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M97 112 L112 112" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round" />
        <rect x="95" y="108" width="2.5" height="12" rx="1" fill="#3a3a3a" />
        <circle cx="95" cy="143" r="2.5" fill="#555" />
        <circle cx="120" cy="143" r="2.5" fill="#555" />

        {/* === MacBook === */}
        <path d="M44 94 L95 91 L95 97 L44 100 Z" fill="#666" />
        <path d="M48 56 L92 53 L95 91 L50 94 Z" fill="#1a1a1a" />
        <path d="M51 59 L90 56.5 L92 88 L53 91 Z" fill="#111" />
        <g className="screen-lines">
          <line x1="55" y1="63" x2="70" y2="62" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="55" y1="67" x2="82" y2="66" stroke="#999" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <line x1="55" y1="71" x2="76" y2="70" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          <line x1="55" y1="75" x2="66" y2="74.5" stroke="#888" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
          <line x1="55" y1="79" x2="84" y2="78" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
        </g>
        <path d="M51 59 L90 56.5 L92 88 L53 91 Z" fill="white" opacity="0.03" />

        {/* === Person (3/4 back view — slight left cheek/jaw visible) === */}

        {/* Torso (slim) */}
        <path
          d="M90 72 C87 76, 85 84, 86 94 L87 120 L107 120 L108 94 C108 82, 106 72, 100 70 Z"
          fill="#1a1a1a"
        />
        <path d="M92 72 C94 73, 97 73, 99 72" fill="none" stroke="#333" strokeWidth="0.8" />

        {/* Neck (wider, clearly visible below ear) */}
        <path d="M91 62 L101 62 L102 72 L90 72 Z" fill="#ddd" />
        {/* Neck side shadow */}
        <path d="M91 62 C90 65, 90 68, 90 72" fill="none" stroke="#c8c8c8" strokeWidth="0.5" />

        {/* Head */}
        <g className="person-head">
          {/* Base head shape */}
          <ellipse cx="96" cy="52" rx="13" ry="13" fill="#ddd" />

          {/* Left cheek/jaw visible */}
          <path
            d="M83 48 C82 52, 82 56, 83 59 C84 61, 86 63, 89 64
               L89 60 C87 58, 85 55, 84 52 C84 50, 83.5 49, 83 48 Z"
            fill="#ddd"
          />
          {/* Jawline shadow */}
          <path
            d="M84 59 C85 61, 87 62, 89 63"
            fill="none" stroke="#c5c5c5" strokeWidth="0.6" strokeLinecap="round"
          />

          {/* Left ear (clearly visible, hair ends above it) */}
          <ellipse cx="84.5" cy="55" rx="2.5" ry="3.5" fill="#d0d0d0" />
          <ellipse cx="84.5" cy="55" rx="1.5" ry="2.5" fill="#c8c8c8" />
          {/* Earlobe */}
          <circle cx="84.5" cy="58" r="1" fill="#d0d0d0" />

          {/* Hair — covers top & back, stops well above ear on left */}
          {/* Main hair mass */}
          <path
            d="M88 46 C87 40, 89 34, 96 32 C106 34, 110 40, 109 48
               C109 54, 108 58, 106 62 C104 64, 100 66, 96 66
               C94 66, 92 65, 91 63 C90 61, 89 57, 88 52 Z"
            fill="#333"
          />
          {/* Top crown highlight */}
          <path
            d="M90 36 C92 33, 96 31, 100 32 C105 33, 108 36, 109 40
               C107 37, 103 34, 98 33 C94 33, 91 34, 90 36 Z"
            fill="#3a3a3a"
          />
          {/* Layer texture */}
          <path d="M91 34 C93 32, 97 31, 101 32 C98 33, 94 33, 91 35 Z" fill="#444" />

          {/* Right side layers (longer, away from viewer) */}
          <path
            d="M109 46 C110 52, 110 56, 109 61 C108 63, 107 65, 106 66
               C107 64, 108 60, 108.5 54 C109 50, 109 48, 108.5 46 Z"
            fill="#3a3a3a"
          />

          {/* Hair texture lines on back */}
          <path d="M96 34 C96 40, 96 48, 96 56" fill="none" stroke="#3a3a3a" strokeWidth="0.5" />
          <path d="M100 35 C101 41, 102 49, 102 57" fill="none" stroke="#3a3a3a" strokeWidth="0.4" />

          {/* Left side — hair ends above ear, clean cut */}
          <path
            d="M88 46 C87 42, 88 38, 90 36
               C89 40, 88 44, 88 48 C88 50, 88 51, 88.5 52
               C88 51, 88 49, 88 47 Z"
            fill="#3a3a3a"
          />

          {/* Short sideburn in front of ear */}
          <path
            d="M86 50 C85.5 52, 85.5 53.5, 86 54 C86.5 53, 86.5 52, 86 50.5 Z"
            fill="#444"
          />

          {/* Nape wisps */}
          <path d="M93 64 C92 67, 92 68, 93 68.5 C93.5 67.5, 93 66, 93 65 Z" fill="#333" />
          <path d="M100 64 C101 67, 101 68, 100 68.5 C99.5 67.5, 100 66, 100 65 Z" fill="#333" />
          <path d="M104 62 C105 65, 106 67, 105 68 C104 67, 104 65, 103.5 63 Z" fill="#333" />
        </g>

        {/* === Arms & Hands === */}
        {/* Far arm */}
        <path d="M90 78 C87 82, 84 88, 82 92" fill="none" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" />
        <path d="M82 92 C78 94, 74 95, 70 95" fill="none" stroke="#222" strokeWidth="4.5" strokeLinecap="round" />

        <g className="hand-far">
          <ellipse cx="68" cy="95" rx="3.5" ry="2.2" fill="#ddd" />
          <g className="fingers-far">
            <line x1="65.5" y1="94" x2="64" y2="92.5" stroke="#ddd" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="67" y1="93.5" x2="65.5" y2="91.5" stroke="#ddd" strokeWidth="1.3" strokeLinecap="round" />
          </g>
        </g>

        {/* Near arm */}
        <path d="M92 80 C89 84, 87 90, 85 93" fill="none" stroke="#111" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M85 93 C82 94, 80 95, 78 95" fill="none" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" />

        <g className="hand-near">
          <ellipse cx="76.5" cy="94.5" rx="4" ry="2.5" fill="#ddd" />
          <g className="fingers-near">
            <line x1="74" y1="93" x2="72.5" y2="91" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="75.5" y1="92.5" x2="74.5" y2="90.5" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* === Legs (crossed) === */}
        <path
          d="M90 118 C84 120, 76 122, 72 124 C70 126, 70 130, 74 134 L80 148"
          fill="none" stroke="#333" strokeWidth="5.5" strokeLinecap="round"
        />
        <path d="M76 146 L84 146 L84 150 L74 150 Z" fill="#2a2a2a" />

        <path
          d="M94 118 C88 120, 80 121, 74 120 C70 119, 66 120, 64 124 L60 138"
          fill="none" stroke="#2a2a2a" strokeWidth="6" strokeLinecap="round"
        />
        <path d="M56 136 L64 136 L64 140 L54 140 Z" fill="#1a1a1a" />
        <path d="M54 140 L64 140 L64 141.5 L53 141.5 Z" fill="#333" />
      </svg>
    </div>
  )
}
