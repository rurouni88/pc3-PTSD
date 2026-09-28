interface BottomBarProps {
  onHome: () => void;
  onBack: () => void;
}

export function BottomBar({ onHome, onBack }: BottomBarProps) {
  return (
    <div
      className="flex items-center justify-center h-8 bg-secondary border-t border-theme"
      onClick={onHome}
    >
      {/* iOS home indicator */}
      <div
        className="w-32 h-1 bg-gray-500 rounded-full"
        onClick={onBack}
      />
    </div>
  );
}
