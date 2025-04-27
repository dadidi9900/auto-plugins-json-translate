<template>
  <div class="translation-container">
    <div class="header">
      <h1>i18n JSON 国际化翻译工具</h1>
      <p class="subtitle">
        使用 AI 技术快速翻译您的 JSON 语言文件。快速、准确、易用。
      </p>
    </div>

    <div class="main-content">
      <!-- 左侧配置区域 -->
      <div class="config-section">
        <div class="section-title">
          <h2>上传 JSON 文件</h2>
          <p class="section-desc">支持 .json 格式文件，最大 10MB</p>
        </div>

        <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :show-file-list="false"
        >
          <div class="upload-content">
            <el-icon class="el-icon--upload"
              ><upload-filled v-if="!currentFile" /><document v-else
            /></el-icon>
            <div class="el-upload__text">
              {{ currentFile ? currentFile.name : "拖拽文件到此处或 点击上传" }}
            </div>
            <div class="el-upload__tip">
              <template v-if="!currentFile"> 请上传 JSON 格式的文件 </template>
              <template v-else>
                <el-button
                  type="danger"
                  size="small"
                  @click.stop="handleRemoveFile"
                  class="remove-file"
                >
                  重新上传
                </el-button>
              </template>
            </div>
          </div>
        </el-upload>

        <div class="section-title">
          <h2>DeepSeek API 密钥</h2>
          <p class="section-desc">提示：翻译功能需要 DeepSeek API 密钥</p>
        </div>

        <el-form :model="form" class="config-form">
          <el-form-item class="api-key-item">
            <el-input
              v-model="form.apiKey"
              type="password"
              placeholder="请输入 DeepSeek API Key"
            >
              <template #prefix>
                <el-icon><key /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <div class="section-title">
            <h2>选择源语言</h2>
            <p class="section-desc">选择需要翻译的源语言</p>
          </div>

          <el-form-item class="source-language-item">
            <el-select
              v-model="form.sourceLanguage"
              placeholder="请选择源语言"
              class="language-select"
            >
              <el-option
                v-for="lang in languages"
                :key="lang.value"
                :label="lang.label"
                :value="lang.value"
              />
            </el-select>
          </el-form-item>

          <div class="section-title">
            <h2>选择目标语言</h2>
            <p class="section-desc">选择需要翻译的目标语言</p>
          </div>

          <el-form-item class="languages-item">
            <language-selector
              v-model="form.languages"
              :source-language="form.sourceLanguage"
              :existing-languages="existingLanguages"
            />
          </el-form-item>

          <el-form-item class="action-buttons">
            <el-button
              type="primary"
              @click="startTranslation"
              :disabled="!canStart"
              class="start-button"
            >
              开始翻译
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 右侧预览区域 -->
      <div class="preview-section">
        <div class="preview-container">
          <div class="preview-header">
            <h3>原始 JSON</h3>
            <p class="preview-desc">
              提示：支持实时预览和格式化 JSON 文件，您可以直接复制内容
            </p>
          </div>
          <pre
            class="language-json"
          ><code v-html="formatJson(jsonContent)"></code></pre>
        </div>

        <div class="preview-container">
          <div class="preview-header">
            <h3>实时翻译预览</h3>
            <p class="preview-desc">当前正在翻译的内容实时预览</p>
            <div class="translation-progress" v-if="isTranslating">
              <el-progress
                :percentage="(completedBlocks / totalBlocks) * 100"
                :format="(format: number) => `正在翻译第 ${currentBlockIndex + 1}/${totalBlocks} 部分`"
              />
              <div class="progress-info">
                <span>已完成: {{ completedBlocks }}/{{ totalBlocks }}</span>
                <el-button
                  type="primary"
                  size="small"
                  @click="handleMergeAndCleanup"
                  :disabled="completedBlocks < totalBlocks"
                >
                  合并翻译结果
                </el-button>
              </div>
            </div>
          </div>
          <pre
            class="language-json streaming-preview"
          ><code ref="streamingCode" v-html="formatStreamingContent(streamingContent[form.languages[0]] || {})"></code></pre>
        </div>

        <div class="preview-container preview-container-large">
          <div class="preview-header">
            <h3>翻译结果预览</h3>
            <p class="preview-desc">各语种的翻译结果</p>
            <el-button
              type="primary"
              size="small"
              @click="mergeTranslations"
              class="merge-button"
            >
              合并结果
            </el-button>
          </div>
          <pre
            class="language-json"
          ><code v-html="formatJson(getTranslationResult(activeTab))"></code></pre>
          <div class="custom-tabs">
            <div
              v-for="lang in availableLanguages"
              :key="lang.value"
              :class="[
                'tab-item',
                {
                  active: activeTab === lang.value,
                  selected: form.languages.includes(lang.value),
                  translated: existingLanguages.has(lang.value),
                },
              ]"
              @click="activeTab = lang.value"
            >
              {{ lang.label }}
              <el-tag
                v-if="existingLanguages.has(lang.value)"
                size="small"
                type="warning"
                class="translated-tag"
                >已翻译</el-tag
              >
              <el-button
                v-if="existingLanguages.has(lang.value)"
                type="danger"
                size="small"
                class="delete-translation"
                @click.stop="handleDeleteTranslation(lang.value)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 自定义合并结果弹窗 -->
  <div
    v-if="showMergeDialog"
    class="custom-dialog-overlay"
    @click="showMergeDialog = false"
  >
    <div class="custom-dialog" @click.stop>
      <div class="dialog-header">
        <h3>合并结果预览</h3>
        <el-button class="close-button" @click="showMergeDialog = false">
          <el-icon><close /></el-icon>
        </el-button>
      </div>
      <div class="dialog-content">
        <pre
          class="language-json"
        ><code v-html="formatJson(mergedResult || {})"></code></pre>
      </div>
      <div class="dialog-footer">
        <el-button @click="showMergeDialog = false">关闭</el-button>
        <el-button type="primary" @click="copyTranslation">复制结果</el-button>
        <el-button type="success" @click="exportTranslation"
          >下载结果</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { UploadFilled, Key, Document, Close } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { TranslationConfig, TranslationBlock } from "../types/translation";
