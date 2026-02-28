import type { TransformationDescriptor, FilterState } from '../types/editor';

interface ParsedTransformation {
  descriptor: TransformationDescriptor;
  filterChanges: Partial<FilterState>;
  overlayEffect?: {
    type: 'vignette' | 'gradient' | 'color';
    color?: string;
    opacity?: number;
    direction?: string;
  };
  description: string;
}

const COLOR_MAP: Record<string, string> = {
  red: '#ff4444',
  blue: '#4488ff',
  green: '#44bb44',
  yellow: '#ffdd44',
  orange: '#ff8844',
  purple: '#aa44ff',
  pink: '#ff44aa',
  cyan: '#44ddff',
  teal: '#44bbaa',
  white: '#ffffff',
  black: '#000000',
  gray: '#888888',
  brown: '#885533',
  gold: '#ffcc00',
  silver: '#cccccc',
};

export function parsePrompt(prompt: string): ParsedTransformation {
  const lower = prompt.toLowerCase();
  const filterChanges: Partial<FilterState> = {};
  let overlayEffect: ParsedTransformation['overlayEffect'] | undefined;
  let description = '';
  const effects: string[] = [];

  // Brightness
  if (/\b(brighten|brighter|bright|lighten|lighter|increase brightness)\b/.test(lower)) {
    filterChanges.brightness = 140;
    effects.push('brightened');
  } else if (/\b(darken|darker|dark|dim|decrease brightness)\b/.test(lower)) {
    filterChanges.brightness = 60;
    effects.push('darkened');
  }

  // Contrast
  if (/\b(high contrast|increase contrast|more contrast|vivid)\b/.test(lower)) {
    filterChanges.contrast = 150;
    effects.push('high contrast');
  } else if (/\b(low contrast|decrease contrast|less contrast|soft)\b/.test(lower)) {
    filterChanges.contrast = 70;
    effects.push('low contrast');
  }

  // Saturation
  if (/\b(saturate|vibrant|colorful|vivid colors|boost colors)\b/.test(lower)) {
    filterChanges.saturation = 180;
    effects.push('saturated');
  } else if (/\b(desaturate|muted|dull|fade colors|less color)\b/.test(lower)) {
    filterChanges.saturation = 40;
    effects.push('desaturated');
  }

  // Grayscale / Black & White
  if (/\b(grayscale|greyscale|black and white|black & white|b&w|monochrome|bw)\b/.test(lower)) {
    filterChanges.grayscale = 100;
    effects.push('grayscale');
  }

  // Sepia
  if (/\b(sepia|vintage|old photo|retro|antique|aged)\b/.test(lower)) {
    filterChanges.sepia = 80;
    effects.push('sepia');
  }

  // Blur
  if (/\b(blur|blurry|soft focus|out of focus|dreamy)\b/.test(lower)) {
    const match = lower.match(/blur\s+(\d+)/);
    filterChanges.blur = match ? parseInt(match[1]) : 4;
    effects.push('blurred');
  }

  // Sharpen (reduce blur)
  if (/\b(sharpen|sharp|crisp|clear)\b/.test(lower)) {
    filterChanges.blur = 0;
    filterChanges.contrast = (filterChanges.contrast ?? 100) + 20;
    effects.push('sharpened');
  }

  // Hue rotation
  if (/\b(warm|warm tone|warmer|golden hour|sunset glow|sunset)\b/.test(lower)) {
    filterChanges.hueRotate = -20;
    filterChanges.saturation = (filterChanges.saturation ?? 100) + 20;
    filterChanges.brightness = (filterChanges.brightness ?? 100) + 10;
    effects.push('warm tone');
  } else if (/\b(cool|cool tone|cooler|cold|icy|winter)\b/.test(lower)) {
    filterChanges.hueRotate = 20;
    effects.push('cool tone');
  }

  // Vignette
  if (/\b(vignette|dark edges|darken edges|cinematic)\b/.test(lower)) {
    overlayEffect = { type: 'vignette', opacity: 0.6 };
    effects.push('vignette');
  }

  // Color overlays
  for (const [colorName, colorHex] of Object.entries(COLOR_MAP)) {
    const regex = new RegExp(`\\b(${colorName} (tint|overlay|wash|hue|tone)|tint (with |in )?${colorName}|${colorName} filter)\\b`);
    if (regex.test(lower)) {
      overlayEffect = { type: 'color', color: colorHex, opacity: 0.25 };
      effects.push(`${colorName} overlay`);
      break;
    }
  }

  // Gradient overlays
  if (/\b(gradient|fade|gradient overlay)\b/.test(lower)) {
    let color = '#000000';
    for (const [colorName, colorHex] of Object.entries(COLOR_MAP)) {
      if (lower.includes(colorName)) { color = colorHex; break; }
    }
    overlayEffect = { type: 'gradient', color, opacity: 0.4, direction: 'bottom' };
    effects.push('gradient overlay');
  }

  // Opacity
  if (/\b(transparent|translucent|fade out|ghost)\b/.test(lower)) {
    filterChanges.opacity = 60;
    effects.push('faded');
  }

  // Dramatic / cinematic
  if (/\b(dramatic|cinematic|movie|film)\b/.test(lower)) {
    filterChanges.contrast = (filterChanges.contrast ?? 100) + 30;
    filterChanges.saturation = (filterChanges.saturation ?? 100) - 20;
    overlayEffect = overlayEffect ?? { type: 'vignette', opacity: 0.5 };
    effects.push('cinematic');
  }

  // Neon / glow
  if (/\b(neon|glow|glowing|electric)\b/.test(lower)) {
    filterChanges.saturation = 200;
    filterChanges.brightness = 120;
    filterChanges.contrast = 130;
    effects.push('neon glow');
  }

  // Faded / matte
  if (/\b(matte|faded|fade|washed out|pastel)\b/.test(lower)) {
    filterChanges.contrast = 80;
    filterChanges.saturation = 70;
    filterChanges.brightness = 110;
    effects.push('matte');
  }

  // Night / dark mode
  if (/\b(night|nighttime|dark mode|moody)\b/.test(lower)) {
    filterChanges.brightness = 50;
    filterChanges.contrast = 120;
    filterChanges.saturation = 80;
    effects.push('night mode');
  }

  // Invert
  if (/\b(invert|negative|inverted)\b/.test(lower)) {
    filterChanges.hueRotate = 180;
    filterChanges.saturation = 100;
    effects.push('inverted');
  }

  description = effects.length > 0
    ? `Applied: ${effects.join(', ')}`
    : 'No recognized effects found in prompt';

  const descriptor: TransformationDescriptor = {
    type: effects.length > 0 ? effects[0] : 'none',
    filters: filterChanges,
    overlay: overlayEffect,
  };

  return { descriptor, filterChanges, overlayEffect, description };
}
