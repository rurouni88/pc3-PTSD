import { ParentPrompt, Difficulty } from '../types/game';

interface ParentInterruptProps {
  prompt: ParentPrompt;
  difficulty: Difficulty;
  onAnswer: (optionIndex: number) => void;
  onDismiss: () => void;
}

const avatars: Record<Difficulty, string> = {
  dad: '👨',
  mum: '👩',
  grandma: '👵',
};

const expressions: Record<string, string> = {
  'direct-question': '❓',
  'backseat-swiper': '🤔',
  'guilt-trip': '😔',
};

export function ParentInterrupt({ prompt, difficulty, onAnswer, onDismiss }: ParentInterruptProps) {
  const isDialogue = prompt.type === 'direct-question';
  const isGuiltTrip = prompt.type === 'guilt-trip';
  const isBackseat = prompt.type === 'backseat-swiper';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Blurred background for dialogue traps */}
      {isDialogue && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      )}
      {isGuiltTrip && (
        <div className="absolute inset-0 border-8 border-gray-600/50 rounded-none" />
      )}

      <div className="relative z-10 w-full max-w-sm mx-4 animate-slam-in">
        {/* Speech bubble */}
        <div
          className={`relative p-4 rounded-2xl border-2 shadow-xl ${
            isGuiltTrip
              ? 'bg-gray-100 border-gray-400'
              : 'bg-yellow-50 border-yellow-300'
          }`}
        >
          {/* Tail */}
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-inherit border-r-2 border-b-2 border-inherit rotate-45" />

          <div className="flex items-start gap-3 mb-3">
            <div className="relative shrink-0">
              <span className="text-4xl">{avatars[difficulty]}</span>
              <span className="absolute -bottom-1 -right-1 text-xs">{expressions[prompt.type]}</span>
            </div>
            <p className="text-sm font-medium text-gray-800 leading-relaxed">
              "{prompt.question}"
            </p>
          </div>

          {/* Response options for dialogue questions */}
          {isDialogue && prompt.options.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              {prompt.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswer(index)}
                  className="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-left text-sm font-medium text-gray-700 hover:border-blue-400 hover:bg-blue-50 active:scale-95 transition-all"
                >
                  <span className="text-xs text-gray-400 block mb-1">
                    {option.timeCost > 0 ? `⏱ ~${option.timeCost}s` : '⏱ Instant'}
                    {option.batteryEffect !== 0 && (
                      <span className={option.batteryEffect < 0 ? 'text-red-500' : 'text-green-600'}>
                        {' '}🔋 {option.batteryEffect > 0 ? '+' : ''}{option.batteryEffect}%
                      </span>
                    )}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Dismiss for non-dialogue types */}
          {!isDialogue && (
            <div className="flex justify-center mt-4">
              <button
                onClick={onDismiss}
                className="px-6 py-2 bg-gray-700 text-white text-sm font-bold rounded-lg active:scale-95 transition-transform"
              >
                {isBackseat ? 'Dodge the hand!' : 'Keep focusing...'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
