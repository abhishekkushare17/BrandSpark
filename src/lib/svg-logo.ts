import { LogoConfig, LogoStyleType } from "@/types";

export function generateSvgLogo(config: {
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
  showSlogan?: boolean;
}): string {
  const { brandName, slogan, style, colorScheme, iconShape, showSlogan } = config;
  const initial = (brandName || "B").charAt(0).toUpperCase();
  const cleanName = brandName || "BrandSpark";
  const cleanSlogan = slogan || "Excellence in Motion";

  // Generate unique gradients IDs
  const gradId = `grad_${Math.random().toString(36).substring(2, 8)}`;
  const grad2Id = `grad2_${Math.random().toString(36).substring(2, 8)}`;

  // SVG Icon Shapes
  let iconSvg = "";
  switch (iconShape) {
    case "spark":
      iconSvg = `
        <path d="M 50 10 Q 50 50 90 50 Q 50 50 50 90 Q 50 50 10 50 Q 50 50 50 10 Z" fill="url(#${gradId})" />
        <circle cx="50" cy="50" r="10" fill="${colorScheme.accent}" />
        <circle cx="75" cy="25" r="4" fill="url(#${grad2Id})" />
      `;
      break;
    case "cube":
      iconSvg = `
        <polygon points="50,15 85,35 85,70 50,90 15,70 15,35" fill="none" stroke="url(#${gradId})" stroke-width="4" stroke-linejoin="round"/>
        <polyline points="15,35 50,55 85,35" fill="none" stroke="url(#${gradId})" stroke-width="3" />
        <line x1="50" y1="55" x2="50" y2="90" stroke="url(#${gradId})" stroke-width="3" />
        <polygon points="50,15 85,35 50,55 15,35" fill="${colorScheme.primary}" opacity="0.15" />
        <polygon points="50,55 85,35 85,70 50,90" fill="${colorScheme.secondary}" opacity="0.3" />
      `;
      break;
    case "hexagon":
      iconSvg = `
        <polygon points="50,12 86,32 86,72 50,92 14,72 14,32" fill="url(#${gradId})" />
        <polygon points="50,24 76,39 76,69 50,84 24,69 24,39" fill="${colorScheme.background || "#ffffff"}" opacity="0.9" />
        <circle cx="50" cy="54" r="14" fill="url(#${grad2Id})" />
      `;
      break;
    case "shield":
      iconSvg = `
        <path d="M 50 12 Q 78 18 84 32 C 84 65 65 85 50 92 C 35 85 16 65 16 32 Q 22 18 50 12 Z" fill="url(#${gradId})" />
        <path d="M 50 20 L 76 35 C 76 60 62 76 50 82 Z" fill="${colorScheme.accent}" opacity="0.4" />
        <circle cx="50" cy="46" r="8" fill="#ffffff" />
      `;
      break;
    case "flame":
      iconSvg = `
        <path d="M 50 15 C 65 35 82 50 82 68 C 82 84 68 94 50 94 C 32 94 18 84 18 68 C 18 50 35 38 42 26 C 45 40 54 46 54 54 C 54 62 48 66 44 66 C 40 66 38 62 38 62 C 38 72 44 80 52 80 C 62 80 70 72 70 60 C 70 45 58 35 50 15 Z" fill="url(#${gradId})" />
      `;
      break;
    case "circle_orbit":
      iconSvg = `
        <circle cx="50" cy="50" r="34" fill="none" stroke="url(#${gradId})" stroke-width="6" stroke-dasharray="140 20" />
        <circle cx="50" cy="50" r="20" fill="url(#${grad2Id})" />
        <circle cx="78" cy="30" r="7" fill="${colorScheme.accent}" />
      `;
      break;
    case "letter":
      iconSvg = `
        <rect x="18" y="18" width="64" height="64" rx="16" fill="url(#${gradId})" />
        <text x="50" y="62" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${initial}</text>
      `;
      break;
    case "crown":
      iconSvg = `
        <polygon points="20,74 80,74 86,34 65,52 50,22 35,52 14,34" fill="url(#${gradId})" />
        <rect x="20" y="78" width="60" height="8" rx="4" fill="${colorScheme.accent}" />
        <circle cx="50" cy="18" r="4" fill="${colorScheme.accent}" />
        <circle cx="14" cy="30" r="3" fill="${colorScheme.accent}" />
        <circle cx="86" cy="30" r="3" fill="${colorScheme.accent}" />
      `;
      break;
  }

  // Layout styles
  if (style === "minimalist") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 140" width="100%" height="100%">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorScheme.primary}" />
          <stop offset="100%" stop-color="${colorScheme.secondary}" />
        </linearGradient>
        <linearGradient id="${grad2Id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorScheme.secondary}" />
          <stop offset="100%" stop-color="${colorScheme.accent}" />
        </linearGradient>
      </defs>
      <rect width="500" height="140" rx="16" fill="${colorScheme.background || "transparent"}" />
      <g transform="translate(30, 20) scale(1)">
        ${iconSvg}
      </g>
      <text x="145" y="${showSlogan ? "64" : "78"}" font-family="Outfit, Inter, system-ui, sans-serif" font-weight="800" font-size="40" fill="${colorScheme.textColor}" letter-spacing="-0.5px">${cleanName}</text>
      ${
        showSlogan
          ? `<text x="147" y="94" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="14" fill="${colorScheme.textColor}" opacity="0.65" letter-spacing="1.5px">${cleanSlogan.toUpperCase()}</text>`
          : ""
      }
    </svg>`;
  }

  if (style === "geometric") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 140" width="100%" height="100%">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${colorScheme.primary}" />
          <stop offset="100%" stop-color="${colorScheme.accent}" />
        </linearGradient>
        <linearGradient id="${grad2Id}" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${colorScheme.secondary}" />
          <stop offset="100%" stop-color="${colorScheme.primary}" />
        </linearGradient>
      </defs>
      <rect width="500" height="140" rx="16" fill="${colorScheme.background || "transparent"}" />
      <g transform="translate(35, 20) scale(1)">
        ${iconSvg}
      </g>
      <text x="150" y="${showSlogan ? "66" : "80"}" font-family="Outfit, sans-serif" font-weight="800" font-size="42" fill="url(#${gradId})" letter-spacing="-1px">${cleanName}</text>
      ${
        showSlogan
          ? `<text x="152" y="96" font-family="Inter, sans-serif" font-weight="600" font-size="13" fill="${colorScheme.textColor}" opacity="0.6" letter-spacing="2px">${cleanSlogan.toUpperCase()}</text>`
          : ""
      }
    </svg>`;
  }

  if (style === "emblem") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 340" width="100%" height="100%">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorScheme.primary}" />
          <stop offset="100%" stop-color="${colorScheme.secondary}" />
        </linearGradient>
        <linearGradient id="${grad2Id}" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${colorScheme.secondary}" />
          <stop offset="100%" stop-color="${colorScheme.accent}" />
        </linearGradient>
      </defs>
      <rect width="340" height="340" rx="24" fill="${colorScheme.background || "transparent"}" />
      <circle cx="170" cy="170" r="145" fill="none" stroke="${colorScheme.primary}" stroke-width="2" opacity="0.3"/>
      <circle cx="170" cy="170" r="135" fill="none" stroke="url(#${gradId})" stroke-width="4"/>
      <g transform="translate(120, 60) scale(1)">
        ${iconSvg}
      </g>
      <text x="170" y="210" font-family="Outfit, sans-serif" font-weight="800" font-size="30" fill="${colorScheme.textColor}" text-anchor="middle" letter-spacing="1px">${cleanName.toUpperCase()}</text>
      <line x1="80" y1="225" x2="260" y2="225" stroke="${colorScheme.accent}" stroke-width="2" opacity="0.5"/>
      <text x="170" y="248" font-family="Inter, sans-serif" font-weight="600" font-size="12" fill="${colorScheme.textColor}" text-anchor="middle" opacity="0.75" letter-spacing="3px">${cleanSlogan.toUpperCase()}</text>
    </svg>`;
  }

  if (style === "monogram") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 140" width="100%" height="100%">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorScheme.primary}" />
          <stop offset="100%" stop-color="${colorScheme.accent}" />
        </linearGradient>
      </defs>
      <rect width="450" height="140" rx="16" fill="${colorScheme.background || "transparent"}" />
      <g transform="translate(30, 20)">
        <rect width="100" height="100" rx="20" fill="url(#${gradId})" />
        <text x="50" y="68" font-family="Outfit, sans-serif" font-weight="900" font-size="54" fill="#ffffff" text-anchor="middle">${initial}</text>
      </g>
      <text x="155" y="${showSlogan ? "66" : "80"}" font-family="Outfit, sans-serif" font-weight="800" font-size="38" fill="${colorScheme.textColor}" letter-spacing="-0.5px">${cleanName}</text>
      ${
        showSlogan
          ? `<text x="157" y="94" font-family="Inter, sans-serif" font-weight="500" font-size="14" fill="${colorScheme.textColor}" opacity="0.6">${cleanSlogan}</text>`
          : ""
      }
    </svg>`;
  }

  // Default typographic
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 140" width="100%" height="100%">
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${colorScheme.primary}" />
        <stop offset="100%" stop-color="${colorScheme.secondary}" />
      </linearGradient>
      <linearGradient id="${grad2Id}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${colorScheme.secondary}" />
        <stop offset="100%" stop-color="${colorScheme.accent}" />
      </linearGradient>
    </defs>
    <rect width="460" height="140" rx="16" fill="${colorScheme.background || "transparent"}" />
    <circle cx="50" cy="70" r="28" fill="url(#${gradId})" />
    <text x="50" y="78" font-family="Outfit, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">${initial}</text>
    <text x="96" y="${showSlogan ? "66" : "80"}" font-family="Outfit, sans-serif" font-weight="900" font-size="44" fill="${colorScheme.textColor}" letter-spacing="-1px">${cleanName}</text>
    <circle cx="${96 + cleanName.length * 24 + 4}" cy="${showSlogan ? "58" : "72"}" r="6" fill="${colorScheme.accent}" />
    ${
      showSlogan
        ? `<text x="98" y="94" font-family="Inter, sans-serif" font-weight="500" font-size="14" fill="${colorScheme.textColor}" opacity="0.65" letter-spacing="1px">${cleanSlogan}</text>`
        : ""
    }
  </svg>`;
}
