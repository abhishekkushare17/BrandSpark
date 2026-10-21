export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type NameCategory =
  | "premium"
  | "short_catchy"
  | "modern"
  | "creative"
  | "professional"
  | "invented";

export interface NameScoreBreakdown {
  memorability: number; // 0 - 100
  pronunciation: number; // 0 - 100
  relevance: number; // 0 - 100
  overall: number; // 0 - 100
  explanation: string;
}

export interface GeneratedName {
  id: string;
  name: string;
  category: NameCategory;
  categoryLabel: string;
  meaning: string;
  reasoning: string;
  style: string;
  score: NameScoreBreakdown;
  isFavorite?: boolean;
  domainCheckPreview?: Record<string, "available" | "taken" | "unknown">;
}

export type SloganStyle =
  | "professional"
  | "funny"
  | "emotional"
  | "luxury"
  | "minimalist"
  | "inspirational";

export interface GeneratedSlogan {
  id: string;
  text: string;
  style: SloganStyle;
  styleLabel: string;
  explanation: string;
  isFavorite?: boolean;
}

export interface BrandColor {
  name: string;
  hex: string;
  rgb: string;
  role: "Primary" | "Secondary" | "Accent" | "Background / Light" | "Dark / Neutral";
  usage: string;
}

export interface BrandTypography {
  headerFont: string;
  bodyFont: string;
  fontPairingExplanation: string;
  headerFontUrl?: string;
  bodyFontUrl?: string;
}

export interface BrandValueItem {
  title: string;
  description: string;
  iconName: string;
}

export interface BrandVoiceGuideline {
  toneSpectrum: {
    label: string;
    left: string;
    right: string;
    value: number; // 1-10
  }[];
  dos: string[];
  donts: string[];
}

export interface SocialBioVariation {
  platform: "Instagram" | "Twitter / X" | "LinkedIn" | "General";
  bio: string;
  charCount: number;
}

export interface BrandIdentity {
  brandName: string;
  marketingTagline: string;
  story: string;
  mission: string;
  vision: string;
  values: BrandValueItem[];
  colorPalette: BrandColor[];
  typography: BrandTypography;
  brandVoice: BrandVoiceGuideline;
  socialBios: SocialBioVariation[];
  logoConcepts: {
    style: string;
    description: string;
    symbolism: string;
  }[];
}

export type LogoStyleType =
  | "minimalist"
  | "geometric"
  | "emblem"
  | "abstract"
  | "monogram"
  | "typographic";

export interface LogoConfig {
  id: string;
  brandName: string;
  slogan?: string;
  style: LogoStyleType;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    textColor: string;
  };
  iconShape: "spark" | "cube" | "hexagon" | "shield" | "flame" | "circle_orbit" | "letter" | "crown";
  fontFamily: string;
  showSlogan: boolean;
  svgCode?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface DomainCheckResult {
  domain: string;
  extension: string;
  status: "available" | "taken" | "checking" | "unknown";
  priceEstimate?: string;
  verifiedAt?: string;
  rawDetails?: string;
}

export interface SocialCheckResult {
  platform: "Instagram" | "YouTube" | "Facebook" | "LinkedIn" | "Twitter / X" | "GitHub";
  handle: string;
  url: string;
  status: "available" | "taken" | "checking" | "unknown";
  verifiedAt?: string;
}

export interface BrandingProject {
  id: string;
  userId: string;
  name: string;
  businessIdea: string;
  industry: string;
  targetAudience: string;
  language: string;
  personality: string;
  keywordsInclude?: string;
  keywordsExclude?: string;
  nameLength?: "short" | "medium" | "any";
  selectedWinnerName?: string;
  names: GeneratedName[];
  slogans: GeneratedSlogan[];
  brandIdentity?: BrandIdentity;
  logos: LogoConfig[];
  comparedNameIds: string[];
  favoriteNameIds: string[];
  favoriteSloganIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  actionSuggestions?: string[];
}