import { TranslationService } from "../services/translationService";
import { JsonSplitter } from "../utils/jsonSplitter";
import LanguageSelector from "./LanguageSelector.vue";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";
import "../assets/styles/translation-form.css";
import { getFileHash } from "../utils/hash";
import {
  languages,
  getLanguageLabel as getLanguageLabelFromConfig,
} from "../config/languages";

const form = ref<TranslationConfig>({
  apiKey: "",
  languages: [],
  sourceLanguage: "zh-cn",
  retryCount: 1,
  autoSplit: true,
});

const jsonContent = ref<Record<string, any>>({});
const blocks = ref<TranslationBlock[]>([]);
const isTranslating = ref(false);
const currentBlockIndex = ref(0);
const completedBlocks = ref(0);
const totalBlocks = ref(0);
const activeTab = ref("");
const translatedContent = ref<Record<string, Record<string, any>>>({});
const streamingContent = ref<Record<string, any>>({});
const mergedResult = ref<Record<string, any> | null>(null);
const translationCache = ref<Record<string, Record<string, any>>>({});

const currentFile = ref<any>(null);
const showMergeDialog = ref(false);
const existingLanguages = ref<Set<string>>(new Set());
const fileHash = ref<string>("");

const streamingCode = ref<HTMLElement | null>(null);

// 从缓存中加载翻译结果
const loadFromCache = (language: string): boolean => {
  if (!fileHash.value) return false;
  const cachedData = localStorage.getItem(
    `translation_cache_${fileHash.value}_${language}`
  );
  if (cachedData) {
    try {
      translationCache.value[language] = JSON.parse(cachedData);
      // 更新已翻译语言集合
      existingLanguages.value.add(language);
      return true;
    } catch (error) {
      console.error("加载缓存失败:", error);
      return false;
    }
  }
  return false;
};

