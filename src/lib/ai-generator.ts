import {
  BrandColor,
  BrandIdentity,
  BrandTypography,
  BrandValueItem,
  BrandVoiceGuideline,
  GeneratedName,
  GeneratedSlogan,
  NameCategory,
  SloganStyle,
  SocialBioVariation,
} from "@/types";
import { callGeminiGenerate } from "./gemini";

export interface GenerateNamesInput {
  businessIdea: string;
  industry: string;
  targetAudience: string;
  language?: string;
  personality: string;
  keywordsInclude?: string;
  keywordsExclude?: string;
  nameLength?: "short" | "medium" | "any";
  customApiKey?: string;
  count?: number;
}

export const CATEGORY_LABELS: Record<NameCategory, string> = {
  premium: "Premium Names",
  short_catchy: "Short & Catchy Names",
  modern: "Modern Names",
  creative: "Creative Names",
  professional: "Professional Names",
  invented: "Unique Invented Names",
};

export const SLOGAN_STYLE_LABELS: Record<SloganStyle, string> = {
  professional: "Professional & Authoritative",
  funny: "Clever & Playful",
  emotional: "Heartfelt & Emotional",
  luxury: "Sophisticated & Luxury",
  minimalist: "Ultra-Minimalist",
  inspirational: "Bold & Inspirational",
};

// Algorithmic Knowledge Base for high quality linguistic fallbacks and heuristics
const INDUSTRY_LEXICONS: Record<
  string,
  { prefixes: string[]; roots: string[]; suffixes: string[]; adjectives: string[]; colors: BrandColor[] }
