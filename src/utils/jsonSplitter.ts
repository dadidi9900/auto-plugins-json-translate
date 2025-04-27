import type { TranslationBlock } from "../types/translation";

export class JsonSplitter {
  // 估算每个字符大约占用的 token 数（中文约 1.5 个 token，英文约 0.3 个 token）
  private static readonly CHINESE_TOKEN_RATIO = 1.5;
  private static readonly ENGLISH_TOKEN_RATIO = 0.3;
  // DeepSeek API 的最大输出限制
  private static readonly MAX_OUTPUT_TOKENS = 4000;
  // 预留一些 token 给系统提示词和响应格式
  private static readonly RESERVED_TOKENS = 500;
  // 每个块的最大条目数
  private static readonly MAX_ENTRIES_PER_BLOCK = 50;

  private static estimateTokens(text: string): number {
    let tokens = 0;
    for (const char of text) {
      // 使用 Unicode 范围判断是否为中文字符
      if (char.match(/[\u4e00-\u9fa5]/)) {
        tokens += this.CHINESE_TOKEN_RATIO;
      } else {
        tokens += this.ENGLISH_TOKEN_RATIO;
      }
    }
    return Math.ceil(tokens);
  }

  static splitJson(
    jsonContent: Record<string, any>,
    maxTokens: number = this.MAX_OUTPUT_TOKENS - this.RESERVED_TOKENS
  ): TranslationBlock[] {
    const blocks: TranslationBlock[] = [];
    let currentBlock: Record<string, any> = {};
    let currentTokens = 0;
    let currentEntries = 0;

    // 计算系统提示词的基础 token 数
    const basePrompt =
      "你是一个专业的翻译助手。请将以下 JSON 对象中的值翻译成目标语言。保持 JSON 结构不变，只翻译值部分。请直接返回翻译后的 JSON 对象，不要包含任何解释。";
    const basePromptTokens = this.estimateTokens(basePrompt);

    for (const [key, value] of Object.entries(jsonContent)) {
      // 计算当前键值对的 token 数
      const entryJson = JSON.stringify({ [key]: value });
      const entryTokens = this.estimateTokens(entryJson);

      // 如果当前块加上新条目会超出限制，或者达到最大条目数，创建新块
      if (
        currentTokens + entryTokens > maxTokens ||
        currentEntries >= this.MAX_ENTRIES_PER_BLOCK
      ) {
        if (Object.keys(currentBlock).length > 0) {
          blocks.push({
            id: `block_${blocks.length + 1}`,
            content: currentBlock,
          });
        }
        currentBlock = {};
        currentTokens = basePromptTokens; // 重置为新块的起始 token 数
        currentEntries = 0; // 重置条目计数
      }

      currentBlock[key] = value;
      currentTokens += entryTokens;
      currentEntries++;
    }

    // 添加最后一个块
    if (Object.keys(currentBlock).length > 0) {
      blocks.push({
        id: `block_${blocks.length + 1}`,
        content: currentBlock,
      });
    }

    return blocks;
  }

  static mergeBlocks(blocks: TranslationBlock[]): Record<string, any> {
    const result: Record<string, any> = {};

    for (const block of blocks) {
      Object.assign(result, block.content);
    }

    return result;
  }
}
