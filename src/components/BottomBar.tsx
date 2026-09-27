interface BottomBarProps {
  onHome: () => void;
  onBack: () => void;
}

export function BottomBar({ onHome, onBack }: BottomBarProps) {
  return (
    <div className="flex items-center justify-around h-16 bg-secondary border-t border-theme">
      <button
        onClick={onBack}
        className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-white hover:bg-tertiary transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-xs mt-1">Back</span>
      </button>
      <button
        onClick={onHome}
        className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-white hover:bg-tertiary transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="text-xs mt-1">Home</span>
      </button>
      <button
        className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-white hover:bg-tertiary transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path strokeLinecap="round" d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
        <span className="text-xs mt-1">Apps</span>
      </button>
    </div>
  );
}
