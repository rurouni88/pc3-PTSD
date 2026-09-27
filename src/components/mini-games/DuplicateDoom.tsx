import { useState, useCallback } from 'react';

interface DuplicateDoomProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface Photo {
  id: number;
  label: string;
  emoji: string;
  isDuplicate: boolean;
  isBlurry: boolean;
}

const photos: Photo[] = [
  { id: 1, label: 'Rose Bush (sharp)', emoji: '🌹', isDuplicate: false, isBlurry: false },
  { id: 2, label: 'Rose Bush (blurry)', emoji: '🌹', isDuplicate: true, isBlurry: true },
  { id: 3, label: 'Rose Bush (blurry)', emoji: '🌹', isDuplicate: true, isBlurry: true },
  { id: 4, label: 'Rose Bush (dup)', emoji: '🌹', isDuplicate: true, isBlurry: false },
  { id: 5, label: 'Sunset (sharp)', emoji: '🌅', isDuplicate: false, isBlurry: false },
  { id: 6, label: 'Sunset (blurry)', emoji: '🌅', isDuplicate: true, isBlurry: true },
  { id: 7, label: 'Coffee (sharp)', emoji: '☕', isDuplicate: false, isBlurry: false },
  { id: 8, label: 'Coffee (blurry)', emoji: '☕', isDuplicate: true, isBlurry: true },
  { id: 9, label: 'Coffee (dup)', emoji: '☕', isDuplicate: true, isBlurry: false },
  { id: 10, label: 'Sunset (dup)', emoji: '🌅', isDuplicate: true, isBlurry: false },
  { id: 11, label: 'Cat (sharp)', emoji: '🐱', isDuplicate: false, isBlurry: false },
  { id: 12, label: 'Cat (blurry)', emoji: '🐱', isDuplicate: true, isBlurry: true },
];

const DUPLICATES_TO_DELETE = photos.filter((p) => p.isDuplicate).length;

export function DuplicateDoom({ onComplete, onCancel }: DuplicateDoomProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleted, setDeleted] = useState<Set<number>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [wrongPick, setWrongPick] = useState(false);

  const remainingPhotos = photos.filter((p) => !deleted.has(p.id));
  const duplicatesRemaining = remainingPhotos.filter((p) => p.isDuplicate).length;

  const toggleSelect = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleDelete = useCallback(() => {
    const hasWrongPick = [...selected].some((id) => {
      const photo = photos.find((p) => p.id === id);
      return photo && !photo.isDuplicate;
    });

    if (hasWrongPick) {
      setWrongPick(true);
      setShowConfirm(true);
      return;
    }

    setDeleted((prev) => new Set([...prev, ...selected]));
    setSelected(new Set());
    if (navigator.vibrate) navigator.vibrate(100);
  }, [selected]);

  if (duplicatesRemaining === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6">
        <span className="text-5xl mb-4">📷</span>
        <p className="text-xl font-bold text-primary">Storage freed!</p>
        <p className="text-sm text-secondary mt-2">
          Mum: "You didn't delete the pretty ones, did you?"
        </p>
        <button
          onClick={onComplete}
          className="mt-6 px-6 py-3 bg-accent-green text-white font-bold rounded-xl"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-primary">
      <div className="flex items-center justify-between p-3 border-b border-theme">
        <button onClick={onCancel} className="text-sm text-secondary">
          ← Back
        </button>
        <span className="text-sm font-bold text-primary">
          {duplicatesRemaining} duplicates left
        </span>
        <span className="text-xs text-muted">
          {selected.size} selected
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2">
          {remainingPhotos.map((photo) => {
            const isSelected = selected.has(photo.id);
            return (
              <button
                key={photo.id}
                onClick={() => toggleSelect(photo.id)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-accent-red/20 border-accent-red scale-95'
                    : 'bg-secondary border-theme'
                } ${photo.isBlurry ? 'blur-[1px]' : ''}`}
              >
                <span className="text-3xl">{photo.emoji}</span>
                {isSelected && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-accent-red rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-theme">
        <button
          onClick={handleDelete}
          disabled={selected.size === 0}
          className="w-full py-3 bg-accent-red text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          🗑️ Delete {selected.size > 0 ? `(${selected.size})` : ''}
        </button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl p-6 max-w-xs w-full mx-4 animate-slam-in">
            <p className="text-center font-bold text-gray-900 mb-2">
              {wrongPick ? 'Are you sure? Mum thinks that one is pretty.' : 'Delete selected photos?'}
            </p>
            {wrongPick && (
              <p className="text-center text-xs text-red-500 mb-3">
                That one isn't a duplicate! Deselect it.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setWrongPick(false);
                }}
                className="flex-1 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg"
              >
                Cancel
              </button>
              {!wrongPick && (
                <button
                  onClick={() => {
                    setDeleted((prev) => new Set([...prev, ...selected]));
                    setSelected(new Set());
                    setShowConfirm(false);
                  }}
                  className="flex-1 py-2 bg-red-500 text-white font-medium rounded-lg"
                >
                  Yes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