// 保存翻译结果到缓存
const saveToCache = (language: string, content: Record<string, any>) => {
  if (!fileHash.value) return;
  try {
    localStorage.setItem(
      `translation_cache_${fileHash.value}_${language}`,
      JSON.stringify(content)
    );
    // 更新已翻译语言集合
    existingLanguages.value.add(language);
    ElMessage.success(`${language} 的翻译结果已缓存`);
  } catch (error) {
    console.error("保存缓存失败:", error);
  }
};

// 监听源语言变化，自动从目标语言中移除
watch(
  () => form.value.sourceLanguage,
  (newSourceLang) => {
    if (newSourceLang) {
      form.value.languages = form.value.languages.filter(
        (lang) => lang !== newSourceLang
      );
    }
  }
);

const canStart = computed(() => {
  return (
    form.value.apiKey &&
    form.value.languages.length > 0 &&
    form.value.sourceLanguage &&
    Object.keys(jsonContent.value).length > 0
  );
});

const formatJson = (json: Record<string, any>) => {
  if (!json || Object.keys(json).length === 0) return "暂无数据";

  try {
    const formattedJson = JSON.stringify(json, null, 2);
    return Prism.highlight(formattedJson, Prism.languages.json, "json");
  } catch (error) {
    console.error("JSON格式化失败:", error);
    return "JSON 格式化失败";
  }
};

const handleFileChange = (file: any) => {
  currentFile.value = file.raw;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      jsonContent.value = JSON.parse(content);

      // 计算文件内容的哈希值
      fileHash.value = getFileHash(content);

      // 自动检测源语言
      const firstKey = Object.keys(jsonContent.value)[0];
      if (firstKey) {
        const firstValue = jsonContent.value[firstKey];
        const sourceLang = Object.keys(firstValue)[0];
        if (sourceLang) {
          form.value.sourceLanguage = sourceLang;
        }
      }

      if (form.value.autoSplit) {
        blocks.value = JsonSplitter.splitJson(jsonContent.value);
      } else {
        blocks.value = [
          {
            id: "block_1",
            content: jsonContent.value,
          },
        ];
      }
      totalBlocks.value = blocks.value.length;
      // 初始化翻译内容
      form.value.languages.forEach((lang) => {
        translatedContent.value[lang] = {};
      });
      // 设置默认选中的语言标签
      if (form.value.languages.length > 0) {
        activeTab.value = form.value.languages[0];
      }

      // 文件上传成功后，加载缓存
      const loadedLanguages: string[] = [];
      form.value.languages.forEach((lang) => {
        const hasLoaded = loadFromCache(lang);
        if (hasLoaded) {
          loadedLanguages.push(lang);
        }
      });

      // 如果有加载成功的语言，显示一次性提示
      if (loadedLanguages.length > 0) {
        const languageLabels = loadedLanguages
          .map((lang) => getLanguageLabel(lang))
          .join("、");
        ElMessage.success(`已从缓存加载 ${languageLabels} 的翻译结果`);
      }
    } catch (error) {
      ElMessage.error("文件格式错误，请上传有效的 JSON 文件");
      currentFile.value = null;
      fileHash.value = "";
    }
  };
  reader.readAsText(file.raw);
};

const handleRemoveFile = (e: Event) => {
  e.stopPropagation();
  currentFile.value = null;
  jsonContent.value = {};
  form.value.languages = [];
  blocks.value = [];
  translatedContent.value = {};
  streamingContent.value = {};
  mergedResult.value = null;
  fileHash.value = "";
  // 清空已翻译语言集合
  existingLanguages.value.clear();
};