> = {
  "Tech & AI": {
    prefixes: ["Synt", "Cogni", "Hyper", "Neu", "Nexus", "Vector", "Omni", "Data", "Algo", "Aura", "Meta", "Pulse"],
    roots: ["flux", "mind", "core", "logic", "wave", "matrix", "cloud", "grid", "spark", "link", "synapse", "flow"],
    suffixes: ["io", "iq", "ex", "is", "a", "ly", "ora", "on", "ify", "ix", "lab", "hub"],
    adjectives: ["Intelligent", "Predictive", "Autonomous", "Scalable", "Fluid", "Adaptive"],
    colors: [
      { name: "Electric Indigo", hex: "#6366F1", rgb: "99, 102, 241", role: "Primary", usage: "Main branding, primary buttons, hero highlights" },
      { name: "Cyan Spark", hex: "#06B6D4", rgb: "6, 182, 212", role: "Secondary", usage: "Data accents, badges, interactive elements" },
      { name: "Violet Nebula", hex: "#8B5CF6", rgb: "139, 92, 246", role: "Accent", usage: "Gradients, secondary highlights, tags" },
      { name: "Deep Obsidian", hex: "#0F172A", rgb: "15, 23, 42", role: "Dark / Neutral", usage: "Headings, dark cards, footer" },
      { name: "Ice White", hex: "#F8FAFC", rgb: "248, 250, 252", role: "Background / Light", usage: "App canvas, light surfaces, clean containers" },
    ],
  },
  "E-commerce & Retail": {
    prefixes: ["Shop", "Velo", "Luxe", "Moda", "Cart", "Merch", "Omni", "Swift", "Ever", "Nova", "True", "Avenue"],
    roots: ["mart", "haven", "crate", "glow", "trend", "drop", "nest", "bazaar", "pack", "store", "deal", "loop"],
    suffixes: ["ia", "ly", "co", "io", "ora", "ify", "box", "go", "spot", "hub"],
    adjectives: ["Curated", "Frictionless", "Boutique", "Delightful", "Direct", "Express"],
    colors: [
      { name: "Royal Sapphire", hex: "#4338CA", rgb: "67, 56, 202", role: "Primary", usage: "Primary CTAs, trust badges, checkout flow" },
      { name: "Emerald Mint", hex: "#10B981", rgb: "16, 185, 129", role: "Secondary", usage: "Discounts, success states, value highlights" },
      { name: "Amber Sun", hex: "#F59E0B", rgb: "245, 158, 11", role: "Accent", usage: "Promotional banners, star ratings, alert ribbons" },
      { name: "Slate Charcoal", hex: "#1E293B", rgb: "30, 41, 59", role: "Dark / Neutral", usage: "Typography, borders, high-contrast areas" },
      { name: "Crisp Linen", hex: "#F9FAFB", rgb: "249, 250, 251", role: "Background / Light", usage: "Clean product showcase background" },
    ],
  },
  "Health & Wellness": {
    prefixes: ["Vig", "Vita", "Zen", "Aura", "Pure", "Heal", "Natu", "Soma", "Bio", "Breathe", "Harmon", "Clari"],
    roots: ["well", "life", "glow", "care", "pulse", "spring", "mind", "flora", "bloom", "path", "root", "calm"],
    suffixes: ["a", "is", "ea", "ora", "ly", "ity", "ex", "vibe", "way", "lab"],
    adjectives: ["Restorative", "Wholesome", "Mindful", "Vital", "Pure", "Holistic"],
    colors: [
      { name: "Sage Teal", hex: "#0D9488", rgb: "13, 148, 136", role: "Primary", usage: "Brand marks, serene header accents, primary buttons" },
      { name: "Aloe Green", hex: "#34D399", rgb: "52, 211, 153", role: "Secondary", usage: "Wellness indicators, organic badges" },
      { name: "Warm Lavender", hex: "#A78BFA", rgb: "167, 139, 250", role: "Accent", usage: "Mindfulness callouts, relaxation tags" },
      { name: "Forest Granite", hex: "#134E4A", rgb: "19, 78, 74", role: "Dark / Neutral", usage: "Primary typography, authoritative headings" },
      { name: "Pure Dew", hex: "#F0FDF4", rgb: "240, 253, 244", role: "Background / Light", usage: "Soothing clean background" },
    ],
  },
  "Finance & Fintech": {
    prefixes: ["Cred", "Fid", "Val", "Apex", "Cap", "Aegis", "Monet", "Velo", "Fort", "Equi", "Prime", "Arch"],
    roots: ["trust", "flow", "yield", "ledger", "mint", "vault", "peak", "coin", "vest", "wise", "path", "scale"],
    suffixes: ["is", "ex", "ora", "a", "iq", "ly", "us", "io", "pay", "net"],
    adjectives: ["Institutional", "Transparent", "Empowered", "Frictionless", "Strategic", "Rock-Solid"],
    colors: [
      { name: "Navy Cobalt", hex: "#1E40AF", rgb: "30, 64, 175", role: "Primary", usage: "Financial trust, secure headers, primary actions" },
      { name: "Teal Mint", hex: "#059669", rgb: "5, 150, 105", role: "Secondary", usage: "Portfolio growth indicators, cashflow positives" },
      { name: "Gold Leaf", hex: "#D97706", rgb: "217, 119, 6", role: "Accent", usage: "Wealth management tags, tier badges" },
      { name: "Deep Charcoal", hex: "#0F172A", rgb: "15, 23, 42", role: "Dark / Neutral", usage: "Numeric readouts, table headers" },
      { name: "Clean Pearl", hex: "#F8FAFC", rgb: "248, 250, 252", role: "Background / Light", usage: "Modern banking portal canvas" },
    ],
  },
  "Fashion & Lifestyle": {
    prefixes: ["Vogue", "Lumi", "Atel", "Noir", "Maison", "Aura", "Vel", "Silk", "Styl", "Koto", "Eclat", "Mod"],
    roots: ["stitch", "thread", "vibe", "curve", "form", "wear", "drape", "chic", "luxe", "line", "mode", "flair"],
    suffixes: ["o", "a", "ier", "ette", "eur", "ique", "is", "ora", "studio", "label"],
    adjectives: ["Haute", "Refined", "Timeless", "Effortless", "Sartorial", "Contemporary"],
    colors: [
      { name: "Midnight Onyx", hex: "#18181B", rgb: "24, 24, 27", role: "Primary", usage: "Monochrome elegance, luxury brand mark" },
      { name: "Champagne Nude", hex: "#E0D7C6", rgb: "224, 215, 198", role: "Secondary", usage: "Warm editorial blocks, lookbook backdrops" },
      { name: "Crimson Rose", hex: "#BE123C", rgb: "190, 18, 60", role: "Accent", usage: "Runway highlights, limited edition badges" },
      { name: "Smoky Graphite", hex: "#27272A", rgb: "39, 39, 42", role: "Dark / Neutral", usage: "Boutique captions and subtle borders" },
      { name: "Pure Silk", hex: "#FAFAFA", rgb: "250, 250, 250", role: "Background / Light", usage: "Minimalist fashion grid background" },
    ],
  },
  "Food & Beverage": {
    prefixes: ["Gust", "Savor", "Bite", "Crav", "Artisan", "Brew", "Harvest", "Flav", "Fork", "Spice", "Zest", "Palat"],
    roots: ["craft", "table", "dish", "spoon", "crumb", "grain", "cup", "batch", "grill", "leaf", "roast", "press"],
    suffixes: ["y", "o", "a", "ery", "ly", "ish", "house", "bar", "box", "club"],
    adjectives: ["Artisanal", "Crisp", "Gourmet", "Hearty", "Flavorsome", "Farm-fresh"],
    colors: [
      { name: "Burnt Terracotta", hex: "#EA580C", rgb: "234, 88, 12", role: "Primary", usage: "Appetite appeal, primary branding, order CTA" },
      { name: "Warm Olive", hex: "#65A30D", rgb: "101, 163, 13", role: "Secondary", usage: "Farm-to-table badges, organic highlights" },
      { name: "Honey Amber", hex: "#D97706", rgb: "217, 119, 6", role: "Accent", usage: "Specialty brew callouts, flavor tags" },
      { name: "Espresso Roast", hex: "#292524", rgb: "41, 37, 36", role: "Dark / Neutral", usage: "Menu typography, rustic footers" },
      { name: "Cream Parchment", hex: "#FFFBEB", rgb: "255, 251, 235", role: "Background / Light", usage: "Warm culinary backdrop" },
    ],
  },
  "Creative & Media": {
    prefixes: ["Prism", "Vivid", "Chron", "Muse", "Cin", "Pixel", "Kinet", "Story", "Echo", "Canvas", "Aura", "Flux"],
    roots: ["craft", "frame", "reel", "lens", "beat", "voice", "scene", "shift", "spark", "forge", "cast", "flow"],
    suffixes: ["io", "ix", "ly", "ex", "ify", "ora", "lab", "works", "house", "media"],
    adjectives: ["Cinematic", "Audacious", "Electric", "Provocative", "Resonant", "Visionary"],
    colors: [
      { name: "Electric Violet", hex: "#7C3AED", rgb: "124, 58, 237", role: "Primary", usage: "Dynamic brand mark, creative portfolio hero" },
      { name: "Neon Coral", hex: "#F43F5E", rgb: "244, 63, 94", role: "Secondary", usage: "Video play buttons, viral badges, dynamic hover" },
      { name: "Cyber Cyan", hex: "#06B6D4", rgb: "6, 182, 212", role: "Accent", usage: "Interactive markers, soundwave visualizers" },
      { name: "Obsidian Deep", hex: "#09090B", rgb: "9, 9, 11", role: "Dark / Neutral", usage: "Cinematic darkroom aesthetic" },
      { name: "Studio White", hex: "#FAFAFA", rgb: "250, 250, 250", role: "Background / Light", usage: "Clean gallery canvas" },
    ],
  },
  "Education & EdTech": {
    prefixes: ["Edu", "Learn", "Mind", "Cogni", "Schol", "Intel", "Acad", "Skill", "Know", "Velo", "Lumi", "Nexus"],
    roots: ["quest", "path", "spark", "forge", "brain", "craft", "class", "base", "logic", "pulse", "spring", "bridge"],
    suffixes: ["io", "ify", "iq", "ly", "ora", "ix", "lab", "hub", "flow", "stack"],
    adjectives: ["Empowering", "Transformative", "Intuitive", "Mastery-Driven", "Enlightening", "Adaptive"],
    colors: [
      { name: "Scholar Royal", hex: "#2563EB", rgb: "37, 99, 235", role: "Primary", usage: "Academic trust, primary call-to-actions, hero banner" },
      { name: "Discovery Amber", hex: "#F59E0B", rgb: "245, 158, 11", role: "Secondary", usage: "Milestone badges, achievement stars, course tracks" },
      { name: "Mentor Teal", hex: "#0D9488", rgb: "13, 148, 136", role: "Accent", usage: "Progress indicators, interactive quizzes, student tags" },
      { name: "Deep Academy", hex: "#0F172A", rgb: "15, 23, 42", role: "Dark / Neutral", usage: "Curriculum text, authoritative headings" },
      { name: "Campus Clean", hex: "#F8FAFC", rgb: "248, 250, 252", role: "Background / Light", usage: "Crisp digital classroom background" },
    ],
  },
  "Real Estate & PropTech": {
    prefixes: ["Terra", "Haven", "Domus", "Nest", "Vista", "Acre", "Loft", "Apex", "Vault", "Prime", "Arch", "Civic"],
    roots: ["space", "land", "brick", "stone", "view", "crest", "gate", "bay", "key", "yard", "block", "point"],
    suffixes: ["io", "ix", "ora", "ly", "a", "ex", "co", "hub", "place", "group"],
    adjectives: ["Prestigious", "Enduring", "Strategic", "Architectural", "Panoramic", "Unrivaled"],
    colors: [
      { name: "Estate Navy", hex: "#1E3A8A", rgb: "30, 58, 138", role: "Primary", usage: "Institutional prestige, architectural markers" },
      { name: "Warm Champagne", hex: "#D4AF37", rgb: "212, 175, 55", role: "Secondary", usage: "Luxury property badges, exclusive listings" },
      { name: "Stone Slate", hex: "#475569", rgb: "71, 85, 105", role: "Accent", usage: "Floorplan borders, metadata tags" },
      { name: "Granite Obsidian", hex: "#0F172A", rgb: "15, 23, 42", role: "Dark / Neutral", usage: "Contract typography, structural headers" },
      { name: "Marble White", hex: "#F8FAFC", rgb: "248, 250, 252", role: "Background / Light", usage: "Gallery and architectural showcase canvas" },
    ],
  },
};

