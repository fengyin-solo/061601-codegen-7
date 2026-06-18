import type { TimeOfDay, MoodLevel, GameConfig, CharacterConfig, AffinityStage, StoryUnlockCondition, CharacterState } from '../types/game'

export function getMoodLevel(mood: number): MoodLevel {
  if (mood >= 80) return 'happy'
  if (mood >= 60) return 'good'
  if (mood >= 40) return 'neutral'
  if (mood >= 20) return 'bad'
  return 'angry'
}

export function getMoodColor(mood: number): string {
  const level = getMoodLevel(mood)
  const colors: Record<MoodLevel, string> = {
    happy: '#22c55e',
    good: '#84cc16',
    neutral: '#eab308',
    bad: '#f97316',
    angry: '#ef4444'
  }
  return colors[level]
}

export function getMoodLabel(mood: number): string {
  const level = getMoodLevel(mood)
  const labels: Record<MoodLevel, string> = {
    happy: '开心',
    good: '不错',
    neutral: '一般',
    bad: '低落',
    angry: '生气'
  }
  return labels[level]
}

export function getTimeLabel(time: TimeOfDay): string {
  const labels: Record<TimeOfDay, string> = {
    morning: '早晨',
    afternoon: '下午',
    evening: '傍晚',
    night: '深夜'
  }
  return labels[time]
}

export function getTimeIcon(time: TimeOfDay): string {
  const icons: Record<TimeOfDay, string> = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌆',
    night: '🌙'
  }
  return icons[time]
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getAffinityColor(affinity: number, maxAffinity: number): string {
  const ratio = affinity / maxAffinity
  if (ratio >= 0.8) return '#ec4899'
  if (ratio >= 0.6) return '#f472b6'
  if (ratio >= 0.4) return '#fb923c'
  if (ratio >= 0.2) return '#fbbf24'
  if (ratio >= 0) return '#94a3b8'
  return '#64748b'
}

export function getAffinityStage(affinity: number): string {
  if (affinity >= 80) return '恋人'
  if (affinity >= 60) return '亲密'
  if (affinity >= 40) return '好友'
  if (affinity >= 20) return '朋友'
  if (affinity >= 0) return '相识'
  return '陌生'
}

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#94a3b8',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b'
  }
  return colors[rarity] || '#94a3b8'
}

export function getRarityLabel(rarity: string): string {
  const labels: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return labels[rarity] || '普通'
}

export function getNextTimeSlot(current: TimeOfDay, timeSlots: TimeOfDay[]): TimeOfDay {
  const index = timeSlots.indexOf(current)
  if (index < timeSlots.length - 1) {
    return timeSlots[index + 1]
  }
  return timeSlots[0]
}

export function isGiftLiked(giftId: string, character: CharacterConfig): boolean {
  return character.favoriteGifts.includes(giftId)
}

export function isGiftDisliked(giftId: string, character: CharacterConfig): boolean {
  return character.dislikedGifts.includes(giftId)
}

export function calculateChatAffinity(
  topic: string,
  character: CharacterConfig,
  mood: number,
  timeOfDay: TimeOfDay
): number {
  const topicConfig = character.chatTopics.find(t => t.topic === topic)
  let baseChange = topicConfig ? topicConfig.affinity : 0

  const moodMultiplier = 0.5 + (mood / 100)
  baseChange *= moodMultiplier

  if (timeOfDay === 'night' && character.baseMood < 50) {
    baseChange *= 0.7
  }
  if (timeOfDay === 'morning' && character.baseMood >= 60) {
    baseChange *= 1.2
  }

  return Math.round(baseChange * 10) / 10
}

export function calculateGiftAffinity(
  giftId: string,
  character: CharacterConfig,
  giftPrice: number,
  mood: number
): number {
  let baseChange = giftPrice / 10

  if (isGiftLiked(giftId, character)) {
    baseChange *= 2
  } else if (isGiftDisliked(giftId, character)) {
    baseChange *= -0.5
  }

  const moodMultiplier = 0.6 + (mood / 150)
  baseChange *= moodMultiplier

  return Math.round(baseChange * 10) / 10
}

