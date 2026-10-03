// AftermathMessage — A fake iMessage from the parent, shown after the run.
// Deterministic via RngEngine (same seed = same message).

import { RngEngine } from '../engine/seeded-rng';
import type { Difficulty } from '../types/game';

type Outcome = 'win' | 'timeout' | 'battery';

interface MessageDef {
  text: string;
  emoji: string;
}

const MESSAGES: Record<Outcome, Record<Difficulty, MessageDef[]>> = {
  win: {
    dad: [
      { text: 'Thanks. Oh while you\'re at it, can you also defrag the C drive? It\'s a Mac. It doesn\'t have a C drive. Do it anyway.', emoji: '⛳' },
      { text: 'You did good. I\'m telling the golf group you fixed my phone in under two minutes. They won\'t believe me.', emoji: '🏌️' },
      { text: 'Thanks son. *opens 12 new tabs* Actually, while you\'re here, the RAM Booster wants an update.', emoji: '📡' },
    ],
    mum: [
      { text: 'You did so well! I\'ve already told Linda. Oh, can you video call me so I can show her? She\'s got 3 friends on the line.', emoji: '📱' },
      { text: 'Thank you! I\'m putting this in the family group chat. "My kid fixed my phone in 2 minutes!" — Mum, 47 seconds ago.', emoji: '📸' },
      { text: 'You\'re a star! Oh, while you\'re at it, can you also organise my photos? There are 4,000. They\'re all important.', emoji: '🌹' },
    ],
    grandma: [
      { text: 'You look thin. Have you been eating? Also, while you\'re here, the microwave is doing a thing. It beeps at me. Judgingly.', emoji: '🍵' },
      { text: 'Very good! I\'m making you a sandwich. You don\'t want a sandwich. I\'m making it anyway. It\'s ham. You hate ham.', emoji: '🥪' },
      { text: 'Thank you dear. I\'ve already told the neighbour. She\'s coming over to see you fix the TV. The TV is fine. She\'s coming anyway.', emoji: '👵' },
    ],
  },
  timeout: {
    dad: [
      { text: 'I\'ll just do it myself. *RAM Booster installs 3 more programs* It\'s fine. It\'s handling it.', emoji: '⛳' },
      { text: 'No worries, I\'ll watch a YouTube tutorial. *opens 14 tabs* The comments section will help. They always help.', emoji: '📡' },
      { text: 'It\'s fine. I\'ll leave it. The phone will fix itself. This is what I tell everyone. It works sometimes.', emoji: '🏌️' },
    ],
    mum: [
      { text: 'It\'s fine, I\'ll figure it out. *sends "urgent" voice note to 3 friends asking for help* It\'s not urgent. It\'s very urgent.', emoji: '📱' },
      { text: 'Don\'t worry, I\'ll just Google it. *searches "how to not have a phone"* The first result is an ad for a new phone.', emoji: '🔍' },
      { text: 'I\'ll manage. I\'ve been managing since 1997. The phone is a metaphor for my life. We\'re both struggling.', emoji: '🌹' },
    ],
    grandma: [
      { text: 'Don\'t worry dear, I asked the neighbour\'s son. He\'s even less helpful. He said "have you tried turning it off and on again." In a text.', emoji: '👵' },
      { text: 'I\'ll just press the buttons until something happens. This has worked before. Or it has led to consequences. Both are outcomes.', emoji: '🍵' },
      { text: 'No bother, love. I\'ve put a sticky note on it that says "DON\'T TOUCH." That\'s the fix. That\'s always the fix.', emoji: '📝' },
    ],
  },
  battery: {
    dad: [
      { text: 'I\'ll charge it at the club. The golf cart has a USB port. It doesn\'t. I\'ll check Thursday.', emoji: '⛳' },
      { text: 'It\'s fine, it\'s in power-saving mode. It\'s not in power-saving mode. It\'s dead. I\'ll pretend it\'s a feature.', emoji: '🏌️' },
      { text: 'I\'ll just hold the power button for a long time. This is what the internet said. The internet also said the RAM Booster was a good idea.', emoji: '📡' },
    ],
    mum: [
      { text: 'I\'ll just use it until it dies. Again. This is fine. The phone is building character. Like a good leather bag.', emoji: '📱' },
      { text: 'It\'s probably a software issue. The battery is fine. I\'ll put it on the charger. *puts it next to the charger* That\'s close enough.', emoji: '🔌' },
      { text: 'I\'m not worried. I\'ve got three dead phones in the drawer. They\'re a collection. I\'ll call it "The Struggle." Art.', emoji: '🌹' },
    ],
    grandma: [
      { text: 'I\'ll plug it in. *plugs in the lamp* There. See? The light is on. The phone will get the message.', emoji: '💡' },
      { text: 'It\'s resting. Phones need to rest. I\'m putting it in the cushion. It\'s warm in there. Like a little phone baby.', emoji: '🛋️' },
      { text: 'No worries, I\'ve written "CHARGE ME" on a sticky note and put it on the phone. It\'s very clear. The phone just needs to read it.', emoji: '📝' },
    ],
  },
};

interface AftermathMessageProps {
  difficulty: Difficulty;
  outcome: Outcome;
}

export function getAftermathMessage(difficulty: Difficulty, outcome: Outcome): MessageDef {
  const pool = MESSAGES[outcome][difficulty];
  const idx = Math.floor(RngEngine.random() * pool.length);
  return pool[idx];
}

export function AftermathMessage({ difficulty, outcome }: AftermathMessageProps) {
  const msg = getAftermathMessage(difficulty, outcome);
  const name = difficulty === 'dad' ? 'Dad' : difficulty === 'mum' ? 'Mum' : 'Grandma';

  return (
    <div className="mt-4 animate-slide-up">
      <p className="text-xs text-muted mb-2">📱 New message:</p>
      <div className="bg-tertiary rounded-2xl rounded-tr-sm p-3 max-w-[280px]">
        <p className="text-xs font-medium text-muted mb-1">{name}</p>
        <p className="text-sm text-primary leading-relaxed">
          {msg.emoji} {msg.text}
        </p>
      </div>
    </div>
  );
}