// Default fallback lexicon
const DEFAULT_LEXICON: {
  prefixes: string[];
  roots: string[];
  suffixes: string[];
  adjectives: string[];
  colors: BrandColor[];
} = {
  prefixes: ["Omni", "Velo", "Aura", "Nova", "Zenith", "Apex", "Clari", "Veritas", "Sync", "Prime", "Lumi", "Nexus"],
  roots: ["spark", "flow", "core", "wave", "path", "forge", "pulse", "craft", "nest", "mark", "loop", "link"],
  suffixes: ["io", "ly", "ora", "ex", "is", "a", "on", "ify", "ix", "hub"],
  adjectives: ["Pioneering", "Dynamic", "Impactful", "Elevated", "Intuitive", "Resolute"],
  colors: [
    { name: "Vibrant Indigo", hex: "#6366F1", rgb: "99, 102, 241", role: "Primary", usage: "Brand logo, hero buttons, key accents" },
    { name: "Purple Iris", hex: "#8B5CF6", rgb: "139, 92, 246", role: "Secondary", usage: "Subheadings, badges, decorative elements" },
    { name: "Sky Azure", hex: "#38BDF8", rgb: "56, 189, 248", role: "Accent", usage: "Highlight details, active states" },
    { name: "Deep Charcoal", hex: "#0F172A", rgb: "15, 23, 42", role: "Dark / Neutral", usage: "Typography, dark backgrounds" },
    { name: "Soft White", hex: "#F8FAFC", rgb: "248, 250, 252", role: "Background / Light", usage: "Application background" },
  ],
};