export function getAffinityStageDetail(affinity: number, gameConfig: GameConfig): AffinityStage | undefined {
  return gameConfig.relationshipGraph.affinityStages.find(
    stage => affinity >= stage.minAffinity && affinity <= stage.maxAffinity
  )
}

export function getAffinityStageProgress(affinity: number, stage: AffinityStage): number {
  const range = stage.maxAffinity - stage.minAffinity
  if (range <= 0) return 100
  const progress = ((affinity - stage.minAffinity) / range) * 100
  return clamp(progress, 0, 100)
}

export function getNextAffinityStage(
  affinity: number,
  gameConfig: GameConfig
): AffinityStage | undefined {
  const sortedStages = [...gameConfig.relationshipGraph.affinityStages].sort(
    (a, b) => a.minAffinity - b.minAffinity
  )
  return sortedStages.find(stage => affinity < stage.minAffinity)
}

export function checkStoryUnlockCondition(
  condition: StoryUnlockCondition,
  day: number,
  characters: CharacterState[],
  triggeredEvents: string[],
  flags: string[]
): boolean {
  switch (condition.type) {
    case 'affinity': {
      if (!condition.targetCharacterId || condition.requiredAffinity === undefined) return false
      const char = characters.find(c => c.id === condition.targetCharacterId)
      return !!char && char.unlocked && char.affinity >= condition.requiredAffinity
    }
    case 'event': {
      return condition.requiredEventId !== undefined
        ? triggeredEvents.includes(condition.requiredEventId)
        : false
    }
    case 'flag': {
      return condition.requiredFlag !== undefined ? flags.includes(condition.requiredFlag) : false
    }
    case 'day': {
      return condition.requiredDay !== undefined ? day >= condition.requiredDay : false
    }
    case 'multi': {
      if (!condition.requiredConditions || condition.requiredConditions.length === 0) return false
      return condition.requiredConditions.every(cond => {
        switch (cond.type) {
          case 'day':
            return day >= (cond.value as number)
          case 'affinity': {
            const char = characters.find(c => c.id === cond.characterId)
            return !!char && char.unlocked && char.affinity >= (cond.value as number)
          }
          case 'event':
            return triggeredEvents.includes(cond.value as string)
          case 'flag':
            return flags.includes(cond.value as string)
          default:
            return false
        }
      })
    }
    default:
      return false
  }
}

export function getRelationshipTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    friend: '朋友',
    rival: '情敌',
    sister: '姐妹',
    colleague: '同事',
    stranger: '陌生人'
  }
  return labels[type] || '未知'
}

export function getRelationshipTypeColor(type: string): string {
  const colors: Record<string, string> = {
    friend: '#22c55e',
    rival: '#ef4444',
    sister: '#f472b6',
    colleague: '#3b82f6',
    stranger: '#94a3b8'
  }
  return colors[type] || '#94a3b8'
}

export function formatUnlockCondition(
  condition: StoryUnlockCondition,
  gameConfig: GameConfig
): string {
  switch (condition.type) {
    case 'affinity': {
      const char = gameConfig.characters.find(c => c.id === condition.targetCharacterId)
      return `与「${char?.name || '???'}」好感度达到 ${condition.requiredAffinity}`
    }
    case 'event': {
      const event = gameConfig.events.find(e => e.id === condition.requiredEventId)
      return `触发事件「${event?.title || condition.requiredEventId}」`
    }
    case 'flag':
      return `达成条件「${condition.requiredFlag}」`
    case 'day':
      return `游戏进度达到第 ${condition.requiredDay} 天`
    case 'multi': {
      if (!condition.requiredConditions) return '满足多个条件'
      return condition.requiredConditions
        .map(cond => {
          switch (cond.type) {
            case 'day':
              return `第 ${cond.value} 天`
            case 'affinity': {
              const char = gameConfig.characters.find(c => c.id === cond.characterId)
              return `「${char?.name || '???'}」好感度 ${cond.value}`
            }
            case 'event': {
              const event = gameConfig.events.find(e => e.id === (cond.value as string))
              return `触发「${event?.title || cond.value}」`
            }
            case 'flag':
              return `${cond.value}`
            default:
              return '未知条件'
          }
        })
        .join(' + ')
    }
    default:
      return '未知条件'
  }
}
