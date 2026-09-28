import { useState, useCallback, useRef } from 'react';
import { Icon } from '../Icon';
import { playSound } from '../../engine/sound';
import { RngEngine } from '../../engine/seeded-rng';
import { t, isRTL } from '../../config/translations';
import { Hint } from '../Hint';
import type { PhotoTheme, ForeignLanguage, MiniGameQuality } from '../../types/game';

interface DuplicateDoomProps {
  photoTheme: PhotoTheme;
  difficulty: string;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality) => void;
  onCancel: () => void;
}

const completionQuotes: Record<string, string> = {
  dad: 'Dad: "You didn\'t delete the lucky scorecard, did you?"',
  mum: 'Mum: "You didn\'t delete the pretty ones, did you?"',
  grandma: 'Grandma: "The cat is still there, yes? Good."',
};

// Difficulty-based photo counts: [keep, total]
const photoCounts: Record<string, { keep: number; total: number }> = {
  dad: { keep: 5, total: 15 },
  mum: { keep: 3, total: 17 },
  grandma: { keep: 2, total: 20 },
};

interface Photo {
  id: number;
  label: string;
  icon: string;
  isDuplicate: boolean;
  isBlurry: boolean;
}

// Extra labels to fill up to the total count
const extraLabels = [
  'IMG_0412', 'IMG_0413', 'Screenshot', 'Camera Roll',
  'Photo', 'IMG_0415', 'IMG_0416', 'Screenshot 2',
  'Photo 2', 'IMG_0418', 'IMG_0419', 'Screenshot 3',
  'Photo 3', 'IMG_0421', 'IMG_0422', 'Screenshot 4',
  'Photo 4', 'IMG_0424', 'IMG_0425', 'Screenshot 5',
];

// Photo background palettes per theme — gives each thumbnail a unique tint
const photoGradients: Record<string, string[]> = {
  golf: [
    'from-emerald-900 to-green-800', 'from-lime-900 to-emerald-800', 'from-green-950 to-teal-800',
    'from-emerald-950 to-green-900', 'from-teal-900 to-emerald-800', 'from-green-900 to-lime-800',
  ],
  sunset: [
    'from-orange-900 to-rose-800', 'from-amber-900 to-orange-800', 'from-rose-900 to-pink-800',
    'from-orange-950 to-red-800', 'from-pink-900 to-rose-800', 'from-red-900 to-amber-800',
  ],
  cat: [
    'from-purple-900 to-violet-800', 'from-indigo-900 to-purple-800', 'from-violet-950 to-fuchsia-800',
    'from-purple-950 to-indigo-800', 'from-fuchsia-900 to-purple-800', 'from-indigo-950 to-violet-800',
  ],
};

function getPhotoGradient(icon: string, id: number): string {
  const palette = photoGradients[icon] ?? photoGradients.sunset;
  return palette[id % palette.length];
}

function buildPhotos(theme: PhotoTheme, keep: number, total: number): Photo[] {
  const duplicates = total - keep;
  const photos: Photo[] = [];

  // Important photos (to keep)
  photos.push({ id: 1, label: theme.importantLabel, icon: theme.importantIcon, isDuplicate: false, isBlurry: false });
  for (let i = 1; i < keep; i++) {
    photos.push({
      id: i + 1,
      label: `Keep ${i}`,
      icon: theme.importantIcon,
      isDuplicate: false,
      isBlurry: false,
    });
  }

  // Duplicates (to delete)
  for (let i = 0; i < duplicates; i++) {
    photos.push({
      id: keep + 1 + i,
      label: i < theme.decoyLabels.length ? theme.decoyLabels[i] : extraLabels[i % extraLabels.length],
      icon: theme.decoyIcon,
      isDuplicate: true,
      isBlurry: i % 3 === 0,
    });
  }

  // Shuffle using seeded RNG
  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(RngEngine.random() * (i + 1));
    [photos[i], photos[j]] = [photos[j], photos[i]];
  }

  return photos;
}

export function DuplicateDoom({ photoTheme, difficulty, foreignLanguage, onComplete, onCancel }: DuplicateDoomProps) {
  const counts = photoCounts[difficulty] ?? photoCounts.dad;
  const [photos] = useState(() => buildPhotos(photoTheme, counts.keep, counts.total));
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleted, setDeleted] = useState<Set<number>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [wrongPick, setWrongPick] = useState(false);
  const importantSelectedRef = useRef(false);

  const remainingPhotos = photos.filter((p) => !deleted.has(p.id));
  const duplicatesRemaining = remainingPhotos.filter((p) => p.isDuplicate).length;

  const toggleSelect = useCallback((id: number) => {
    const photo = photos.find((p) => p.id === id);
    if (photo && !photo.isDuplicate) {
      importantSelectedRef.current = true;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, [photos]);

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
          {completionQuotes[difficulty] ?? completionQuotes.dad}
        </p>
        <button
          onClick={() => { playSound('success'); onComplete({ importantSelected: importantSelectedRef.current }); }}
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
                className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-accent-red ring-2 ring-accent-red/50 scale-95'
                    : 'border-transparent'
                } bg-gradient-to-br ${getPhotoGradient(photo.icon, photo.id)} ${photo.isBlurry ? 'blur-[1px]' : ''}`}
              >
                <Icon name={photo.icon} size={32} className={photo.isBlurry ? 'opacity-40' : 'opacity-80'} />
                <span className="text-[7px] text-white/60 mt-1 px-1 truncate w-full text-center font-medium">{photo.label}</span>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-accent-red rounded-full flex items-center justify-center">
                    <Icon name="check" size={12} className="text-white" />
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
          <div className="bg-secondary rounded-xl p-6 max-w-xs w-full mx-4 animate-slam-in border border-theme">
            <p className="text-center font-bold text-primary mb-2">
              {wrongPick ? photoTheme.confirmPrompt : 'Delete selected photos?'}
            </p>
            {wrongPick && (
              <p className="text-center text-xs text-accent-red mb-3">
                That one isn't a duplicate! Deselect it.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setWrongPick(false);
                }}
                className="flex-1 py-2 bg-tertiary text-primary font-medium rounded-lg"
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
                  className="flex-1 py-2 bg-accent-red text-white font-medium rounded-lg"
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
