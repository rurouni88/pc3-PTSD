import { useState, useCallback } from 'react';
import { Icon } from '../Icon';
import { playSound } from '../../engine/sound';
import { t, isRTL } from '../../config/translations';
import { Hint } from '../Hint';
import type { PhotoTheme, ForeignLanguage } from '../../types/game';

interface DuplicateDoomProps {
  photoTheme: PhotoTheme;
  difficulty: string;
  foreignLanguage: ForeignLanguage | null;
  onComplete: () => void;
  onCancel: () => void;
}

const completionQuotes: Record<string, string> = {
  dad: 'Dad: "You didn\'t delete the lucky scorecard, did you?"',
  mum: 'Mum: "You didn\'t delete the pretty ones, did you?"',
  grandma: 'Grandma: "The cat is still there, yes? Good."',
};

interface Photo {
  id: number;
  label: string;
  icon: string;
  isDuplicate: boolean;
  isBlurry: boolean;
}

function buildPhotos(theme: PhotoTheme): Photo[] {
  const photos: Photo[] = [
    { id: 1, label: theme.importantLabel, icon: theme.importantIcon, isDuplicate: false, isBlurry: false },
  ];
  theme.decoyLabels.forEach((label, i) => {
    photos.push({
      id: i + 2,
      label,
      icon: theme.decoyIcon,
      isDuplicate: true,
      isBlurry: i % 2 === 0,
    });
  });
  return photos;
}

export function DuplicateDoom({ photoTheme, difficulty, foreignLanguage, onComplete, onCancel }: DuplicateDoomProps) {
  const [photos] = useState(() => buildPhotos(photoTheme));
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
      playSound('failure');
      return;
    }

    setDeleted((prev) => new Set([...prev, ...selected]));
    setSelected(new Set());
    playSound('click');
    if (navigator.vibrate) navigator.vibrate(100);
  }, [selected, photos]);

  if (duplicatesRemaining === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6" dir={isRTL(foreignLanguage) ? 'rtl' : 'ltr'}>
        <Icon name="photos" size={48} className="text-accent-blue mb-4" />
        <p className="text-xl font-bold text-primary">{t(foreignLanguage, 'duplicates.freed')}</p>
        <p className="text-sm text-secondary mt-2">
          {completionQuotes[difficulty] ?? photoTheme.confirmPrompt}
        </p>
        <button
          onClick={() => { playSound('success'); onComplete(); }}
          className="mt-6 px-6 py-3 bg-accent-green text-primary font-bold rounded-xl"
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
          {t(foreignLanguage, 'duplicates.left', { n: duplicatesRemaining })}
        </span>
        <span className="text-xs text-muted">
          {selected.size} selected
        </span>
      </div>

      <Hint visible={deleted.size === 0}>Tap duplicates to select, then tap Delete</Hint>

      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2">
          {remainingPhotos.map((photo) => {
            const isSelected = selected.has(photo.id);
            return (
              <button
                key={photo.id}
                onClick={() => toggleSelect(photo.id)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all relative ${
                  isSelected
                    ? 'bg-accent-red/20 border-accent-red scale-95'
                    : 'bg-secondary border-theme'
                } ${photo.isBlurry ? 'blur-[1px]' : ''}`}
              >
                <Icon name={photo.icon} size={40} className={photo.isBlurry ? 'opacity-50' : ''} />
                <span className="text-[8px] text-muted mt-1 px-1 truncate w-full text-center">{photo.label}</span>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-accent-red rounded-full flex items-center justify-center">
                    <Icon name="check" size={12} className="text-primary" />
                  </div>
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
          className="w-full py-3 bg-accent-red text-primary font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Icon name="trash" size={16} className="text-primary" />
          {t(foreignLanguage, 'duplicates.delete')} {selected.size > 0 ? `(${selected.size})` : ''}
        </button>
      </div>

      {showConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl p-6 max-w-xs w-full mx-4 animate-slam-in">
            <p className="text-center font-bold text-gray-900 mb-2">
              {wrongPick ? photoTheme.confirmPrompt : 'Delete selected photos?'}
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
