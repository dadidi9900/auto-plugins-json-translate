import type { TranslationBlock, TranslationResult } from "../types/translation";

export class TranslationService {
  private apiKey: string;
  private baseUrl: string = "https://api.deepseek.com/v1/chat/completions";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translateBlock(
    block: TranslationBlock,
    targetLanguage: string,
    onStream?: (content: string) => void
  ): Promise<TranslationResult> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `你是一个专业的翻译助手。请将以下 JSON 对象中的值翻译成${targetLanguage}。并修改原语言key为${targetLanguage}，保持 JSON 结构不变，只翻译值部分，如果值为空不需要进行翻译和返回。最后请直接返回翻译后的 JSON 对象，不要包含任何解释。`,
            },
            {
              role: "user",
              content: JSON.stringify(block.content, null, 2),
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `翻译失败: ${response.statusText}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法获取响应流");
      }

      let streamContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 将 Uint8Array 转换为字符串
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices[0].delta.content) {
                streamContent += parsed.choices[0].delta.content;
                onStream?.(streamContent);
              }
            } catch (e) {
              console.error("解析流数据失败:", e);
            }
          }
        }
      }

      try {
        const translatedContent = JSON.parse(streamContent);
        return {
          key: block.id,
          translations: translatedContent,
          status: "success",
        };
      } catch (parseError) {
        throw new Error("翻译结果解析失败，请检查 API 返回格式");
      }
    } catch (error) {
      return {
        key: block.id,
        translations: {},
        status: "error",
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  async translateBlocks(
    blocks: TranslationBlock[],
    targetLanguage: string,
    onStream?: (content: string) => void
  ): Promise<TranslationResult[]> {
    const results: TranslationResult[] = [];
    for (const block of blocks) {
      const result = await this.translateBlock(block, targetLanguage, onStream);
      results.push(result);
    }
    return results;
  }
}
