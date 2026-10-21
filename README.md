# BrandSpark — Advanced AI Branding Platform ⚡

**BrandSpark** is a complete, modern, responsive, AI-powered web platform designed to transform raw business ideas into category-defining brand identities in seconds.

---

## 🚀 Key Features

### 1. Premium SaaS-Style Interface & Design
- Clean white aesthetic with deep blue-violet accents (`#6366F1`, `#8B5CF6`, `#4F46E5`), rounded cards, subtle shadows, and smooth micro-animations.
- Fully responsive across desktop, tablet, and mobile breakpoints.
- Professional landing page with headline: **"Your Next Big Brand Starts Here."**
- Unified sidebar dashboard, modern navigation, persistent dark mode toggle, and rich toast notifications.

### 2. Real User Authentication & Profiles
- Functional sign-up, login, logout, and forgot-password flows.
- Passwords securely hashed with `bcryptjs` and session tokens cryptographically signed via `jsonwebtoken`.
- Real database persistence in `data/brandspark-db.json` with user profiles and password reset tokens.

### 3. AI Business Name Generator
- Inputs: Business idea, industry/product type, target audience, preferred language, brand personality, keywords to include/exclude, and preferred name length.
- Generates 20–24 creative names per request grouped across 6 strategic dimensions:
  1. **Premium Names** (Prestige, luxury, executive gravitas)
  2. **Short & Catchy Names** (4–6 chars, punchy, minimal phonotactic friction)
  3. **Modern Names** (Tech-forward, modular, digital-native)
  4. **Creative Names** (Metaphorical, artistic, narrative-driven)
  5. **Professional Names** (Authoritative, institutional trust)
  6. **Unique Invented Names** (Novel neologisms, maximum trademark elasticity)
- Detailed score breakdown for every name (Memorability, Phonetic Pronounceability, Industry Relevance, and Overall Score) with comprehensive AI explanation.
- Actions: Favorite, Copy, Compare, Inline Edit, and Regenerate.

### 4. AI Slogan & Tagline Generator
- Generates multiple catchy slogans for any selected business name.
- 6 distinct emotional registers:
  - **Professional & Authoritative**
  - **Clever & Playful**
  - **Emotional & Heartfelt**
  - **Quiet Luxury**
  - **Ultra-Minimalist**
  - **Bold & Inspirational**
- Actions: Edit inline, copy, favorite, and apply directly to Brand Studio.

### 5. Brand Identity Studio
- Origin story narrative (3 compelling paragraphs).
- Official corporate Mission & Vision statements.
- Foundational brand values with icons and guidelines.
- 5-Token Color Palette with HEX and RGB codes, click-to-copy, and usage guidelines.
- Typography recommendations (Headline font + Body font pairings with Google Fonts links).
- Brand voice guidelines (4-axis tone spectrum sliders + Do's & Don'ts).
- Platform-optimized social media bios (Instagram, Twitter/X, LinkedIn).
- **Interactive Live Brand Preview Mockups**:
  - Responsive Website Hero Header
  - Sleek Business Card (Front & Back)
  - Social Media Banner

### 6. Vector Logo Studio
- 5 Composition Styles: Minimalist Clean, Geometric Gradient, Circular Emblem, Bold Monogram, Typographic Modern.
- 8 Precision Geometric Symbols: Sparkle, Isometric Cube, Hexagon Shield, Security Shield, Momentum Flame, Orbital Rings, Letter Initial, and Prestige Crown.
- Real SVG Vector download and 1200x600 high-resolution PNG export.

### 7. Live Domain & Social Media Verification
- Never claims available without verification.
- Authoritative DNS queries via Cloudflare DNS over HTTPS (DoH) and RDAP registry checks across `.com`, `.io`, `.ai`, `.co`, `.app`, `.store`, `.tech`, `.org`.
- Live username lookups across GitHub, YouTube, and direct check links for Twitter/X, Instagram, and LinkedIn.

### 8. Brand Comparison Matrix
- Side-by-side comparison matrix for up to 5 shortlisted brand names.
- Compares memorability, phonetics, industry relevance, acoustics, and domain availability.
- One-click "Select as Final Winner 🏆" button to promote name directly to Brand Studio.

### 9. Persistent Saved Projects Hub
- Create, rename, duplicate, and delete multiple branding projects.
- Persisted in real local database with user-level isolation.
- Continue editing saved brands across sessions.

### 10. Spark AI Assistant
- Context-aware conversational AI assistant drawer that understands the current active project.
- Instant action suggestion chips ("Make this name shorter", "Suggest a luxury slogan", "Compare top names").
- Powered by Google Gemini API with fallback to internal linguistic strategist.

### 11. Export Branding Kit
- **Official Brand Guidelines Book (.PDF)**: Real multi-page vector PDF generated client-side using `jspdf`.
- **Vector Brandmark (.SVG)**: Pure vector file for web and print.
- **Design Tokens Specification (.JSON)**: Structured JSON design tokens.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **Security & Auth**: bcryptjs, jsonwebtoken
- **AI Integration**: Google GenAI SDK (`@google/genai` / `@google/generative-ai`), REST API, & Hybrid Neural-Algorithmic Brand Engine
- **Verification**: Cloudflare DNS over HTTPS, Node.js DNS, RDAP

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22.14.0)
- npm 10+

### Installation & Run

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set up your `.env` file:
```bash
cp .env.example .env
```
Add your optional `GEMINI_API_KEY`. (Note: BrandSpark has a built-in algorithmic engine and also allows entering an API key directly in the UI settings).

3. Run the development server:
```bash
npm run dev
```

4. Or build and run the production server:
```bash
npm run build
npm run start
```

5. Open your browser at [http://localhost:3000](http://localhost:3000).

---

## 🔒 Security & Data Privacy

- Passwords are never stored in plaintext (salted bcrypt hash).
- JWT session tokens use HTTP-only cookies and Authorization headers.
- API keys are never exposed in client bundles.
