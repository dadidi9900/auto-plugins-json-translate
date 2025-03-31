export interface TranslationBlock {
  id: string;
  content: Record<string, any>;
}

export interface TranslationState {
  currentBlock: number;
  totalBlocks: number;
  completedBlocks: number;
  errorBlocks: number;
  isPaused: boolean;
}

export interface TranslationConfig {
  apiKey: string;
  languages: string[];
  sourceLanguage: string;
  retryCount: number;
  autoSplit: boolean;
}

export interface TranslationResult {
  key: string;
  translations: Record<string, any>;
  status: 'success' | 'error';
  error?: string;
} 