function getLexicon(industry: string) {
  for (const [key, val] of Object.entries(INDUSTRY_LEXICONS)) {
    if (industry.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(industry.toLowerCase())) {
      return val;
    }
  }
  return DEFAULT_LEXICON;
}

// Deterministic seedable score calculation for consistent, explainable results
function calculateNameScore(
  name: string,
  category: NameCategory,
  industry: string,
  audience: string
): { memorability: number; pronunciation: number; relevance: number; overall: number; explanation: string } {
  const len = name.length;
  // Memorability: Short, punchy names score higher (6-8 chars is sweet spot)
  let mem = 85;
  if (len >= 4 && len <= 7) mem += 10;
  else if (len > 10) mem -= 8;
  if (/^[A-Z][a-z]+[A-Z]/.test(name) || /^[A-Z][a-z]+$/.test(name)) mem += 3;

  // Pronunciation: Alternating consonants and vowels score highest
  let pron = 88;
  const vowels = (name.match(/[aeiouy]/gi) || []).length;
  const ratio = vowels / len;
  if (ratio >= 0.35 && ratio <= 0.55) pron += 8;
  else pron -= 5;

  // Relevance: Matches category tone
  let rel = 90;
  if (category === "premium" || category === "professional") rel += 4;
  if (category === "invented") rel += 2;

  // Clamp 0-99
  mem = Math.min(98, Math.max(76, mem));
  pron = Math.min(99, Math.max(78, pron));
  rel = Math.min(98, Math.max(80, rel));
  const overall = Math.round(mem * 0.35 + pron * 0.3 + rel * 0.35);

  const explanations: Record<NameCategory, string> = {
    premium: `Scores ${overall}/100. High prestige index with acoustic resonance that commands authority in ${industry}. Exceptional executive recall and international trademark elasticity.`,
    short_catchy: `Scores ${overall}/100. Minimal syllable friction (${len} characters) ensures instantaneous phonetic recall among ${audience}. Outstanding word-of-mouth coefficient.`,
    modern: `Scores ${overall}/100. Clean, contemporary digital-native morphology. Perfectly tailored for mobile app icons, browser tabs, and modern omni-channel discovery.`,
    creative: `Scores ${overall}/100. High emotional resonance with intriguing linguistic storytelling. Evokes vivid mental imagery and distinct category differentiation.`,
    professional: `Scores ${overall}/100. Rooted in trustworthy lexical structures that project stability, institutional gravitas, and deep domain competence for ${industry}.`,
    invented: `Scores ${overall}/100. Highly distinct neologism with superior trademark protectability. Zero legacy baggage allows your brand to define its own category lexicon.`,
  };

  return {
    memorability: mem,
    pronunciation: pron,
    relevance: rel,
    overall,
    explanation: explanations[category] || `Solid brand fit with ${overall}/100 overall score.`,
  };
}

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "allinone", "also", "am", "an", "and", "any", "are",
  "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "build", "builds",
  "building", "but", "by", "can", "cannot", "could", "did", "do", "does", "doing", "down", "during", "each", "few",
  "for", "from", "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself",
  "his", "how", "i", "if", "in", "into", "instant", "instantly", "is", "it", "its", "itself", "just", "like", "make",
  "makes", "making", "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "one", "ones", "only",
  "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "platform", "platforms", "same", "she", "should",
  "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these",
  "they", "this", "those", "through", "to", "too", "tool", "tools", "under", "until", "up", "very", "was", "we", "were",
  "what", "when", "where", "which", "while", "who", "whom", "why", "with", "wont", "would", "you", "your", "yours",
  "business", "company", "service", "services", "system", "systems", "app", "application", "applications", "way", "ways"
]);

const HIGH_VALUE_BRAND_SEEDS = [
  "brand", "identity", "identities", "design", "designs", "naming", "name", "names", "asset", "assets",
  "studio", "visual", "visuals", "craft", "forge", "spark", "pulse", "nexus", "core",
  "learn", "edu", "skill", "skills", "academy", "mind", "intellect", "logic", "vector", "cortex",
  "apex", "vision", "flow", "stack", "vault", "sync", "cloud", "crest", "prime", "tech", "ai", "smart"
];

function extractDomainKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const cleanMap: Record<string, string> = {
    identities: "identity",
    naming: "brand",
    assets: "asset",
    designs: "design",
    learnings: "learn",
    educations: "edu",
    technologies: "tech",
  };

  const mapped = words.map((w) => cleanMap[w] || w);
  const unique = Array.from(new Set(mapped));

  // Prioritize high-value seeds
  const prioritized = unique.sort((a, b) => {
    const aVal = HIGH_VALUE_BRAND_SEEDS.includes(a) ? 1 : 0;
    const bVal = HIGH_VALUE_BRAND_SEEDS.includes(b) ? 1 : 0;
    return bVal - aVal;
  });

  return prioritized.length > 0 ? prioritized : ["brand", "spark", "vision", "core"];
}

