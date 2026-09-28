import { LevelConfig } from '../types/game';

export const levels: Record<string, LevelConfig> = {
  dad: {
    difficulty: 'dad',
    name: 'Dad',
    description: 'Logical but specific errors. RAM Boosters and misplaced widgets.',
    durationSeconds: 60,
    initialBattery: 50,
    initialIssues: [
      { id: 'dad-ram-booster', type: 'antivirus-whack-a-mole', isResolved: false, drainPenalty: 0.5 },
      { id: 'dad-weather-widget', type: 'infinite-tab-sweep', isResolved: false, drainPenalty: 0.3 },
    ],
    parentPrompts: [
      {
        id: 'dad-q1',
        difficulty: 'dad',
        type: 'direct-question',
        question: "Mate, is it true that if I clear my cache, I lose all my bookmarks?",
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
      {
        id: 'dad-q3',
        difficulty: 'dad',
        type: 'direct-question',
        question: "This RAM Booster is telling me I need to pay $9.99. Is that normal? It looks official.",
        options: [
          { label: 'That\'s a scam. Uninstall it now.', timeCost: 3, batteryEffect: -2 },
          { label: 'Yeah, probably needs it', timeCost: 0, batteryEffect: -8 },
        ],
      },
      {
        id: 'dad-q4',
        difficulty: 'dad',
        type: 'direct-question',
        question: "I put the charger in the fridge. Will that charge it faster?",
        options: [
          { label: 'NO! Take it out immediately!', timeCost: 1, batteryEffect: 0 },
          { label: 'I\'ll come check it out', timeCost: 5, batteryEffect: -3 },
        ],
      },
      {
        id: 'dad-q5',
        difficulty: 'dad',
        type: 'direct-question',
        question: "Mate, why is my weather widget so big? I can't see the golf scores.",
        options: [
          { label: 'Drag it to the edge of the screen', timeCost: 3, batteryEffect: -1 },
          { label: 'Just close the weather app', timeCost: 1, batteryEffect: -3 },
        ],
      },
      {
        id: 'dad-q6',
        difficulty: 'dad',
        type: 'direct-question',
        question: "Is it true that if I buy more RAM, my phone gets faster?",
        options: [
          { label: 'No, your phone has built-in RAM', timeCost: 5, batteryEffect: 0 },
          { label: 'Yeah, buy the 1TB one', timeCost: 0, batteryEffect: -8 },
        ],
      },
      {
        id: 'dad-q7',
        difficulty: 'dad',
        type: 'direct-question',
        question: "I accidentally pressed 'Update Now'. Will that delete my golf forum?",
        options: [
          { label: 'No, updates just add features', timeCost: 4, batteryEffect: 0 },
          { label: 'Let me check', timeCost: 3, batteryEffect: -2 },
        ],
      },
      {
        id: 'dad-q8',
        difficulty: 'dad',
        type: 'guilt-trip',
        question: "Back in my day we didn't need all these widgets. But this weather one's useful.",
        options: [],
      },
    ],
    interruptionRate: 15,
    passiveDrain: { intervalSeconds: 12, chance: 0.5, amount: 1 },
    photoTheme: {
      importantLabel: 'Scorecard (sharp)',
      importantIcon: 'golf',
      decoyLabels: ['Golf mag p.1', 'Golf mag p.2', 'Golf mag p.3', 'Golf mag p.4', 'Golf mag p.5', 'Golf mag p.6', 'Golf mag p.7', 'Golf mag p.8'],
      decoyIcons: ['golf', 'golf', 'golf', 'golf', 'golf', 'golf', 'golf', 'golf'],
      confirmPrompt: 'Are you sure? Dad thinks that one is his lucky scorecard.',
    },
    malwareConfig: {
      name: 'RAM Booster Pro 2026',
      scanMessage: 'Your RAM is 99% full! Click to optimize!',
      decoyAppLabel: 'Golf Score',
      decoyAppIcon: 'golf',
    },
    quickSettingsConfig: {
      flashlightPage: 0,
      pages: [
        [
          { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', isOn: true },
          { id: 'bluetooth', label: 'Bluetooth', icon: 'bluetooth', isOn: true },
          { id: 'dnd', label: 'Do Not Disturb', icon: 'bell', isOn: false },
          { id: 'flashlight', label: 'Flashlight', icon: 'flashlight', isOn: true },
        ],
      ],
    },
  },
  mum: {
    difficulty: 'mum',
    name: 'Mum',
    description: 'Maxed-out cloud storage, huge text sizes, hidden subscriptions.',
    durationSeconds: 60,
    initialBattery: 40,
    initialIssues: [
      { id: 'mum-storage', type: 'duplicate-doom', isResolved: false, drainPenalty: 0.6 },
      { id: 'mum-text-size', type: 'blind-translation', isResolved: false, drainPenalty: 0.4 },
      { id: 'mum-tabs', type: 'infinite-tab-sweep', isResolved: false, drainPenalty: 0.3 },
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
      {
        id: 'mum-q3',
        difficulty: 'mum',
        type: 'direct-question',
        question: "Why is my phone so slow? I only have 47 photos and 12 apps!",
        options: [
          { label: 'It\'s the cloud backups, not the photos', timeCost: 5, batteryEffect: 0 },
          { label: 'Have you tried turning it off and on?', timeCost: 2, batteryEffect: -3 },
        ],
      },
      {
        id: 'mum-q4',
        difficulty: 'mum',
        type: 'guilt-trip',
        question: "You know, I only got this phone so I could see your photos. And now you're deleting them. After all I've done.",
        options: [],
      },
      {
        id: 'mum-q5',
        difficulty: 'mum',
        type: 'direct-question',
        question: "Darling, can you help me? I accidentally downloaded something called 'WhatsApp'.",
        options: [
          { label: 'It\'s a messaging app, not a virus', timeCost: 4, batteryEffect: 0 },
          { label: 'Just delete it', timeCost: 1, batteryEffect: -2 },
        ],
      },
      {
        id: 'mum-q6',
        difficulty: 'mum',
        type: 'direct-question',
        question: "Is the cloud going to charge me for storing my photos? I thought it was free.",
        options: [
          { label: 'The first 5GB are free', timeCost: 5, batteryEffect: 0 },
          { label: 'Just delete some photos', timeCost: 1, batteryEffect: -1 },
        ],
      },
      {
        id: 'mum-q7',
        difficulty: 'mum',
        type: 'direct-question',
        question: "My friend Linda says if I turn off my phone for an hour, it saves battery. Should I?",
        options: [
          { label: 'No, that\'s not how it works', timeCost: 3, batteryEffect: -2 },
          { label: 'Sure, give it a rest', timeCost: 1, batteryEffect: -5 },
        ],
      },
      {
        id: 'mum-q8',
        difficulty: 'mum',
        type: 'direct-question',
        question: "I sent a photo to Linda but she says she didn't get it. Is it because I pressed 'Forward'?",
        options: [
          { label: 'You need to \'Share\', not \'Forward\'', timeCost: 4, batteryEffect: 0 },
          { label: 'Just resend it', timeCost: 1, batteryEffect: -1 },
        ],
      },
    ],
    interruptionRate: 12,
    passiveDrain: { intervalSeconds: 10, chance: 0.6, amount: 1.5 },
    photoTheme: {
      importantLabel: 'Sunset (sharp)',
      importantIcon: 'sunset',
      decoyLabels: ['Sunset 2', 'Sunset 3', 'Sunset 4', 'Cloud 1', 'Cloud 2', 'Cloud 3', 'Sunset 5', 'Sunset 6', 'Cloud 4', 'Sunset 7', 'Sunset 8', 'Cloud 5'],
      decoyIcons: ['sunset', 'sunset', 'sunset', 'cloud', 'cloud', 'cloud', 'sunset', 'sunset', 'cloud', 'sunset', 'sunset', 'cloud'],
      confirmPrompt: 'Are you sure? Mum thinks that one is pretty.',
    },
    malwareConfig: {
      name: 'Cloud Storage Optimizer',
      scanMessage: 'You\'re using 98% of your cloud! Fix now!',
      decoyAppLabel: 'WhatsApp',
      decoyAppIcon: 'whatsapp',
    },
    quickSettingsConfig: {
      flashlightPage: 1,
      pages: [
        [
          { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', isOn: true },
          { id: 'bluetooth', label: 'Bluetooth', icon: 'bluetooth', isOn: true },
          { id: 'dnd', label: 'Do Not Disturb', icon: 'bell', isOn: false },
          { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', isOn: false },
        ],
        [
          { id: 'location', label: 'Location', icon: 'location', isOn: true },
          { id: 'flashlight', label: 'Flashlight', icon: 'flashlight', isOn: true },
          { id: 'brightness', label: 'Brightness', icon: 'brightness', isOn: false },
          { id: 'rotation', label: 'Rotation', icon: 'rotation', isOn: false },
        ],
      ],
    },
  },
  grandma: {
    difficulty: 'grandma',
    name: 'Grandma',
    description: 'Phone in Chinese, ghost touches from tea spill, mute switch toggled.',
    durationSeconds: 60,
    initialBattery: 100,
    initialIssues: [
      { id: 'grandma-language', type: 'blind-translation', isResolved: false, drainPenalty: 0.8 },
      { id: 'grandma-ghost-touch', type: 'physical-override', isResolved: false, drainPenalty: 0.7 },
      { id: 'grandma-photos', type: 'duplicate-doom', isResolved: false, drainPenalty: 0.5 },
      { id: 'grandma-tabs', type: 'infinite-tab-sweep', isResolved: false, drainPenalty: 0.4 },
      { id: 'grandma-malware', type: 'antivirus-whack-a-mole', isResolved: false, drainPenalty: 0.6 },
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
        type: 'backseat-swiper',
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
      {
        id: 'grandma-q4',
        difficulty: 'grandma',
        type: 'direct-question',
        question: "I think I pressed something. Now everything is in Hindi. Can you speak to it?",
        options: [
          { label: 'I\'ll change the language back', timeCost: 5, batteryEffect: -2 },
          { label: 'Just turn it off and on again', timeCost: 2, batteryEffect: -5 },
        ],
      },
      {
        id: 'grandma-q5',
        difficulty: 'grandma',
        type: 'backseat-swiper',
        question: "Is this the button that makes the tea? It's hot.",
        options: [],
      },
      {
        id: 'grandma-q6',
        difficulty: 'grandma',
        type: 'direct-question',
        question: "The phone is making a noise. Is that my alarm or my blood pressure machine?",
        options: [
          { label: 'That\'s a notification sound', timeCost: 4, batteryEffect: 0 },
          { label: 'Check the volume button', timeCost: 2, batteryEffect: -2 },
        ],
      },
      {
        id: 'grandma-q7',
        difficulty: 'grandma',
        type: 'direct-question',
        question: "I think I need to speak to it louder. Should I shout at the phone?",
        options: [
          { label: 'No, it\'s not a voice assistant', timeCost: 3, batteryEffect: -1 },
          { label: 'Try turning up the volume', timeCost: 2, batteryEffect: -2 },
        ],
      },
      {
        id: 'grandma-q8',
        difficulty: 'grandma',
        type: 'direct-question',
        question: "I pressed the red button. Is that going to call the police?",
        options: [
          { label: 'No, that\'s the end call button', timeCost: 3, batteryEffect: 0 },
          { label: 'Don\'t press red buttons', timeCost: 1, batteryEffect: -3 },
        ],
      },
    ],
    interruptionRate: 8,
    passiveDrain: { intervalSeconds: 7, chance: 0.7, amount: 2 },
    photoTheme: {
      importantLabel: 'Cat portrait (sharp)',
      importantIcon: 'cat',
      decoyLabels: ['Cat blurry 1', 'Cat blurry 2', 'Cat blurry 3', 'Cat overexposed 1', 'Cat overexposed 2', 'Cat blurry 4', 'Cat blurry 5', 'Cat overexposed 3', 'Cat blurry 6', 'Cat overexposed 4', 'Cat blurry 7', 'Cat overexposed 5', 'Cat blurry 8', 'Cat overexposed 6', 'Cat blurry 9'],
      decoyIcons: ['cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat'],
      confirmPrompt: 'Are you sure? Grandma thinks that cat is her grandchild.',
    },
    malwareConfig: {
      name: 'Family Photo Protector',
      scanMessage: 'Your photos are at risk! Scan now!',
      decoyAppLabel: 'Phone Cleaner',
      decoyAppIcon: 'shield',
    },
    quickSettingsConfig: {
      flashlightPage: 2,
      pages: [
        [
          { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', isOn: true },
          { id: 'bluetooth', label: 'Bluetooth', icon: 'bluetooth', isOn: true },
          { id: 'dnd', label: 'Do Not Disturb', icon: 'bell', isOn: false },
          { id: 'nfc', label: 'NFC', icon: 'nfc', isOn: false },
        ],
        [
          { id: 'airplane', label: 'Airplane Mode', icon: 'airplane', isOn: false },
          { id: 'location', label: 'Location', icon: 'location', isOn: true },
          { id: 'brightness', label: 'Brightness', icon: 'brightness', isOn: false },
          { id: 'rotation', label: 'Rotation', icon: 'rotation', isOn: false },
        ],
        [
          { id: 'cleaner', label: 'Phone Cleaner', icon: 'shield', isOn: false },
          { id: 'flashlight', label: 'Flashlight', icon: 'flashlight', isOn: true },
          { id: 'dnd2', label: 'Silent', icon: 'bell', isOn: false },
          { id: 'hotspot', label: 'Hotspot', icon: 'wifi', isOn: false },
        ],
      ],
    },
  },
};
