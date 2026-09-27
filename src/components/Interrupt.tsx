interface InterruptProps {
  message: string;
  onClose: () => void;
  type?: 'parent' | 'spam' | 'alert';
}

export function Interrupt({ message, onClose, type = 'parent' }: InterruptProps) {
  const bubbleStyle = type === 'parent'
    ? 'bg-yellow-50 border-2 border-yellow-300 shadow-lg rounded-2xl'
    : type === 'spam'
      ? 'bg-red-50 border-2 border-red-300 shadow-lg rounded-xl'
      : 'bg-white border-2 border-blue-300 shadow-lg rounded-xl';

  const textStyle = type === 'parent'
    ? 'text-gray-800 font-handwriting'
    : 'text-gray-800 font-bold';

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className={`${bubbleStyle} p-4 max-w-[80%] animate-slide-down`}>
        <p className={`${textStyle} text-center mb-3`}>{message}</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-blue-600 transition-colors`}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