// Generate algorithmic names per category
function generateAlgorithmicNames(input: GenerateNamesInput): GeneratedName[] {
  const lexicon = getLexicon(input.industry);
  const extractedKeywords = extractDomainKeywords(input.businessIdea);

  const k1 = input.keywordsInclude
    ? input.keywordsInclude.split(/[\s,]+/)[0].trim()
    : extractedKeywords[0] || lexicon.roots[0];
  const k2 = extractedKeywords[1] || lexicon.roots[1] || "core";
  const k3 = extractedKeywords[2] || lexicon.roots[2] || "pulse";

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const cK1 = capitalize(k1);
  const cK2 = capitalize(k2);
  const cK3 = capitalize(k3);

  const generatedList: GeneratedName[] = [];
  let idCounter = 1;

  // 1. Premium Names (4 names)
  const premiumBases = [
    `${lexicon.prefixes[0] || "Apex"}${cK1}`,
    `Aura${cK2}`,
    `${cK1} Capital`,
    `Vanguard ${cK3}`,
  ];
  premiumBases.forEach((name) => {
    const score = calculateNameScore(name, "premium", input.industry, input.targetAudience);
    generatedList.push({
      id: `name_p_${idCounter++}`,
      name,
      category: "premium",
      categoryLabel: CATEGORY_LABELS["premium"],
      meaning: `Derived from elite classical roots conveying prestige, enduring trust, and high-value leadership in ${input.industry}.`,
      reasoning: `Signals established quality and aspirational status to ${input.targetAudience}, establishing an immediate premium price positioning.`,
      style: "Prestige, Timeless, Architectural",
      score,
    });
  });

  // 2. Short & Catchy Names (4 names)
  const shortBases = [
    `${cK1.slice(0, 4)}o`,
    `${cK2.slice(0, 3)}ly`,
    `${lexicon.prefixes[1] || "Velo"}${cK1.slice(0, 3)}`,
    `${cK3.slice(0, 4)}x`,
  ];
  shortBases.forEach((name) => {
    const score = calculateNameScore(name, "short_catchy", input.industry, input.targetAudience);
    generatedList.push({
      id: `name_sc_${idCounter++}`,
      name,
      category: "short_catchy",
      categoryLabel: CATEGORY_LABELS["short_catchy"],
      meaning: `Punchy monosyllabic/bisyllabic structure optimized for rapid verbal adoption.`,
      reasoning: `Low cognitive load makes it effortless to type into browser search bars and whisper in casual recommendations.`,
      style: "Brisk, Vibrant, Direct",
      score,
    });
  });

  // 3. Modern Names (4 names)
  const modernBases = [
    `${cK1}stack`,
    `${cK2}flow`,
    `${lexicon.prefixes[2] || "Sync"}${cK1}`,
    `${cK3}base`,
  ];
  modernBases.forEach((name) => {
    const score = calculateNameScore(name, "modern", input.industry, input.targetAudience);
    generatedList.push({
      id: `name_m_${idCounter++}`,
      name,
      category: "modern",
      categoryLabel: CATEGORY_LABELS["modern"],
      meaning: `Reflects digital agility, modular scalability, and modern product experience.`,
      reasoning: `Appeals to forward-thinking users who value seamless execution and contemporary technological polish.`,
      style: "Sleek, Clean, Digital-First",
      score,
    });
  });

  // 4. Creative Names (4 names)
  const creativeBases = [
    `${cK1}Forge`,
    `Iron & ${cK2}`,
    `${lexicon.adjectives[0] || "Prism"} ${cK3}`,
    `${cK2} Canvas`,
  ];
  creativeBases.forEach((name) => {
    const score = calculateNameScore(name, "creative", input.industry, input.targetAudience);
    generatedList.push({
      id: `name_c_${idCounter++}`,
      name,
      category: "creative",
      categoryLabel: CATEGORY_LABELS["creative"],
      meaning: `Rich metaphorical imagery pairing functional competence with artistic expression.`,
      reasoning: `Builds a memorable narrative around the brand, making storytelling and PR campaigns organic and compelling.`,
      style: "Evocative, Expressive, Narrative",
      score,
    });
  });

  // 5. Professional Names (4 names)
  const profBases = [
    `${cK1} Dynamics`,
    `${cK2} Global Partners`,
    `${lexicon.prefixes[3] || "Veritas"} ${cK1}`,
    `${cK3} Strategic`,
  ];
  profBases.forEach((name) => {
    const score = calculateNameScore(name, "professional", input.industry, input.targetAudience);
    generatedList.push({
      id: `name_pr_${idCounter++}`,
      name,
      category: "professional",
      categoryLabel: CATEGORY_LABELS["professional"],
      meaning: `Built on institutional vocabulary that emphasizes security, proven results, and enterprise governance.`,
      reasoning: `Instills immediate confidence in risk-averse corporate buyers, investors, and regulatory stakeholders.`,
      style: "Authoritative, Corporate, Trust-First",
      score,
    });
  });

  // 6. Unique Invented Names (4 names)
  const inventedBases = [
    `${cK1.slice(0, 4)}ify`,
    `${cK2.slice(0, 3)}ora`,
    `Syn${cK3.slice(0, 3)}ix`,
    `Nov${cK1.slice(0, 3)}is`,
  ];
  inventedBases.forEach((name) => {
    const score = calculateNameScore(name, "invented", input.industry, input.targetAudience);
    generatedList.push({
      id: `name_inv_${idCounter++}`,
      name,
      category: "invented",
      categoryLabel: CATEGORY_LABELS["invented"],
      meaning: `Novel neologism formulated through balanced phonetic blending with zero prior cultural baggage.`,
      reasoning: `Offers maximum trademark availability and lets your business fully own Google search results and mental real estate.`,
      style: "Neologism, Trademarkable, Proprietary",
      score,
    });
  });

  return generatedList;
}

