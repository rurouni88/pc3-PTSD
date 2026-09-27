import { LevelConfig } from '../types/game';

export const levels: Record<string, LevelConfig> = {
  dad: {
    difficulty: 'dad',
    name: 'Dad',
    description: 'Logical but specific errors. RAM Boosters and misplaced widgets.',
    durationSeconds: 120,
    initialIssues: [
      { id: 'dad-ram-booster', type: 'antivirus-whack-a-mole', isResolved: false, drainPenalty: 0.5 },
      { id: 'dad-weather-widget', type: 'infinite-tab-sweep', isResolved: false, drainPenalty: 0.3 },
    ],
    parentPrompts: [
      {
        id: 'dad-q1',
        difficulty: 'dad',
        type: 'direct-question',
        question: "Darling, is it true that if I clear my cache, I lose all my bookmarks?",
        options: [
          { label: 'No, bookmarks are saved separately', timeCost: 5, batteryEffect: 0 },
          { label: 'Just clear it, you\'ll be fine', timeCost: 2, batteryEffect: -5 },
        ],
      },
      {
        id: 'dad-q2',
        difficulty: 'dad',
        type: 'direct-question',
        question: "Don't look at my history, it's just golf stuff. I think a virus opened those other tabs.",
        options: [
          { label: 'I\'ll explain what\'s happening', timeCost: 5, batteryEffect: 0 },
          { label: 'Just nod and fix it', timeCost: 1, batteryEffect: -3 },
        ],
      },
    ],
    interruptionRate: 15,
  },
  mum: {
    difficulty: 'mum',
    name: 'Mum',
    description: 'Maxed-out cloud storage, huge text sizes, hidden subscriptions.',
    durationSeconds: 120,
    initialIssues: [
      { id: 'mum-storage', type: 'duplicate-doom', isResolved: false, drainPenalty: 0.6 },
      { id: 'mum-text-size', type: 'blind-translation', isResolved: false, drainPenalty: 0.4 },
    ],
    parentPrompts: [
      {
        id: 'mum-q1',
        difficulty: 'mum',
        type: 'direct-question',
        question: "An email said if I forward it to all my contacts, I will be sent a free air fryer. Is that true?",
        options: [
          { label: 'No Mum, it\'s a data-harvesting scam...', timeCost: 5, batteryEffect: 0 },
          { label: 'No, they ran out of air fryers', timeCost: 0, batteryEffect: -5 },
        ],
      },
      {
        id: 'mum-q2',
        difficulty: 'mum',
        type: 'direct-question',
        question: "Don't delete the photo of the funny cloud! I need that for my WhatsApp status!",
        options: [
          { label: 'I won\'t delete it, I promise', timeCost: 3, batteryEffect: -2 },
          { label: 'It\'s a duplicate, I need to free space', timeCost: 2, batteryEffect: -3 },
        ],
      },
    ],
    interruptionRate: 12,
  },
  grandma: {
    difficulty: 'grandma',
    name: 'Grandma',
    description: 'Phone in Chinese, ghost touches from tea spill, mute switch toggled.',
    durationSeconds: 120,
    initialIssues: [
      { id: 'grandma-language', type: 'blind-translation', isResolved: false, drainPenalty: 0.8 },
      { id: 'grandma-ghost-touch', type: 'physical-override', isResolved: false, drainPenalty: 0.7 },
    ],
    parentPrompts: [
      {
        id: 'grandma-q1',
        difficulty: 'grandma',
        type: 'direct-question',
        question: "Bluetooth, what does that do?",
        options: [
          { label: 'It connects to wireless devices...', timeCost: 5, batteryEffect: 0 },
          { label: 'Nothing important, don\'t worry', timeCost: 1, batteryEffect: -2 },
        ],
      },
      {
        id: 'grandma-q2',
        difficulty: 'grandma',
        type: 'backback-swiper',
        question: "Oh wait, let me show you this photo of the neighbor's cat first!",
        options: [],
      },
      {
        id: 'grandma-q3',
        difficulty: 'grandma',
        type: 'guilt-trip',
        question: "You know, back in my day, we didn't look at screens all afternoon. We went outside and played.",
        options: [],
      },
    ],
    interruptionRate: 8,
  },
};