const startTranslation = async () => {
  if (!canStart.value) return;

  isTranslating.value = true;
  currentBlockIndex.value = 0;
  completedBlocks.value = 0;
  streamingContent.value = {};
  mergedResult.value = null;

  const service = new TranslationService(form.value.apiKey);

  while (currentBlockIndex.value < blocks.value.length) {
    const block = blocks.value[currentBlockIndex.value];

    for (const language of form.value.languages) {
      streamingContent.value[language] = {};
      const result = await service.translateBlock(
        block,
        language,
        (content) => {
          try {
            const parsedContent = JSON.parse(content);
            streamingContent.value[language] = parsedContent;
          } catch (e) {
            streamingContent.value[language] = content;
          }
        }
      );

      if (result.status === "success") {
        block.content = { ...block.content, ...result.translations };
        completedBlocks.value++;

        // 为每个块单独保存缓存
        const blockId = `block_${currentBlockIndex.value + 1}`;
        const cacheKey = `translation_cache_${fileHash.value}_${language}_${blockId}`;
        localStorage.setItem(cacheKey, JSON.stringify(result.translations));

        // 更新翻译内容
        translatedContent.value[language] = {
          ...translatedContent.value[language],
          ...result.translations,
        };
      } else {
        ElMessage.error(`翻译失败: ${result.error}`);
      }
    }

    currentBlockIndex.value++;
  }
};

const mergeTranslations = () => {
  const result: Record<string, Record<string, string>> = {};
  const allKeys = Object.keys(jsonContent.value);

  allKeys.forEach((key) => {
    result[key] = {};

    // 添加源语言内容
    if (jsonContent.value[key][form.value.sourceLanguage]) {
      result[key][form.value.sourceLanguage] =
        jsonContent.value[key][form.value.sourceLanguage];
    }

    // 从缓存中获取所有已翻译的内容
    Object.keys(translationCache.value).forEach((lang) => {
      if (translationCache.value[lang][key]) {
        result[key][lang] = translationCache.value[lang][key][lang];
      }
    });

    // 从最新翻译结果中获取内容（覆盖缓存中的内容）
    Object.keys(translatedContent.value).forEach((lang) => {
      if (translatedContent.value[lang][key]) {
        result[key][lang] = translatedContent.value[lang][key][lang];
      }
    });
  });

  mergedResult.value = result;
  showMergeDialog.value = true;
};

// 复制翻译结果
const copyTranslation = async () => {
  if (!mergedResult.value) return;

  try {
    const jsonString = JSON.stringify(mergedResult.value, null, 2);
    await navigator.clipboard.writeText(jsonString);
    ElMessage.success("翻译结果已复制到剪贴板");
  } catch (error) {
    console.error("复制失败:", error);
    ElMessage.error("复制失败，请手动复制");
  }
};

