interface HintProps {
  children: React.ReactNode;
  visible?: boolean;
  className?: string;
}

/**
 * Subtle instructional hint displayed at the top of a mini-game.
 * Consistent styling across all mini-games.
 */
export function Hint({ children, visible = true, className = '' }: HintProps) {
  if (!visible) return null;
  return (
    <p className={`text-center text-[0.65rem] text-muted px-3 py-1 ${className}`}>
      {children}
    </p>
  );
}
