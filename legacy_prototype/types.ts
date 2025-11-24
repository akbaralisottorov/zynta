
export interface InstagramContent {
  reels_caption: string;
  carousel_text: string;
}

export interface TelegramContent {
  long: string;
  short: string;
}

export interface ZyntaContent {
  substack: string;
  instagram: InstagramContent;
  tiktok: string;
  youtube: string;
  linkedin: string;
  twitter: string;
  telegram: TelegramContent;
}

export interface ZyntaAnalysis {
  keywords: string[];
  tone: string;
  summary: string;
}

export interface ZyntaResponse {
  content: ZyntaContent;
  image_prompt: string;
  analysis: ZyntaAnalysis;
}

export type PlatformKey = 'substack' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter' | 'telegram';

export interface GenerateRequest {
  prompt: string;
  userStyle?: string;
  files?: File[];
}

export interface StyleSignature {
  tone: string;
  sentence_structure: string;
  vocabulary_patterns: string;
  pacing: string;
  transitions: string;
  avoidances: string;
}

export interface StyleAnalysisResponse {
  style_signature: StyleSignature;
}

export interface RefineResponse {
  rewritten_text: string;
}