// 导出翻译结果
const exportTranslation = () => {
  if (!mergedResult.value) return;

  try {
    const jsonString = JSON.stringify(mergedResult.value, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `translation_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    ElMessage.success("翻译结果已导出");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败，请重试");
  }
};

// 获取语言显示名称
const getLanguageLabel = (lang: string) => {
  return getLanguageLabelFromConfig(lang);
};

// 获取指定语言的翻译结果
const getTranslationResult = (lang: string) => {
  // 首先检查缓存
  if (translationCache.value[lang]) {
    return translationCache.value[lang];
  }

  const result: Record<string, any> = {};
  const allKeys = Object.keys(jsonContent.value);

  allKeys.forEach((key) => {
    result[key] = {};
    // 添加源语言内容
    if (jsonContent.value[key][form.value.sourceLanguage]) {
      result[key][form.value.sourceLanguage] =
        jsonContent.value[key][form.value.sourceLanguage];
    }

    // 添加已存在的翻译
    Object.keys(jsonContent.value[key]).forEach((l) => {
      if (l !== form.value.sourceLanguage && jsonContent.value[key][l]) {
        result[key][l] = jsonContent.value[key][l];
      }
    });

    // 添加新翻译的内容
    if (translatedContent.value[lang] && translatedContent.value[lang][key]) {
      result[key][lang] = translatedContent.value[lang][key][lang];
    }
  });

  return result;
};

// 在组件挂载时加载所有语言的缓存
onMounted(() => {
  form.value.languages.forEach((lang) => {
    loadFromCache(lang);
  });
});

// 在 script setup 部分添加新的格式化函数
const formatStreamingContent = (content: any) => {
  if (!content || Object.keys(content).length === 0) return "暂无数据";

  try {
    // 如果内容是字符串，尝试解析它
    const jsonContent =
      typeof content === "string" ? JSON.parse(content) : content;
    // 格式化 JSON，设置缩进为 2 个空格
    const formattedJson = JSON.stringify(jsonContent, null, 2);
    // 使用 Prism 进行语法高亮
    return Prism.highlight(formattedJson, Prism.languages.json, "json");
  } catch (error) {
    // 如果解析失败，直接返回原始内容
    return content;
  }
};

// 监听 streamingContent 的变化
watch(
  () => streamingContent.value[form.value.languages[0]],
  () => {
    nextTick(() => {
      if (streamingCode.value) {
        streamingCode.value.scrollTop = streamingCode.value.scrollHeight;
      }
    });
  },
  { deep: true }
);

// 在 script setup 部分添加
const availableLanguages = computed(() => {
  return languages.filter((lang) => lang.value !== form.value.sourceLanguage);
});

// 在 script setup 部分添加删除方法
const handleDeleteTranslation = (lang: string) => {
  ElMessageBox.confirm(
    `确定要删除 ${getLanguageLabel(lang)} 的翻译结果吗？`,
    "删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      // 从缓存中删除
      localStorage.removeItem(`translation_cache_${fileHash.value}_${lang}`);
      // 从翻译缓存中删除
      delete translationCache.value[lang];
      // 从已翻译语言集合中删除
      existingLanguages.value.delete(lang);
      // 从翻译内容中删除
      delete translatedContent.value[lang];
      // 如果当前选中的是正在删除的语言，切换到第一个可用的语言
      if (activeTab.value === lang) {
        activeTab.value = form.value.languages[0] || "";
      }
      ElMessage.success(`已删除 ${getLanguageLabel(lang)} 的翻译结果`);
    })
    .catch(() => {
      // 用户取消删除
    });
};

const handleMergeAndCleanup = async () => {
  if (completedBlocks.value < totalBlocks.value) {
    ElMessage.warning("请等待所有部分翻译完成");
    return;
  }

  try {
    // 合并所有语言的翻译结果
    for (const language of form.value.languages) {
      // 从缓存中获取所有翻译结果
      const allTranslations: Record<string, any> = {};

      // 遍历所有块，合并翻译结果
      for (let i = 0; i < blocks.value.length; i++) {
        const blockId = `block_${i + 1}`;
        const cachedData = localStorage.getItem(
          `translation_cache_${fileHash.value}_${language}_${blockId}`
        );
        if (cachedData) {
          const blockTranslations = JSON.parse(cachedData);
          Object.assign(allTranslations, blockTranslations);
        }
      }

      // 保存合并后的结果
      const finalKey = `translation_cache_${fileHash.value}_${language}_final`;
      localStorage.setItem(finalKey, JSON.stringify(allTranslations));

      // 更新翻译缓存
      translationCache.value[language] = allTranslations;

      // 清理临时缓存
      for (let i = 0; i < blocks.value.length; i++) {
        const blockId = `block_${i + 1}`;
        localStorage.removeItem(
          `translation_cache_${fileHash.value}_${language}_${blockId}`
        );
      }
    }

    ElMessage.success("翻译结果已合并，临时缓存已清理");

    // 重置翻译状态
    isTranslating.value = false;
    currentBlockIndex.value = 0;
    completedBlocks.value = 0;
    blocks.value = [];

    // 更新已翻译语言集合
    form.value.languages.forEach((lang) => {
      existingLanguages.value.add(lang);
    });
  } catch (error) {
    console.error("合并翻译结果失败:", error);
    ElMessage.error("合并翻译结果失败，请重试");
  }
};
</script>

<style scoped>
.tab-item .delete-translation {
  margin-left: 8px;
  padding: 0 8px;
  height: 20px;
  line-height: 18px;
  font-size: 12px;
}

.translation-progress {
  margin-top: 10px;
  padding: 10px;
  background: var(--el-bg-color-page);
  border-radius: 4px;
}

.progress-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>
