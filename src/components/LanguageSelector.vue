<template>
  <div class="language-selector">
    <div class="language-selector-header">
      <div class="language-actions">
        <el-button type="info" size="small" @click="clearAll">
          清空
        </el-button>
      </div>
    </div>
    
    <div class="language-grid">
      <div
        v-for="lang in displayLanguages"
        :key="lang.value"
        :class="[
          'language-item',
          {
            'selected': modelValue.includes(lang.value),
            'translated': props.existingLanguages.has(lang.value)
          }
        ]"
        @click="toggleLanguage(lang.value)"
      >
        {{ lang.label }}
        <el-tag v-if="props.existingLanguages.has(lang.value)" size="small" type="warning" class="translated-tag">已翻译</el-tag>
      </div>
      
      <div class="show-more" @click="toggleShowAll">
        {{ showAll ? '收起语言' : '显示更多语言' }}
        <el-icon class="show-more-icon" :class="{ 'is-reverse': showAll }">
          <arrow-down />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

interface Language {
  value: string
  label: string
}

interface Props {
  modelValue: string[]
  sourceLanguage?: string
  existingLanguages?: Set<string>
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  sourceLanguage: '',
  existingLanguages: () => new Set()
})

const emit = defineEmits<Emits>()

const showAll = ref(false)

const allLanguages: Language[] = [
  { value: 'en', label: '英语' },
  { value: 'ru', label: '俄语' },
  { value: 'es', label: '西班牙语' },
  { value: 'de', label: '德语' },
  { value: 'tr', label: '土耳其语' },
  { value: 'fr', label: '法语' },
  { value: 'ja', label: '日语' },
  { value: 'pt', label: '葡萄牙语' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁体中文' },
  { value: 'it', label: '意大利语' },
  { value: 'ar', label: '阿拉伯语' },
  { value: 'pl', label: '波兰语' },
  { value: 'el', label: '希腊语' },
  { value: 'nl', label: '荷兰语' },
  { value: 'id', label: '印尼语' },
  { value: 'ko', label: '韩语' },
  { value: 'th', label: '泰语' },
  { value: 'vi', label: '越南语' },
  { value: 'cs', label: '捷克语' },
  { value: 'hu', label: '匈牙利语' },
  { value: 'ro', label: '罗马尼亚语' },
  { value: 'sv', label: '瑞典语' },
  { value: 'da', label: '丹麦语' },
  { value: 'fi', label: '芬兰语' },
  { value: 'no', label: '挪威语' },
  { value: 'uk', label: '乌克兰语' },
  { value: 'he', label: '希伯来语' },
  { value: 'hi', label: '印地语' },
  { value: 'bn', label: '孟加拉语' },
  { value: 'mr', label: '马拉地语' },
  { value: 'ta', label: '泰米尔语' },
  { value: 'ur', label: '乌尔都语' },
  { value: 'fa', label: '波斯语' },
  { value: 'ms', label: '马来语' }
]

const availableLanguages = computed(() => 
  allLanguages.filter(lang => 
    lang.value !== props.sourceLanguage && 
    lang.value.toLowerCase() !== props.sourceLanguage.toLowerCase()
  )
)

const displayLanguages = computed(() => {
  if (showAll.value) {
    return availableLanguages.value
  }
  return availableLanguages.value.slice(0, 12)
})

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

const initializeSelection = () => {
  const allLangs = availableLanguages.value.map(lang => lang.value)
  const initialSelection = allLangs.filter(lang => !props.existingLanguages.has(lang))
  emit('update:modelValue', initialSelection)
}

onMounted(() => {
  initializeSelection()
})

watch(() => props.existingLanguages, (newExistingLanguages) => {
  const currentSelection = [...props.modelValue]
  const newSelection = currentSelection.filter(lang => !newExistingLanguages.has(lang))
  emit('update:modelValue', newSelection)
}, { deep: true })

const toggleLanguage = (value: string) => {
  if (value === props.sourceLanguage) return
  
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)
  
  if (index === -1) {
    newValue.push(value)
  } else {
    newValue.splice(index, 1)
  }
  
  emit('update:modelValue', newValue)
}

const clearAll = () => {
  emit('update:modelValue', [])
}
</script>

<style scoped>
.language-selector {
  width: 100%;
}

.language-selector-header {
  margin-bottom: 16px;
}

.language-selector-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.language-selector-desc {
  margin: 4px 0 8px;
  color: #666;
  font-size: 14px;
}

.language-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.language-item {
  position: relative;
  padding: 8px 16px;
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  color: #303133;
  user-select: none;
}

.language-item:hover {
  border-color: #409eff;
  color: #409eff;
}

.language-item.selected {
  background-color: #409eff;
  color: #ffffff;
  border-color: #409eff;
}

.language-item.translated {
  border-color: #e6a23c;
  color: #e6a23c;
}

.language-item.translated:hover {
  border-color: #e6a23c;
  color: #e6a23c;
  opacity: 0.8;
}

.language-item.translated.selected {
  background-color: #e6a23c;
  color: #ffffff;
  border-color: #e6a23c;
}

.translated-tag {
  position: absolute;
  top: 2px;
  right: -8px;
  transform: scale(0.8);
}

.show-more {
  grid-column: 1 / -1;
  text-align: center;
  color: #409eff;
  cursor: pointer;
  padding: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.show-more-icon {
  transition: transform 0.3s;
}

.show-more-icon.is-reverse {
  transform: rotate(180deg);
}
</style> 