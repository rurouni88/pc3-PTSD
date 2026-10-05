// InfoTooltip — Lightweight, non-blocking info popover.
// Bottom-anchored, tap-to-dismiss. For "What does this mean?" questions.
// Different from Modal: no dark backdrop, doesn't block interaction.

interface InfoTooltipProps {
  content: { title: string; description: string } | null;
  onClose: () => void;
}

export function InfoTooltip({ content, onClose }: InfoTooltipProps) {
  if (!content) return null;

  return (
    <>
      {/* Transparent hit-area for tap-to-dismiss */}
      <div className="fixed inset-0 z-[55]" onClick={onClose} />
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] max-w-xs w-[90%] bg-secondary border border-theme rounded-xl p-3 shadow-lg animate-slide-up"
        onClick={onClose}
      >
        <p className="text-sm font-bold text-primary">{content.title}</p>
        <p className="text-xs text-secondary mt-1">{content.description}</p>
        <p className="text-[0.6rem] text-muted text-center mt-2">tap to dismiss</p>
      </div>
    </>
  );
}
