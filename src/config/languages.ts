export interface Language {
  value: string;
  label: string;
}

export const languages: Language[] = [
  { value: 'zh-cn', label: '简体中文' },
  { value: 'en', label: '英语' },
  { value: 'ru', label: '俄语' },
  { value: 'es', label: '西班牙语' },
  { value: 'de', label: '德语' },
  { value: 'tr', label: '土耳其语' },
  { value: 'fr', label: '法语' },
  { value: 'ja', label: '日语' },
  { value: 'pt', label: '葡萄牙语' },
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
];

export const getLanguageLabel = (lang: string): string => {
  const language = languages.find(l => l.value === lang);
  return language ? language.label : lang;
}; 