// Generate names via Gemini if available, with automatic fallback
export async function generateBusinessNames(input: GenerateNamesInput): Promise<GeneratedName[]> {
  const prompt = `You are BrandSpark, an elite world-class branding agency partner.
Generate 24 unique, creative, high-performing business names for:
- Business Idea: "${input.businessIdea}"
- Industry: "${input.industry}"
- Target Audience: "${input.targetAudience}"
- Tone & Personality: "${input.personality}"
- Language: "${input.language || "English"}"
- Keywords to include: "${input.keywordsInclude || "none specified"}"
- Keywords to exclude: "${input.keywordsExclude || "none"}"
- Preferred Length: "${input.nameLength || "any"}"

You MUST group the 24 names evenly across these exact 6 categories (4 names per category):
1. "premium" (Prestige, luxury, executive gravitas)
2. "short_catchy" (4-6 chars, punchy, memorable, phonetic)
3. "modern" (Tech-forward, digital native, modular)
4. "creative" (Metaphorical, artistic, storytelling)
5. "professional" (Authoritative, corporate, institutional trust)
6. "invented" (Unique neologisms, coined words, trademarkable)

Return ONLY valid JSON matching this exact structure:
{
  "names": [
    {
      "name": "BrandName",
      "category": "premium",
      "meaning": "Clear explanation of lexical root and symbolic meaning",
      "reasoning": "Why this resonates specifically with the target audience and industry",
      "style": "2-3 word style keywords",
      "score": {
        "memorability": 95,
        "pronunciation": 92,
        "relevance": 96,
        "overall": 94,
        "explanation": "Clearly explained AI-generated score covering recall, phonetics, and market fit"
      }
    }
  ]
}`;

  try {
    const rawResponse = await callGeminiGenerate(prompt, {
      customApiKey: input.customApiKey,
      jsonMode: true,
      systemInstruction: "You are an elite brand naming specialist and linguist. Output strictly valid JSON.",
      temperature: 0.85,
    });

    if (rawResponse) {
      const parsed = JSON.parse(rawResponse);
      if (Array.isArray(parsed.names) && parsed.names.length >= 6) {
        return parsed.names.map((n: Partial<GeneratedName>, idx: number) => {
          const category = (n.category as NameCategory) || "modern";
          return {
            id: `ai_name_${Date.now()}_${idx}`,
            name: n.name || `Brand${idx}`,
            category,
            categoryLabel: CATEGORY_LABELS[category] || "Brand Name",
            meaning: n.meaning || "Crafted for brand resonance.",
            reasoning: n.reasoning || "Optimized for target market engagement.",
            style: n.style || "Modern & Professional",
            score: {
              memorability: n.score?.memorability ?? 90,
              pronunciation: n.score?.pronunciation ?? 92,
              relevance: n.score?.relevance ?? 94,
              overall: n.score?.overall ?? 92,
              explanation: n.score?.explanation ?? "Comprehensive linguistic and memorability analysis.",
            },
          };
        });
      }
    }
  } catch (err) {
    console.warn("Gemini generation failed, using internal brand engine:", err);
  }

  // Fallback to our algorithmic engine
  return generateAlgorithmicNames(input);
}

// Slogan Generator
export async function generateSlogans(
  brandName: string,
  businessIdea: string,
  industry: string,
  customApiKey?: string
): Promise<GeneratedSlogan[]> {
  const prompt = `You are BrandSpark's chief copywriter.
Generate 12 captivating, memorable slogans for the brand "${brandName}".
- Business Idea: "${businessIdea}"
- Industry: "${industry}"

Provide 2 distinct slogans for each of these 6 styles:
1. "professional" (Authoritative, trustworthy, B2B clarity)
2. "funny" (Clever, witty, charmingly playful)
3. "emotional" (Heartfelt, human, resonant, touching)
4. "luxury" (Understated, elite, refined, prestigious)
5. "minimalist" (Ultra-terse, 2-3 words, punchy impact)
6. "inspirational" (Empowering, visionary, rallying cry)

Return ONLY valid JSON matching this structure:
{
  "slogans": [
    {
      "text": "Slogan text here",
      "style": "professional",
      "explanation": "Detailed rationale for why this works psychologically"
    }
  ]
}`;

  try {
    const raw = await callGeminiGenerate(prompt, {
      customApiKey,
      jsonMode: true,
      systemInstruction: "You are an elite advertising copywriter. Output strictly valid JSON.",
      temperature: 0.85,
    });

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.slogans) && parsed.slogans.length >= 4) {
        return parsed.slogans.map((s: Partial<GeneratedSlogan>, idx: number) => {
          const style = (s.style as SloganStyle) || "professional";
          return {
            id: `slogan_${Date.now()}_${idx}`,
            text: s.text || "Where Vision Meets Velocity",
            style,
            styleLabel: SLOGAN_STYLE_LABELS[style] || "Slogan",
            explanation: s.explanation || "Positioned to maximize audience retention.",
          };
        });
      }
    }
  } catch (err) {
    console.warn("Gemini slogan generation fallback:", err);
  }

  // Algorithmic fallback slogans
  const fallbackSlogans: { text: string; style: SloganStyle; explanation: string }[] = [
    {
      text: `Empowering ${industry} With Unrivaled Precision.`,
      style: "professional",
      explanation: "Directly communicates domain mastery and operational excellence to corporate decision-makers.",
    },
    {
      text: `The Smarter Standard for Modern ${industry}.`,
      style: "professional",
      explanation: "Sets an industry benchmark, framing competitors as legacy alternatives.",
    },
    {
      text: `Finally, ${industry} that doesn't make your head hurt.`,
      style: "funny",
      explanation: "Breaks commercial stuffiness by validating the user's authentic daily frustration with witty honesty.",
    },
    {
      text: `We take your business seriously. Ourselves? Not so much.`,
      style: "funny",
      explanation: "Disarming humor that makes the company deeply approachable while signaling technical confidence.",
    },
    {
      text: `Built for the moments that truly matter to you.`,
      style: "emotional",
      explanation: "Taps into empathy and personal human connection rather than dry transactional features.",
    },
    {
      text: `Because your dream deserves to be heard.`,
      style: "emotional",
      explanation: "Creates an intimate bond by acknowledging the customer's deeper aspirations and emotional stakes.",
    },
    {
      text: `Defined by discretion. Distinguished by craft.`,
      style: "luxury",
      explanation: "Employs quiet luxury syntax that avoids aggressive marketing and appeals to elite discernment.",
    },
    {
      text: `The art of refined ${industry}.`,
      style: "luxury",
      explanation: "Elevates functional utility into a bespoke artistic pursuit.",
    },
    {
      text: `Simply Better.`,
      style: "minimalist",
      explanation: "Uncompromising brevity that projects ultimate confidence and frictionless execution.",
    },
    {
      text: `Think Forward.`,
      style: "minimalist",
      explanation: "Two-word imperative that challenges the status quo and commands forward momentum.",
    },
    {
      text: `Dare to build what has never been seen.`,
      style: "inspirational",
      explanation: "Acts as an empowering manifesto that recruits customers into a forward-looking movement.",
    },
    {
      text: `Your horizon is wider than you think.`,
      style: "inspirational",
      explanation: "Inspires optimism and unleashes user potential through your brand ecosystem.",
    },
  ];

  return fallbackSlogans.map((s, idx) => ({
    id: `slogan_algo_${Date.now()}_${idx}`,
    text: s.text,
    style: s.style,
    styleLabel: SLOGAN_STYLE_LABELS[s.style],
    explanation: s.explanation,
  }));
}

