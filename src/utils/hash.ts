import md5 from 'md5'

export const getFileHash = (content: string): string => {
  return md5(content).slice(0, 8)
} 