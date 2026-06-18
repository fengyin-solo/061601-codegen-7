<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import gameConfig from '../config/gameConfig'
import {
  getAffinityStageProgress,
  getNextAffinityStage,
  getRelationshipTypeLabel,
  getRelationshipTypeColor,
  formatUnlockCondition
} from '../utils/gameUtils'

const props = defineProps<{
  close: () => void
}>()

const gameStore = useGameStore()

type TabType = 'stages' | 'relationships' | 'conflicts' | 'story'
const activeTab = ref<TabType>('stages')

const tabs: { key: TabType; label: string; icon: string }[] = [
  { key: 'stages', label: '好感阶段', icon: '💕' },
  { key: 'relationships', label: '角色关系', icon: '🕸️' },
  { key: 'conflicts', label: '冲突影响', icon: '⚔️' },
  { key: 'story', label: '剧情解锁', icon: '📖' }
]

const affinityStages = computed(() => gameConfig.relationshipGraph.affinityStages)

const characterRelationships = computed(() => {
  return gameConfig.relationshipGraph.relationships.map(rel => {
    const char1 = gameConfig.characters.find(c => c.id === rel.characterId1)
    const char2 = gameConfig.characters.find(c => c.id === rel.characterId2)
    const char1State = gameStore.getCharacterState(rel.characterId1)
    const char2State = gameStore.getCharacterState(rel.characterId2)
    const visible = (char1State?.unlocked || char1?.unlocked) && (char2State?.unlocked || char2?.unlocked)
    return {
      ...rel,
      char1,
      char2,
      visible
    }
  }).filter(r => r.visible)
})

const sortedStages = computed(() =>
  [...affinityStages.value].sort((a, b) => a.minAffinity - b.minAffinity)
)

const storyUnlocksByCharacter = computed(() => {
  const result: Record<string, typeof gameStore.storyUnlocksWithStatus.value> = { general: [] }
  gameStore.storyUnlocksWithStatus.forEach(unlock => {
    const key = unlock.targetCharacterId || 'general'
    if (!result[key]) result[key] = []
    result[key].push(unlock)
  })
  return result
})

const characterKeys = computed(() =>
  Object.keys(storyUnlocksByCharacter.value).filter(k => k !== 'general')
)

function getNodePosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2
  const radius = 120
  const centerX = 180
  const centerY = 180
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}