// Brand Identity Studio Generator
export async function generateBrandIdentity(
  brandName: string,
  businessIdea: string,
  industry: string,
  audience: string,
  tone: string,
  customApiKey?: string
): Promise<BrandIdentity> {
  const prompt = `You are BrandSpark's Chief Brand Officer.
Create a comprehensive, cohesive, professional brand identity kit for:
- Brand Name: "${brandName}"
- Business Idea: "${businessIdea}"
- Industry: "${industry}"
- Target Audience: "${audience}"
- Brand Personality: "${tone}"

Return strictly valid JSON with this exact schema:
{
  "brandName": "${brandName}",
  "marketingTagline": "A punchy 5-8 word marketing tagline",
  "story": "A compelling 3-paragraph brand origin story",
  "mission": "Clear 1-2 sentence corporate mission statement",
  "vision": "Inspiring 1-2 sentence long-term vision statement",
  "values": [
    {
      "title": "Value Name (e.g., Uncompromising Craft)",
      "description": "How this value guides decisions",
      "iconName": "Shield"
    }
  ],
  "colorPalette": [
    {
      "name": "Color Name",
      "hex": "#6366F1",
      "rgb": "99, 102, 241",
      "role": "Primary",
      "usage": "Where to use"
    }
  ],
  "typography": {
    "headerFont": "Outfit",
    "bodyFont": "Inter",
    "fontPairingExplanation": "Why these two fonts pair perfectly together",
    "headerFontUrl": "https://fonts.google.com/specimen/Outfit",
    "bodyFontUrl": "https://fonts.google.com/specimen/Inter"
  },
  "brandVoice": {
    "toneSpectrum": [
      { "label": "Formal vs Casual", "left": "Formal", "right": "Casual", "value": 6 },
      { "label": "Technical vs Accessible", "left": "Technical", "right": "Accessible", "value": 7 },
      { "label": "Reserved vs Energetic", "left": "Reserved", "right": "Energetic", "value": 8 },
      { "label": "Traditional vs Innovative", "left": "Traditional", "right": "Innovative", "value": 9 }
    ],
    "dos": ["Write in active voice", "Be concise and clear", "Speak directly to customer benefits"],
    "donts": ["Avoid buzzword soup", "Don't sound overly bureaucratic", "Never make unsubstantiated claims"]
  },
  "socialBios": [
    { "platform": "Instagram", "bio": "Short bio with emojis and call to action", "charCount": 130 },
    { "platform": "Twitter / X", "bio": "Punchy 160-char bio with hashtag", "charCount": 140 },
    { "platform": "LinkedIn", "bio": "Professional company summary for B2B followers", "charCount": 240 }
  ],
  "logoConcepts": [
    {
      "style": "Modern Geometric",
      "description": "An intersecting gradient monogram capturing speed and synergy",
      "symbolism": "Represents the bridge between ambition and execution"
    },
    {
      "style": "Minimalist Wordmark",
      "description": "High-contrast geometric grotesque typography with customized ligature",
      "symbolism": "Understated authority and timeless precision"
    },
    {
      "style": "Abstract Emblem",
      "description": "A dynamic orbital spark enclosed in an open hexagonal shield",
      "symbolism": "Continuous evolution and bulletproof reliability"
    }
  ]
}`;

  try {
    const raw = await callGeminiGenerate(prompt, {
      customApiKey,
      jsonMode: true,
      systemInstruction: "You are an elite brand design director. Output strictly valid JSON.",
      temperature: 0.8,
    });

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.brandName && parsed.story && parsed.colorPalette) {
        return parsed as BrandIdentity;
      }
    }
  } catch (err) {
    console.warn("Gemini brand identity fallback:", err);
  }

  // Algorithmic Fallback Brand Identity
  const lexicon = getLexicon(industry);

  return {
    brandName,
    marketingTagline: `The Next Standard in ${industry}. Built for ${audience}.`,
    story: `${brandName} was born from a fundamental observation: while the world of ${industry.toLowerCase()} moved at lightning speed, the customer experience remained fragmented, cumbersome, and uninspired.\n\nOur founders brought together veteran engineers, creative strategists, and domain specialists to rethink the status quo from first principles. What began as a bold prototype quickly transformed into a holistic platform engineered to eliminate friction and empower creators.\n\nToday, ${brandName} serves thousands of forward-thinking innovators who refuse to settle for the ordinary. We believe that when you combine relentless craftsmanship with intuitive intelligence, transformative breakthroughs naturally follow.`,
    mission: `To empower ${audience.toLowerCase()} with seamless, intelligent solutions that transform everyday challenges into competitive advantages.`,
    vision: `To be the global benchmark of excellence and innovation in ${industry.toLowerCase()}, fostering a world where ambition is instantly realized.`,
    values: [
      {
        title: "Relentless Craftsmanship",
        description: "We obsess over the invisible details, ensuring that every touchpoint delivers flawless speed and tactile joy.",
        iconName: "Sparkles",
      },
      {
        title: "Transparent Trust",
        description: "Integrity is our foundational currency. We build open, accountable systems that put our community first.",
        iconName: "ShieldCheck",
      },
      {
        title: "Velocity with Purpose",
        description: "We move fast not to rush, but to rapidly learn, adapt, and bring the future into present reality.",
        iconName: "Zap",
      },
      {
        title: "Human-Centric Empathy",
        description: "Technology exists in service of people. Every feature we launch begins with deep listening and understanding.",
        iconName: "Heart",
      },
    ],
    colorPalette: lexicon.colors,
    typography: {
      headerFont: "Outfit",
      bodyFont: "Inter",
      fontPairingExplanation: "Outfit provides a crisp, contemporary geometric headline presence with generous apertures, while Inter delivers unparalleled micro-typography clarity and legibility across all screen densities.",
      headerFontUrl: "https://fonts.google.com/specimen/Outfit",
      bodyFontUrl: "https://fonts.google.com/specimen/Inter",
    },
    brandVoice: {
      toneSpectrum: [
        { label: "Formal vs Casual", left: "Formal", right: "Casual", value: 6 },
        { label: "Technical vs Accessible", left: "Technical", right: "Accessible", value: 8 },
        { label: "Reserved vs Energetic", left: "Reserved", right: "Energetic", value: 7 },
        { label: "Traditional vs Innovative", left: "Traditional", right: "Innovative", value: 9 },
      ],
      dos: [
        `Lead with real customer outcomes rather than abstract feature specifications.`,
        `Maintain an energetic, welcoming, and confident conversational rhythm.`,
        `Use active verbs and concise, punchy sentence constructions.`,
      ],
      donts: [
        `Never hide behind dense corporate jargon or vague buzzwords.`,
        `Avoid passive voice constructions that obscure accountability.`,
        `Don't disparage competitors; let superior craftsmanship speak for itself.`,
      ],
    },
    socialBios: [
      {
        platform: "Instagram",
        bio: `✨ Shaping the future of ${industry.toLowerCase()}.\n⚡ Built for ${audience.toLowerCase()}.\n👇 Start your journey with ${brandName}:`,
        charCount: 122,
      },
      {
        platform: "Twitter / X",
        bio: `The modern standard for ${industry.toLowerCase()}. Empowering ${audience.toLowerCase()} to build faster, smarter, and bolder. Join the movement. 🚀`,
        charCount: 148,
      },
      {
        platform: "LinkedIn",
        bio: `${brandName} is a pioneer in ${industry.toLowerCase()}, delivering next-generation tools engineered for high-performance organizations and ${audience.toLowerCase()}. Discover our story and open roles.`,
        charCount: 198,
      },
      {
        platform: "General",
        bio: `${brandName} — Next-generation ${industry.toLowerCase()} solutions crafted for modern leaders.`,
        charCount: 92,
      },
    ],
    logoConcepts: [
      {
        style: "Modern Geometric",
        description: `A precision-machined vector mark intertwining a dynamic spark with an infinite horizon line.`,
        symbolism: `Signifies uninterrupted momentum, breakthrough ingenuity, and forward trajectory.`,
      },
      {
        style: "Minimalist Wordmark",
        description: `Custom-kerning bold grotesque typography with a subtly customized crossbar on the capital '${brandName.charAt(0)}'.`,
        symbolism: `Exudes executive stature, digital mastery, and timeless design purity.`,
      },
      {
        style: "Abstract Emblem",
        description: `Dual gradient facets rotating in synchronized harmony to form a protective modern prism.`,
        symbolism: `Communicates institutional resilience and multifaceted capability.`,
      },
    ],
  };
}
