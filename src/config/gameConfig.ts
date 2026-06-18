import type { GameConfig } from '../types/game'

export const gameConfig: GameConfig = {
  title: '恋爱物语',
  initialResources: 100,
  maxActionsPerDay: 3,
  daysPerWeek: 7,
  maxAffinity: 100,
  minAffinity: -50,
  maxMood: 100,
  minMood: 0,
  moodDecayPerDay: 5,
  affinityDecayPerDay: 1,
  timeSlots: ['morning', 'afternoon', 'evening', 'night'],

  characters: [
    {
      id: 'linxiaoyu',
      name: '林小雨',
      avatar: '🌸',
      description: '温柔善良的图书馆管理员，喜欢读书和花草',
      personality: '温柔内向，有些害羞，但对喜欢的事物非常热情',
      favoriteGifts: ['flower', 'book', 'tea'],
      dislikedGifts: ['alcohol', 'game_console'],
      chatTopics: [
        { topic: '文学', affinity: 3 },
        { topic: '花草', affinity: 3 },
        { topic: '天气', affinity: 1 },
        { topic: '游戏', affinity: -1 },
        { topic: '运动', affinity: 0 }
      ],
      baseAffinity: 10,
      baseMood: 60,
      unlocked: true
    },
    {
      id: 'sufei',
      name: '苏菲',
      avatar: '🔥',
      description: '活泼开朗的咖啡馆女老板，热爱烘焙',
      personality: '热情外向，有点毒舌但内心温柔',
      favoriteGifts: ['coffee', 'dessert', 'game_console'],
      dislikedGifts: ['flower', 'book'],
      chatTopics: [
        { topic: '美食', affinity: 3 },
        { topic: '游戏', affinity: 3 },
        { topic: '天气', affinity: 1 },
        { topic: '文学', affinity: -1 },
        { topic: '运动', affinity: 2 }
      ],
      baseAffinity: 5,
      baseMood: 70,
      unlocked: true
    },
    {
      id: 'yeqing',
      name: '叶青',
      avatar: '🌙',
      description: '神秘的转学生，总是独来独往',
      personality: '冷静寡言，似乎藏着很多秘密',
      favoriteGifts: ['book', 'tea', 'music_box'],
      dislikedGifts: ['dessert', 'alcohol'],
      chatTopics: [
        { topic: '文学', affinity: 2 },
        { topic: '音乐', affinity: 3 },
        { topic: '天气', affinity: 0 },
        { topic: '游戏', affinity: 1 },
        { topic: '运动', affinity: -1 }
      ],
      baseAffinity: 0,
      baseMood: 50,
      unlocked: false,
      hidden: true,
      unlockCondition: 'unlock_yeqing'
    }
  ],

  gifts: [
    { id: 'flower', name: '鲜花', price: 30, icon: '🌹', description: '一束美丽的鲜花' },
    { id: 'book', name: '小说', price: 25, icon: '📚', description: '一本畅销小说' },
    { id: 'tea', name: '茶叶', price: 40, icon: '🍵', description: '上等的茶叶礼盒' },
    { id: 'coffee', name: '咖啡豆', price: 35, icon: '☕', description: '精品咖啡豆' },
    { id: 'dessert', name: '甜点', price: 20, icon: '🍰', description: '精致的手工甜点' },
    { id: 'game_console', name: '游戏机', price: 80, icon: '🎮', description: '最新款掌上游戏机' },
    { id: 'alcohol', name: '红酒', price: 60, icon: '🍷', description: '一瓶高档红酒' },
    { id: 'music_box', name: '音乐盒', price: 50, icon: '🎵', description: '精致的八音盒' }
  ],

  cards: [
    { id: 'linxiaoyu_common_1', name: '图书馆的邂逅', characterId: 'linxiaoyu', rarity: 'common', image: '📖', description: '第一次在图书馆见到小雨的场景', unlockCondition: 'meet_linxiaoyu' },
    { id: 'linxiaoyu_rare_1', name: '花田中', characterId: 'linxiaoyu', rarity: 'rare', image: '🌻', description: '小雨在花田中微笑的样子', unlockCondition: 'linxiaoyu_affinity_40' },
    { id: 'linxiaoyu_epic_1', name: '雨中伞', characterId: 'linxiaoyu', rarity: 'epic', image: '☂️', description: '一起在雨中撑伞回家', unlockCondition: 'linxiaoyu_affinity_70' },
    { id: 'linxiaoyu_legendary_1', name: '告白', characterId: 'linxiaoyu', rarity: 'legendary', image: '💝', description: '樱花树下的告白', unlockCondition: 'linxiaoyu_affinity_100' },
    { id: 'sufei_common_1', name: '咖啡馆的相遇', characterId: 'sufei', rarity: 'common', image: '☕', description: '第一次走进苏菲的咖啡馆', unlockCondition: 'meet_sufei' },
    { id: 'sufei_rare_1', name: '烘焙时光', characterId: 'sufei', rarity: 'rare', image: '🧁', description: '苏菲教你做蛋糕', unlockCondition: 'sufei_affinity_40' },
    { id: 'sufei_epic_1', name: '深夜游戏', characterId: 'sufei', rarity: 'epic', image: '🎮', description: '一起打游戏到深夜', unlockCondition: 'sufei_affinity_70' },
    { id: 'sufei_legendary_1', name: '夕阳下的吻', characterId: 'sufei', rarity: 'legendary', image: '🌅', description: '咖啡馆关门前的浪漫时刻', unlockCondition: 'sufei_affinity_100' },
    { id: 'yeqing_common_1', name: '月下身影', characterId: 'yeqing', rarity: 'common', image: '🌙', description: '月光下独自散步的叶青', unlockCondition: 'meet_yeqing' },
    { id: 'yeqing_rare_1', name: '琴音缭绕', characterId: 'yeqing', rarity: 'rare', image: '🎹', description: '叶青弹奏钢琴的样子', unlockCondition: 'yeqing_affinity_40' }
  ],

  events: [
    {
      id: 'intro_linxiaoyu',
      title: '图书馆的邂逅',
      description: '你在图书馆寻找一本书时，一位温柔的女生帮你找到了它。她叫林小雨，是这里的管理员。',
      characterId: 'linxiaoyu',
      triggerCondition: { minDay: 1, maxDay: 1, timeOfDay: 'morning' },
      choices: [
        {
          id: 'thankful',
          text: '道谢并和她聊聊天',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 5, moodChange: 10 }],
          addCardId: 'linxiaoyu_common_1'
        },
        {
          id: 'hurry',
          text: '道谢后匆匆离开',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 2 }]
        }
      ],
      once: true,
      priority: 100
    },
    {
      id: 'intro_sufei',
      title: '咖啡馆的偶遇',
      description: '你走进一家新开的咖啡馆，热情的女老板苏菲立刻迎了上来。"欢迎光临！今天想来点什么？"',
      characterId: 'sufei',
      triggerCondition: { minDay: 1, maxDay: 2, timeOfDay: 'afternoon' },
      choices: [
        {
          id: 'coffee',
          text: '点一杯招牌咖啡',
          effects: [{ characterId: 'sufei', affinityChange: 5, moodChange: 10 }],
          resourceChange: -10,
          addCardId: 'sufei_common_1'
        },
        {
          id: 'dessert',
          text: '点一份甜点尝尝',
          effects: [{ characterId: 'sufei', affinityChange: 7, moodChange: 15 }],
          resourceChange: -20
        }
      ],
      once: true,
      priority: 99
    },
    {
      id: 'rainy_day_1',
      title: '突如其来的暴雨',
      description: '天空突然下起了大雨，你看到林小雨站在屋檐下，似乎没带伞。',
      characterId: 'linxiaoyu',
      triggerCondition: { minDay: 3, timeOfDay: 'evening', minAffinity: 20, characterId: 'linxiaoyu' },
      choices: [
        {
          id: 'share_umbrella',
          text: '把伞借给她',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 15, moodChange: 20 }]
        },
        {
          id: 'wait_together',
          text: '陪她等雨停',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 10, moodChange: 10 }]
        },
        {
          id: 'leave',
          text: '假装没看到走开',
          effects: [{ characterId: 'linxiaoyu', affinityChange: -5, moodChange: -10 }]
        }
      ],
      once: true,
      priority: 90
    },
    {
      id: 'cafe_late_night',
      title: '深夜咖啡馆',
      description: '你路过咖啡馆，发现灯还亮着。苏菲一个人在店里，看起来有些疲惫。',
      characterId: 'sufei',
      triggerCondition: { minDay: 5, timeOfDay: 'night', minAffinity: 30, characterId: 'sufei' },
      choices: [
        {
          id: 'help',
          text: '进去帮帮忙',
          effects: [{ characterId: 'sufei', affinityChange: 12, moodChange: 15 }],
          resourceChange: -5
        },
        {
          id: 'company',
          text: '点杯咖啡陪陪她',
          effects: [{ characterId: 'sufei', affinityChange: 8, moodChange: 10 }],
          resourceChange: -15
        },
        {
          id: 'ignore',
          text: '不打扰她了',
          effects: [{ characterId: 'sufei', affinityChange: -3 }]
        }
      ],
      once: true,
      priority: 85
    },
    {
      id: 'mysterious_girl',
      title: '神秘的转学生',
      description: '在公园的角落里，你看到一个安静的女生独自坐在长椅上。她似乎注意到了你，微微点了点头。',
      characterId: 'yeqing',
      triggerCondition: { minDay: 7, minAffinity: 40 },
      choices: [
        {
          id: 'approach',
          text: '上前打招呼',
          effects: [
            { characterId: 'yeqing', affinityChange: 5 },
            { characterId: 'linxiaoyu', affinityChange: -3 },
            { characterId: 'sufei', affinityChange: -3 }
          ],
          unlockCharacterId: 'yeqing',
          addCardId: 'yeqing_common_1'
        },
        {
          id: 'leave_quietly',
          text: '悄悄离开',
          effects: []
        }
      ],
      once: true,
      priority: 80
    },
    {
      id: 'birthday_surprise_1',
      title: '小雨的生日',
      description: '你想起今天是林小雨的生日，要准备什么惊喜吗？',
      characterId: 'linxiaoyu',
      triggerCondition: { minDay: 14, minAffinity: 50, characterId: 'linxiaoyu' },
      choices: [
        {
          id: 'big_surprise',
          text: '准备一个大惊喜',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 25, moodChange: 30 }],
          resourceChange: -50
        },
        {
          id: 'small_gift',
          text: '送一个小礼物',
          effects: [{ characterId: 'linxiaoyu', affinityChange: 10, moodChange: 15 }],
          resourceChange: -20
        },
        {
          id: 'forget',
          text: '算了，假装不知道',
          effects: [{ characterId: 'linxiaoyu', affinityChange: -10, moodChange: -20 }]
        }
      ],
      once: true,
      priority: 95
    },
    {
      id: 'conflict_1',
      title: '两人的邀约',
      description: '林小雨和苏菲同时邀请你周末出去，你该怎么办？',
      triggerCondition: { minDay: 10, minAffinity: 35 },
      choices: [
        {
          id: 'choose_xiaoyu',
          text: '答应小雨',
          effects: [
            { characterId: 'linxiaoyu', affinityChange: 10, moodChange: 15 },
            { characterId: 'sufei', affinityChange: -8, moodChange: -10 }
          ]
        },
        {
          id: 'choose_sufei',
          text: '答应苏菲',
          effects: [
            { characterId: 'sufei', affinityChange: 10, moodChange: 15 },
            { characterId: 'linxiaoyu', affinityChange: -8, moodChange: -10 }
          ]
        },
        {
          id: 'reject_both',
          text: '都拒绝，说有事',
          effects: [
            { characterId: 'linxiaoyu', affinityChange: -3 },
            { characterId: 'sufei', affinityChange: -3 }
          ]
        },
        {
          id: 'suggest_together',
          text: '建议三个人一起',
          effects: [
            { characterId: 'linxiaoyu', affinityChange: -2 },
            { characterId: 'sufei', affinityChange: -2 }
          ]
        }
      ],
      once: true,
      priority: 88
    }
  ],

  actions: [
    { type: 'chat', name: '聊天', icon: '💬', description: '和角色聊聊天，增进感情', energyCost: 1 },
    { type: 'gift', name: '送礼', icon: '🎁', description: '送礼物给角色，效果因人而异', energyCost: 1 },
    { type: 'work', name: '打工', icon: '💼', description: '辛苦工作赚取代币', energyCost: 2 }
  ],

  workRewards: { min: 15, max: 35 },

  relationshipGraph: {
    affinityStages: [
      {
        name: '陌生',
        minAffinity: -50,
        maxAffinity: -1,
        description: '关系紧张，需要付出更多努力才能改善',
        icon: '💔',
        color: '#64748b',
        privileges: ['可以进行基本互动']
      },
      {
        name: '相识',
        minAffinity: 0,
        maxAffinity: 19,
        description: '刚刚认识，还需要更多了解',
        icon: '👋',
        color: '#94a3b8',
        privileges: ['可以聊天', '可以送礼']
      },
      {
        name: '朋友',
        minAffinity: 20,
        maxAffinity: 39,
        description: '成为了普通朋友，开始有默契',
        icon: '🤝',
        color: '#fbbf24',
        privileges: ['解锁稀有卡牌机会', '聊天加成提升']
      },
      {
        name: '好友',
        minAffinity: 40,
        maxAffinity: 59,
        description: '关系亲密的好朋友，彼此信任',
        icon: '💕',
        color: '#fb923c',
        privileges: ['解锁稀有卡牌', '解锁专属剧情事件', '送礼加成提升']
      },
      {
        name: '亲密',
        minAffinity: 60,
        maxAffinity: 79,
        description: '超越普通朋友的暧昧关系',
        icon: '💗',
        color: '#f472b6',
        privileges: ['解锁史诗卡牌', '解锁浪漫事件', '特殊互动选项']
      },
      {
        name: '恋人',
        minAffinity: 80,
        maxAffinity: 100,
        description: '心心相印的恋人关系',
        icon: '💝',
        color: '#ec4899',
        privileges: ['解锁传说卡牌', '解锁告白结局', '全部特权']
      }
    ],

    relationships: [
      {
        characterId1: 'linxiaoyu',
        characterId2: 'sufei',
        type: 'rival',
        label: '情敌',
        description: '两人都对你有好感，选择其中一人会让另一人失落',
        conflictEvents: ['conflict_1']
      },
      {
        characterId1: 'linxiaoyu',
        characterId2: 'yeqing',
        type: 'stranger',
        label: '陌生人',
        description: '小雨对神秘的叶青感到好奇，但还不熟悉'
      },
      {
        characterId1: 'sufei',
        characterId2: 'yeqing',
        type: 'stranger',
        label: '陌生人',
        description: '苏菲觉得叶青有些奇怪，但没什么交集'
      }
    ],

    conflicts: [
      {
        eventId: 'conflict_1',
        title: '两人的邀约',
        affectedCharacters: ['linxiaoyu', 'sufei'],
        maxAffinityPenalty: 8,
        maxMoodPenalty: 10,
        resolutionHint: '事后通过送礼或聊天安抚被拒绝的一方可以弥补关系'
      },
      {
        eventId: 'mysterious_girl',
        title: '神秘的转学生',
        affectedCharacters: ['linxiaoyu', 'sufei', 'yeqing'],
        maxAffinityPenalty: 3,
        maxMoodPenalty: 0,
        resolutionHint: '主动和叶青搭话会引起其他两人的轻微嫉妒'
      },
      {
        eventId: 'rainy_day_1',
        title: '突如其来的暴雨',
        affectedCharacters: ['linxiaoyu'],
        maxAffinityPenalty: 5,
        maxMoodPenalty: 10,
        resolutionHint: '不要假装没看到，哪怕只是陪她等雨停也好'
      },
      {
        eventId: 'cafe_late_night',
        title: '深夜咖啡馆',
        affectedCharacters: ['sufei'],
        maxAffinityPenalty: 3,
        maxMoodPenalty: 0,
        resolutionHint: '疲惫时的陪伴最让人暖心'
      },
      {
        eventId: 'birthday_surprise_1',
        title: '小雨的生日',
        affectedCharacters: ['linxiaoyu'],
        maxAffinityPenalty: 10,
        maxMoodPenalty: 20,
        resolutionHint: '生日是最重要的日子，绝对不要忘记！'
      }
    ],

    storyUnlocks: [
      {
        id: 'unlock_linxiaoyu_affinity_20',
        title: '友谊的开始',
        description: '与林小雨成为朋友，解锁更多互动话题',
        type: 'affinity',
        targetCharacterId: 'linxiaoyu',
        requiredAffinity: 20,
        reward: '解锁「花田中」稀有卡牌前置条件',
        unlocked: false
      },
      {
        id: 'unlock_linxiaoyu_affinity_40',
        title: '雨中的羁绊',
        description: '与林小雨好感度达到40，触发雨中撑伞事件',
        type: 'affinity',
        targetCharacterId: 'linxiaoyu',
        requiredAffinity: 40,
        reward: '获得「花田中」稀有卡牌 🌻',
        unlocked: false
      },
      {
        id: 'unlock_linxiaoyu_affinity_70',
        title: '心动瞬间',
        description: '与林小雨好感度达到70，进入亲密阶段',
        type: 'affinity',
        targetCharacterId: 'linxiaoyu',
        requiredAffinity: 70,
        reward: '获得「雨中伞」史诗卡牌 ☂️',
        unlocked: false
      },
      {
        id: 'unlock_linxiaoyu_affinity_100',
        title: '樱花树下的告白',
        description: '与林小雨好感度达到满值，解锁完美结局',
        type: 'affinity',
        targetCharacterId: 'linxiaoyu',
        requiredAffinity: 100,
        reward: '获得「告白」传说卡牌 💝 + 小雨结局',
        unlocked: false
      },
      {
        id: 'unlock_sufei_affinity_20',
        title: '熟客待遇',
        description: '与苏菲成为朋友，咖啡馆有专属座位',
        type: 'affinity',
        targetCharacterId: 'sufei',
        requiredAffinity: 20,
        reward: '解锁「烘焙时光」稀有卡牌前置条件',
        unlocked: false
      },
      {
        id: 'unlock_sufei_affinity_40',
        title: '甜蜜烘焙',
        description: '与苏菲好感度达到40，解锁烘焙教学事件',
        type: 'affinity',
        targetCharacterId: 'sufei',
        requiredAffinity: 40,
        reward: '获得「烘焙时光」稀有卡牌 🧁',
        unlocked: false
      },
      {
        id: 'unlock_sufei_affinity_70',
        title: '深夜玩伴',
        description: '与苏菲好感度达到70，进入亲密阶段',
        type: 'affinity',
        targetCharacterId: 'sufei',
        requiredAffinity: 70,
        reward: '获得「深夜游戏」史诗卡牌 🎮',
        unlocked: false
      },
      {
        id: 'unlock_sufei_affinity_100',
        title: '夕阳下的吻',
        description: '与苏菲好感度达到满值，解锁完美结局',
        type: 'affinity',
        targetCharacterId: 'sufei',
        requiredAffinity: 100,
        reward: '获得「夕阳下的吻」传说卡牌 🌅 + 苏菲结局',
        unlocked: false
      },
      {
        id: 'unlock_yeqing',
        title: '月下邂逅',
        description: '与至少一位角色好感度达到40后，在第7天解锁神秘角色叶青',
        type: 'multi',
        requiredConditions: [
          { type: 'day', value: 7 },
          { type: 'affinity', characterId: 'linxiaoyu', value: 40 }
        ],
        reward: '解锁隐藏角色「叶青」🌙',
        unlocked: false
      },
      {
        id: 'unlock_yeqing_affinity_40',
        title: '琴音缭绕',
        description: '与叶青好感度达到40，解锁钢琴演奏剧情',
        type: 'affinity',
        targetCharacterId: 'yeqing',
        requiredAffinity: 40,
        reward: '获得「琴音缭绕」稀有卡牌 🎹',
        unlocked: false
      },
      {
        id: 'trigger_event_intro_linxiaoyu',
        title: '图书馆的邂逅',
        description: '在第1天早晨自动触发与林小雨的初遇',
        type: 'event',
        requiredEventId: 'intro_linxiaoyu',
        reward: '获得「图书馆的邂逅」普通卡牌 📖',
        unlocked: false
      },
      {
        id: 'trigger_event_intro_sufei',
        title: '咖啡馆的相遇',
        description: '在第1-2天下午触发与苏菲的初遇',
        type: 'event',
        requiredEventId: 'intro_sufei',
        reward: '获得「咖啡馆的相遇」普通卡牌 ☕',
        unlocked: false
      },
      {
        id: 'trigger_event_birthday',
        title: '小雨的生日惊喜',
        description: '第14天好感度达标后触发生日事件',
        type: 'multi',
        requiredConditions: [
          { type: 'day', value: 14 },
          { type: 'affinity', characterId: 'linxiaoyu', value: 50 }
        ],
        reward: '生日当天好感度大幅提升机会',
        unlocked: false
      }
    ]
  }
}

export default gameConfig
