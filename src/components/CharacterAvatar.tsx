// Simple SVG avatar faces for game characters.
// Replaces emoji with consistent, theme-aware illustrations.

type Character = 'dad' | 'mum' | 'grandma' | 'partner';

interface CharacterAvatarProps {
  character: Character;
  size?: number;
  className?: string;
}

export function CharacterAvatar({ character, size = 48, className = '' }: CharacterAvatarProps) {
  const skin = '#f5d0a9';
  const hair = '#1a1a1a';
  const whiteHair = '#c8c8c8';
  const glasses = '#333';
  const eye = '#1a1a1a';
  const mouth = '#c0392b';

  const faces: Record<Character, React.ReactNode> = {
    dad: (
      <>
        {/* Face */}
        <circle cx="24" cy="28" r="16" fill={skin} />
        {/* Hair — flat top */}
        <rect x="12" y="10" width="24" height="10" rx="3" fill={hair} />
        {/* Glasses */}
        <rect x="14" y="24" width="9" height="7" rx="2" fill="none" stroke={glasses} strokeWidth="1.5" />
        <rect x="27" y="24" width="9" height="7" rx="2" fill="none" stroke={glasses} strokeWidth="1.5" />
        <line x1="23" y1="27" x2="27" y2="27" stroke={glasses} strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="18.5" cy="27.5" r="1.5" fill={eye} />
        <circle cx="31.5" cy="27.5" r="1.5" fill={eye} />
        {/* Mouth */}
        <path d="M20 36 Q24 38 28 36" fill="none" stroke={mouth} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    mum: (
      <>
        {/* Hair behind — long */}
        <ellipse cx="24" cy="26" rx="18" ry="18" fill={hair} />
        {/* Face */}
        <circle cx="24" cy="28" r="15" fill={skin} />
        {/* Hair top — bangs */}
        <path d="M10 22 Q12 12 24 12 Q36 12 38 22 L36 20 Q34 16 24 16 Q14 16 12 20 Z" fill={hair} />
        {/* Eyes */}
        <circle cx="19" cy="27" r="2" fill={eye} />
        <circle cx="29" cy="27" r="2" fill={eye} />
        {/* Eyelashes */}
        <line x1="17" y1="25" x2="15" y2="24" stroke={eye} strokeWidth="1" />
        <line x1="31" y1="25" x2="33" y2="24" stroke={eye} strokeWidth="1" />
        {/* Mouth */}
        <path d="M20 35 Q24 38 28 35" fill="none" stroke={mouth} strokeWidth="1.5" strokeLinecap="round" />
        {/* Earrings */}
        <circle cx="9" cy="30" r="1.5" fill="#e74c3c" />
        <circle cx="39" cy="30" r="1.5" fill="#e74c3c" />
      </>
    ),
    grandma: (
      <>
        {/* Hair bun */}
        <circle cx="24" cy="12" r="7" fill={whiteHair} stroke="#999" strokeWidth="0.8" />
        {/* Hair sides */}
        <path d="M12 20 Q12 10 24 10 Q36 10 36 20 L34 22 Q32 14 24 14 Q16 14 14 22 Z" fill={whiteHair} stroke="#999" strokeWidth="0.8" />
        {/* Face */}
        <circle cx="24" cy="28" r="16" fill={skin} />
        {/* Hair top */}
        <path d="M10 24 Q10 14 24 12 Q38 14 38 24 L36 22 Q34 16 24 15 Q14 16 12 22 Z" fill={whiteHair} stroke="#999" strokeWidth="0.8" />
        {/* Reading glasses — round */}
        <circle cx="18" cy="27" r="5" fill="none" stroke={glasses} strokeWidth="1.5" />
        <circle cx="30" cy="27" r="5" fill="none" stroke={glasses} strokeWidth="1.5" />
        <line x1="23" y1="27" x2="25" y2="27" stroke={glasses} strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="18" cy="27" r="1.5" fill={eye} />
        <circle cx="30" cy="27" r="1.5" fill={eye} />
        {/* Wrinkles */}
        <path d="M16 33 Q18 34 20 33" fill="none" stroke="#c9a87c" strokeWidth="0.8" />
        <path d="M28 33 Q30 34 32 33" fill="none" stroke="#c9a87c" strokeWidth="0.8" />
        {/* Mouth */}
        <path d="M20 37 Q24 39 28 37" fill="none" stroke={mouth} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    partner: (
      <>
        {/* Hair — medium, slightly wavy */}
        <path d="M10 22 Q10 10 24 10 Q38 10 38 22 Q38 18 34 16 Q28 14 24 14 Q20 14 14 16 Q10 18 10 22 Z" fill={hair} />
        {/* Face */}
        <circle cx="24" cy="28" r="15" fill={skin} />
        {/* Hair top */}
        <path d="M11 22 Q11 13 24 12 Q37 13 37 22 L35 20 Q33 15 24 14 Q15 15 13 20 Z" fill={hair} />
        {/* Eyes */}
        <circle cx="19" cy="27" r="2" fill={eye} />
        <circle cx="29" cy="27" r="2" fill={eye} />
        {/* Eyebrows */}
        <path d="M16 23 Q19 22 22 23" fill="none" stroke={hair} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M26 23 Q29 22 32 23" fill="none" stroke={hair} strokeWidth="1.2" strokeLinecap="round" />
        {/* Mouth — neutral/slight smile */}
        <path d="M21 35 Q24 37 27 35" fill="none" stroke={mouth} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-label={character}
    >
      {faces[character]}
    </svg>
  );
}
