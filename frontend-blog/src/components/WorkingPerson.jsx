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
        <path d="M92 120 L120 120 L122 127 L90 127 Z" fill="#2a2a2a" />
        <path d="M90 125 L122 125 L122 127 L90 127 Z" fill="#333" />
        <rect x="104" y="127" width="4" height="14" rx="1.5" fill="#444" />
        <path d="M92 141 L120 141" stroke="#444" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M94 112 L112 112" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round" />
        <rect x="92" y="108" width="2.5" height="12" rx="1" fill="#3a3a3a" />
        <circle cx="92" cy="143" r="2.5" fill="#555" />
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

        {/* === Person === */}

        {/* Head (profile) */}
        <g className="person-head">
          {/* Head shape */}
          <path
            d="M100 46 C94 42, 86 44, 83 50 C81 56, 82 62, 86 65 L90 67 C94 67, 98 63, 100 58 C102 52, 102 48, 100 46 Z"
            fill="#ddd"
          />
          {/* Wolf cut — top layers (choppy, textured) */}
          <path
            d="M101 43 C97 36, 87 35, 82 40 C79 43, 78 48, 79 52
               C80 47, 84 42, 91 40 C96 39, 100 41, 101 44 Z"
            fill="#1a1a1a"
          />
          {/* Wolf cut — front face-framing pieces (wispy bangs) */}
          <path
            d="M84 44 C82 47, 81 51, 82 54 C82.5 51, 83 48, 84.5 45 Z"
            fill="#222"
          />
          <path
            d="M86 43 C84 46, 83 50, 83.5 53 C84 49, 85 46, 86.5 44 Z"
            fill="#1a1a1a"
          />
          {/* Wolf cut — layered side pieces (longer, past ear, tapered) */}
          <path
            d="M100 43 C102 47, 103 53, 103 58 C103 62, 102 66, 100 69
               C99 67, 99 64, 99.5 60 C100 55, 100.5 49, 100 44 Z"
            fill="#1a1a1a"
          />
          <path
            d="M101 46 C103 50, 104 56, 103 62 C102 66, 100 69, 98 70
               C99 67, 100 63, 100 58 C100.5 53, 101 49, 101 47 Z"
            fill="#222"
          />
          {/* Wolf cut — back layers (shorter on top, longer below) */}
          <path
            d="M101 42 C103 44, 104 48, 104 52 C104 48, 103 44, 101 43 Z"
            fill="#1a1a1a"
          />
          {/* Ear (peeking through layers) */}
          <ellipse cx="98.5" cy="55" rx="1.8" ry="2.5" fill="#ccc" />
          {/* Nose */}
          <path d="M83 53 L80 56 L83 57" fill="none" stroke="#bbb" strokeWidth="0.8" strokeLinecap="round" />
          {/* Jaw */}
          <path d="M86 65 L90 67" fill="none" stroke="#c5c5c5" strokeWidth="0.5" />
        </g>

        {/* Neck */}
        <path d="M93 64 L97 64 L99 72 L91 72 Z" fill="#ddd" />

        {/* Torso */}
        <path
          d="M87 72 C83 76, 81 84, 82 94 L84 120 L110 120 L112 94 C112 82, 108 72, 102 70 Z"
          fill="#1a1a1a"
        />
        <path d="M90 72 C92 74, 96 74, 98 72" fill="none" stroke="#333" strokeWidth="1" />

        {/* === Arms & Hands (typing) === */}
        {/* Far arm */}
        <path d="M87 78 C83 82, 80 88, 78 92" fill="none" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" />
        <path d="M78 92 C74 94, 70 95, 66 95" fill="none" stroke="#222" strokeWidth="5" strokeLinecap="round" />

        {/* Far hand + fingers */}
        <g className="hand-far">
          <ellipse cx="64" cy="95" rx="4" ry="2.5" fill="#ddd" />
          <g className="fingers-far">
            <line x1="61" y1="94" x2="59.5" y2="92.5" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="63" y1="93.5" x2="61.5" y2="91.5" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Near arm */}
        <path d="M89 80 C85 84, 83 90, 81 93" fill="none" stroke="#111" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M81 93 C78 94, 76 95, 74 95" fill="none" stroke="#1a1a1a" strokeWidth="5.5" strokeLinecap="round" />

        {/* Near hand + fingers */}
        <g className="hand-near">
          <ellipse cx="73" cy="94.5" rx="4.5" ry="2.8" fill="#ddd" />
          <g className="fingers-near">
            <line x1="70" y1="93" x2="68.5" y2="91" stroke="#ddd" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="72" y1="92.5" x2="71" y2="90.5" stroke="#ddd" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </g>

        {/* === Legs (crossed, side view) === */}
        {/* Back leg (underneath) — thigh extends forward, shin tucks back */}
        <path
          d="M88 118 C82 120, 74 122, 70 124 C68 126, 68 130, 72 134 L78 148"
          fill="none"
          stroke="#333"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Back shoe */}
        <path d="M74 146 L82 146 L82 150 L72 150 Z" fill="#2a2a2a" />

        {/* Front leg (on top) — crosses over, ankle rests on other knee */}
        <path
          d="M92 118 C86 120, 78 121, 72 120 C68 119, 64 120, 62 124 L58 138"
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Front shoe (dangling) */}
        <path d="M54 136 L62 136 L62 140 L52 140 Z" fill="#1a1a1a" />
        <path d="M52 140 L62 140 L62 141.5 L51 141.5 Z" fill="#333" />
      </svg>
    </div>
  )
}