function getRelationshipMidpoint(rel: typeof characterRelationships.value[0]) {
  const char1Idx = gameStore.charactersWithRelationships.findIndex(c => c.config?.id === rel.characterId1)
  const char2Idx = gameStore.charactersWithRelationships.findIndex(c => c.config?.id === rel.characterId2)
  const total = gameStore.charactersWithRelationships.length
  if (char1Idx < 0 || char2Idx < 0 || total < 2) return { x: 180, y: 180 }
  const pos1 = getNodePosition(char1Idx, total)
  const pos2 = getNodePosition(char2Idx, total)
  return {
    x: (pos1.x + pos2.x) / 2,
    y: (pos1.y + pos2.y) / 2
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="props.close()">
    <div class="modal-content relationship-modal">
      <div class="modal-header">
        <h2 class="modal-title">
          <span class="title-icon">🕸️</span>
          角色关系图谱
        </h2>
        <button class="close-btn" @click="props.close()">✕</button>
      </div>

      <div class="tabs-bar">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'stages'" class="stages-panel animate-fade-in">
          <div class="panel-desc">共 {{ sortedStages.length }} 个好感阶段，提升好感解锁更多内容</div>

          <div class="stages-list">
            <div
              v-for="stage in sortedStages"
              :key="stage.name"
              class="stage-card"
            >
              <div class="stage-header" :style="{ borderColor: stage.color }">
                <span class="stage-icon">{{ stage.icon }}</span>
                <div class="stage-info">
                  <span class="stage-name" :style="{ color: stage.color }">{{ stage.name }}</span>
                  <span class="stage-range">好感度 {{ stage.minAffinity }} ~ {{ stage.maxAffinity }}</span>
                </div>
              </div>
              <p class="stage-desc">{{ stage.description }}</p>
              <div class="stage-privileges">
                <span v-for="privilege in stage.privileges" :key="privilege" class="privilege-tag">
                  {{ privilege }}
                </span>
              </div>

              <div v-if="gameStore.selectedCharacterId" class="char-progress">
                <div
                  v-for="item in gameStore.charactersWithRelationships.filter(c => c.config?.id === gameStore.selectedCharacterId)"
                  :key="item.state.id"
                >
                  <div class="progress-label">
                    <span>当前进度</span>
                    <span v-if="item.stage?.name === stage.name">
                      {{ Math.round(getAffinityStageProgress(item.state.affinity, stage)) }}%
                    </span>
                    <span v-else-if="item.stage && sortedStages.indexOf(stage) < sortedStages.indexOf(item.stage)">已达成 ✓</span>
                    <span v-else>未达成</span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{
                        width: item.stage?.name === stage.name
                          ? `${getAffinityStageProgress(item.state.affinity, stage)}%`
                          : sortedStages.indexOf(stage) < sortedStages.indexOf(item.stage!)
                            ? '100%'
                            : '0%',
                        backgroundColor: stage.color
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="gameStore.selectedCharacterId" class="next-stage-hint">
            <div
              v-for="item in gameStore.charactersWithRelationships.filter(c => c.config?.id === gameStore.selectedCharacterId)"
              :key="item.state.id"
            >
              <template v-if="getNextAffinityStage(item.state.affinity, gameConfig)">
                <p class="hint-text">
                  💡 距离下一阶段「{{ getNextAffinityStage(item.state.affinity, gameConfig)?.name }}」
                  还需 {{ getNextAffinityStage(item.state.affinity, gameConfig)!.minAffinity - item.state.affinity }} 好感度
                </p>
              </template>
              <template v-else>
                <p class="hint-text">🎉 已达到最高好感阶段！</p>
              </template>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'relationships'" class="relationships-panel animate-fade-in">
          <div class="panel-desc">角色之间的关系网络，注意处理好各方关系</div>

          <div class="graph-container">
            <svg class="relationship-graph" viewBox="0 0 360 360">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:var(--accent-primary);stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:var(--accent-secondary);stop-opacity:0.3" />
                </linearGradient>
              </defs>

              <template v-for="rel in characterRelationships" :key="rel.characterId1 + rel.characterId2">
                <line
                  :x1="getNodePosition(gameStore.charactersWithRelationships.findIndex(c => c.config?.id === rel.characterId1), gameStore.charactersWithRelationships.length).x"
                  :y1="getNodePosition(gameStore.charactersWithRelationships.findIndex(c => c.config?.id === rel.characterId1), gameStore.charactersWithRelationships.length).y"
                  :x2="getNodePosition(gameStore.charactersWithRelationships.findIndex(c => c.config?.id === rel.characterId2), gameStore.charactersWithRelationships.length).x"
                  :y2="getNodePosition(gameStore.charactersWithRelationships.findIndex(c => c.config?.id === rel.characterId2), gameStore.charactersWithRelationships.length).y"
                  :stroke="getRelationshipTypeColor(rel.type)"
                  stroke-width="2"
                  stroke-dasharray="6,4"
                  opacity="0.6"
                />
              </template>

              <template v-for="(item, idx) in gameStore.charactersWithRelationships.filter(c => c.state.unlocked || c.config?.unlocked)" :key="item.state.id">
                <foreignObject
                  :x="getNodePosition(idx, gameStore.charactersWithRelationships.length).x - 36"
                  :y="getNodePosition(idx, gameStore.charactersWithRelationships.length).y - 36"
                  width="72"
                  height="72"
                >
                  <div
                    class="node-circle"
                    :style="{ borderColor: item.stage?.color || '#94a3b8' }"
                  >
                    <span class="node-avatar">{{ item.config?.avatar }}</span>
                  </div>
                </foreignObject>
              </template>
            </svg>

            <div class="graph-center">
              <div class="center-label">玩家</div>
              <div class="center-avatar">😊</div>
            </div>
          </div>

          <div class="relationships-list">
            <div
              v-for="rel in characterRelationships"
              :key="rel.characterId1 + rel.characterId2"
              class="relationship-card"
            >
              <div class="rel-characters">
                <span class="rel-char">{{ rel.char1?.avatar }} {{ rel.char1?.name }}</span>
                <span class="rel-arrow" :style="{ color: getRelationshipTypeColor(rel.type) }">
                  ↔
                </span>
                <span class="rel-char">{{ rel.char2?.avatar }} {{ rel.char2?.name }}</span>
              </div>
              <div class="rel-type" :style="{ backgroundColor: getRelationshipTypeColor(rel.type) }">
                {{ getRelationshipTypeLabel(rel.type) }} · {{ rel.label }}
              </div>
              <p class="rel-desc">{{ rel.description }}</p>
              <div v-if="rel.conflictEvents && rel.conflictEvents.length > 0" class="rel-conflicts">
                <span class="conflict-label">关联冲突：</span>
                <span
                  v-for="eventId in rel.conflictEvents"
                  :key="eventId"
                  class="conflict-tag"
                >
                  {{ gameConfig.relationshipGraph.conflicts.find(c => c.eventId === eventId)?.title || eventId }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'conflicts'" class="conflicts-panel animate-fade-in">
          <div class="conflicts-stats">
            <div class="stat-item">
              <span class="stat-num active">{{ gameStore.activeConflicts.length }}</span>
              <span class="stat-label">已触发冲突</span>
            </div>
            <div class="stat-item">
              <span class="stat-num pending">{{ gameStore.pendingConflicts.length }}</span>
              <span class="stat-label">待触发冲突</span>
            </div>
            <div class="stat-item">
              <span class="stat-num total">{{ gameConfig.relationshipGraph.conflicts.length }}</span>
              <span class="stat-label">冲突总数</span>
            </div>
          </div>

          <div class="conflicts-list">
            <div
              v-for="conflict in gameConfig.relationshipGraph.conflicts"
              :key="conflict.eventId"
              class="conflict-card"
              :class="{
                triggered: gameStore.triggeredEvents.includes(conflict.eventId),
                pending: !gameStore.triggeredEvents.includes(conflict.eventId)
              }"
            >
              <div class="conflict-header">
                <span class="conflict-status" :class="gameStore.triggeredEvents.includes(conflict.eventId) ? 'done' : 'waiting'">
                  {{ gameStore.triggeredEvents.includes(conflict.eventId) ? '✓ 已触发' : '○ 待触发' }}
                </span>
                <span class="conflict-title">{{ conflict.title }}</span>
              </div>

              <div class="conflict-affected">
                <span class="affected-label">影响角色：</span>
                <span
                  v-for="charId in conflict.affectedCharacters"
                  :key="charId"
                  class="affected-char"
                >
                  {{ gameConfig.characters.find(c => c.id === charId)?.avatar }}
                  {{ gameConfig.characters.find(c => c.id === charId)?.name }}
                </span>
              </div>

              <div class="penalty-row">
                <div class="penalty-item">
                  <span class="penalty-label">最大好感惩罚</span>
                  <span class="penalty-value bad">-{{ conflict.maxAffinityPenalty }}</span>
                </div>
                <div class="penalty-item">
                  <span class="penalty-label">最大心情惩罚</span>
                  <span class="penalty-value bad">-{{ conflict.maxMoodPenalty }}</span>
                </div>
              </div>

              <div class="resolution-hint">
                <span class="hint-icon">💡</span>
                <span>{{ conflict.resolutionHint }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'story'" class="story-panel animate-fade-in">
          <div class="story-progress-bar">
            <div class="progress-info">
              <span>剧情解锁进度</span>
              <span>{{ gameStore.unlockedStoryCount }} / {{ gameStore.totalStoryCount }}</span>
            </div>
            <div class="progress-bar large">
              <div
                class="progress-fill"
                :style="{ width: `${(gameStore.unlockedStoryCount / gameStore.totalStoryCount) * 100}%` }"
              ></div>
            </div>
          </div>

          <div v-if="storyUnlocksByCharacter['general'] && storyUnlocksByCharacter['general'].length > 0" class="story-section">
            <h3 class="section-title">通用条件</h3>
            <div class="story-list">
              <div
                v-for="unlock in storyUnlocksByCharacter['general']"
                :key="unlock.id"
                class="story-card"
                :class="{ unlocked: unlock.unlocked }"
              >
                <div class="story-status">{{ unlock.unlocked ? '✓' : '○' }}</div>
                <div class="story-info">
                  <h4 class="story-title">{{ unlock.title }}</h4>
                  <p class="story-desc">{{ unlock.description }}</p>
                  <div class="story-condition">
                    <span class="condition-label">解锁条件：</span>
                    <span class="condition-text">{{ formatUnlockCondition(unlock, gameConfig) }}</span>
                  </div>
                  <div v-if="unlock.reward" class="story-reward">
                    <span class="reward-icon">🎁</span>
                    <span>{{ unlock.reward }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-for="charId in characterKeys" :key="charId" class="story-section">
            <h3 class="section-title">
              <span class="char-avatar">{{ gameConfig.characters.find(c => c.id === charId)?.avatar }}</span>
              {{ gameConfig.characters.find(c => c.id === charId)?.name }} 专属
            </h3>
            <div class="story-list">
              <div
                v-for="unlock in storyUnlocksByCharacter[charId]"
                :key="unlock.id"
                class="story-card"
                :class="{ unlocked: unlock.unlocked }"
              >
                <div class="story-status" :class="{ done: unlock.unlocked }">{{ unlock.unlocked ? '✓' : '○' }}</div>
                <div class="story-info">
                  <h4 class="story-title">{{ unlock.title }}</h4>
                  <p class="story-desc">{{ unlock.description }}</p>
                  <div class="story-condition">
                    <span class="condition-label">解锁条件：</span>
                    <span class="condition-text">{{ formatUnlockCondition(unlock, gameConfig) }}</span>
                  </div>
                  <div v-if="unlock.reward" class="story-reward">
                    <span class="reward-icon">🎁</span>
                    <span>{{ unlock.reward }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.relationship-modal {
  max-width: 720px;
  padding: 0;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 24px;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--accent-light);
  color: var(--accent-primary);
}

.tabs-bar {
  display: flex;
  gap: 4px;
  padding: 12px 24px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-light);
}

.tab-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.tab-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--bg-secondary);
  color: var(--accent-primary);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.tab-icon {
  font-size: 18px;
}

.tab-content {
  padding: 24px;
  max-height: 520px;
  overflow-y: auto;
}

.panel-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.stages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stage-card {
  padding: 16px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border-left: 4px solid transparent;
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid;
}

.stage-icon {
  font-size: 28px;
}

.stage-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stage-name {
  font-weight: 600;
  font-size: 15px;
}

.stage-range {
  font-size: 12px;
  color: var(--text-muted);
}

.stage-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  line-height: 1.5;
}

.stage-privileges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.privilege-tag {
  padding: 3px 10px;
  background: var(--bg-secondary);
  border-radius: 9999px;
  font-size: 11px;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.char-progress {
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.next-stage-hint {
  margin-top: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, var(--accent-light), var(--bg-tertiary));
  border-radius: var(--radius-md);
}

.hint-text {
  font-size: 13px;
  color: var(--accent-primary);
  font-weight: 500;
}

.graph-container {
  position: relative;
  width: 100%;
  max-width: 360px;
  aspect-ratio: 1;
  margin: 0 auto 20px;
  background: var(--bg-tertiary);
  border-radius: 50%;
  overflow: hidden;
}

.relationship-graph {
  width: 100%;
  height: 100%;
}

.node-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.node-avatar {
  font-size: 32px;
}

.graph-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.center-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  box-shadow: 0 4px 16px var(--shadow-color);
}

.center-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.relationships-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.relationship-card {
  padding: 14px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.rel-characters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 10px;
}

.rel-char {
  font-weight: 500;
  font-size: 14px;
}

.rel-arrow {
  font-size: 20px;
  font-weight: bold;
}

.rel-type {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 9999px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  margin: 0 auto 10px;
  display: block;
  text-align: center;
  width: fit-content;
}

.rel-desc {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.5;
  margin-bottom: 10px;
}

.rel-conflicts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.conflict-label {
  font-size: 12px;
  color: var(--text-muted);
}

.conflict-tag {
  padding: 2px 8px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 4px;
  font-size: 11px;
}

.conflicts-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 14px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.stat-num {
  display: block;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-num.active {
  color: var(--accent-primary);
}

.stat-num.pending {
  color: var(--warning-color);
}

.stat-num.total {
  color: var(--info-color);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.conflicts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.conflict-card {
  padding: 16px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--warning-color);
}

.conflict-card.triggered {
  border-left-color: var(--success-color);
}

.conflict-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.conflict-status {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 9999px;
  flex-shrink: 0;
}

.conflict-status.done {
  background: #dcfce7;
  color: #16a34a;
}

.conflict-status.waiting {
  background: #fef3c7;
  color: #d97706;
}

.conflict-title {
  font-weight: 600;
  font-size: 15px;
}

.conflict-affected {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 13px;
}

.affected-label {
  color: var(--text-muted);
  flex-shrink: 0;
}

.affected-char {
  padding: 3px 10px;
  background: var(--bg-secondary);
  border-radius: 9999px;
  font-size: 12px;
}

.penalty-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.penalty-item {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
}

.penalty-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.penalty-value {
  font-weight: 600;
  font-size: 15px;
}

.penalty-value.bad {
  color: var(--error-color);
}

.resolution-hint {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  background: var(--accent-light);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--accent-primary);
  line-height: 1.5;
}

.hint-icon {
  flex-shrink: 0;
}

.story-progress-bar {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.progress-bar.large {
  height: 10px;
}

.story-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 6px;
}

.char-avatar {
  font-size: 18px;
}

.story-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.story-card {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  opacity: 0.65;
  transition: opacity 0.2s;
}

.story-card.unlocked {
  opacity: 1;
}

.story-status {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.story-status.done {
  background: #dcfce7;
  color: #16a34a;
}

.story-info {
  flex: 1;
  min-width: 0;
}

.story-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.story-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.story-condition {
  font-size: 12px;
  margin-bottom: 6px;
}

.condition-label {
  color: var(--text-muted);
}

.condition-text {
  color: var(--info-color);
  font-weight: 500;
}

.story-reward {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--accent-light);
  border-radius: var(--radius-sm);
  font-size: 11px;
  color: var(--accent-primary);
  width: fit-content;
}
</style>
