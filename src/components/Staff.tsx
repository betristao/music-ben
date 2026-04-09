import React from 'react';

export interface StaffNote {
  y: number;
  accidental?: 'sharp' | 'flat' | null;
  x?: number;
}

interface StaffProps {
  clef: 'treble' | 'bass';
  notes?: StaffNote[];
}

export function Staff({ clef, notes = [] }: StaffProps) {
  // Calculate ledgers dynamically based on all notes
  const ledgers = new Set<number>();
  notes.forEach(note => {
    if (note.y >= 120) {
      for (let y = 120; y <= note.y; y += 20) ledgers.add(y);
    }
    if (note.y <= 0) {
      for (let y = 0; y >= note.y; y -= 20) ledgers.add(y);
    }
  });

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden bg-white/80 rounded-2xl p-6 shadow-sm border-2 border-slate-100">
      <svg viewBox="0 0 200 140" className="w-full h-auto drop-shadow-sm">
        {/* Staff Lines */}
        {[20, 40, 60, 80, 100].map((y) => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#334155" strokeWidth="1.5" />
        ))}

        {/* Clef */}
        {clef === 'treble' ? (
          <text x="15" y="95" fontSize="75" fontFamily="serif" fill="#334155">𝄞</text>
        ) : (
          <text x="15" y="75" fontSize="75" fontFamily="serif" fill="#334155">𝄢</text>
        )}

        {/* Ledger Lines */}
        {Array.from(ledgers).map((y) => (
          <line key={y} x1="50" y1={y} x2="170" y2={y} stroke="#334155" strokeWidth="2" />
        ))}

        {/* Notes */}
        {notes.map((note, idx) => {
          const cx = note.x || 100;
          return (
            <g key={idx}>
              {/* Accidental */}
              {note.accidental === 'sharp' && (
                <text x={cx - 25} y={note.y + 8} fontSize="26" fontFamily="serif" fill="#0f172a" fontWeight="bold">♯</text>
              )}
              {note.accidental === 'flat' && (
                <text x={cx - 25} y={note.y + 6} fontSize="26" fontFamily="serif" fill="#0f172a" fontWeight="bold">♭</text>
              )}
              
              {/* Note Head */}
              <ellipse 
                cx={cx} 
                cy={note.y} 
                rx="11" 
                ry="8" 
                fill="#0f172a" 
                transform={`rotate(-15 ${cx} ${note.y})`} 
              />
              
              {/* Stem */}
              <line 
                x1={note.y > 60 ? cx + 9 : cx - 9} 
                y1={note.y} 
                x2={note.y > 60 ? cx + 9 : cx - 9} 
                y2={note.y > 60 ? note.y - 35 : note.y + 35} 
                stroke="#0f172a" 
                strokeWidth="2" 
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
