import { type Range } from './number.js';

export const COLOR_REGEX = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^)]*\)/i;
export const COLOR_HEX_REGEX = /^#([0-9a-f]{3}){1,2}$/i;
export const COLOR_RGB_REGEX = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i;
export const COLOR_RGBA_REGEX = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(\.\d+)?)\)$/i;
export const COLOR_HSL_REGEX = /^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/i;
export const COLOR_HSLA_REGEX = /^hsla\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d+(\.\d+)?)\)$/i;
export const COLOR_HEX_TO_RGB_REGEX = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i;

export type Red = Range<0, 256>;
export type Green = Range<0, 256>;
export type Blue = Range<0, 256>;
export type Alpha = Range<0, 101>;
export type Hue = Range<0, 361>;
export type Saturation = Range<0, 101>;
export type Lightness = Range<0, 101>;
export type Cyan = Range<0, 101>;
export type Magenta = Range<0, 101>;
export type Yellow = Range<0, 101>;
export type Black = Range<0, 101>;

export type HEXColor = `#${string}`;
export type RGB = [Red, Green, Blue];
export type RGBString = `rgb(${number}, ${number}, ${number})`;
export type RGBA = [Red, Green, Blue, Alpha];
export type RGBAString = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HSL = [Hue, Saturation, Lightness];
export type HSLString = `hsl(${number}, ${number}%, ${number}%)`;
export type HSLA = [Hue, Saturation, Lightness, Alpha];
export type HSLAString = `hsla(${number}, ${number}%, ${number}%, ${number})`;
export type CMYK = [Cyan, Magenta, Yellow, Black];
export type CMYKString = `cmyk(${number}, ${number}, ${number}, ${number})`;

// -- CMYK COLORS --
/**
 * Convert CMYK to RGB.
 * @param {Cyan} cyan - Cyan (0-100).
 * @param {Magenta} magenta - Magenta (0-100).
 * @param {Yellow} yellow - Yellow (0-100).
 * @param {Black} black - Black (0-100).
 * @return {RGB}
 */
export function cmykToRgb(cyan: Cyan, magenta: Magenta, yellow: Yellow, black: Black): RGB {
  // Normalize CMYK values from 0-100 to 0-1 range
  const c = cyan / 100;
  const m = magenta / 100;
  const y = yellow / 100;
  const k = black / 100;

  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  return [Math.round(r) as Red, Math.round(g) as Green, Math.round(b) as Blue];
}

/**
 * Convert CMYK to RGB String.
 * @param {Cyan} c - Cyan.
 * @param {Magenta} m - Magenta.
 * @param {Yellow} y - Yellow.
 * @param {Black} k - Black.
 * @return {RGBString}
 */
export function cmykToRgbString(c: Cyan, m: Magenta, y: Yellow, k: Black): RGBString;
/**
 * Convert CMYK to RGBA String.
 * @param {Cyan} c - Cyan.
 * @param {Magenta} m - Magenta.
 * @param {Yellow} y - Yellow.
 * @param {Black} k - Black.
 * @param {Alpha} a - Alpha.
 * @return {RGBAString}
 */
export function cmykToRgbString(c: Cyan, m: Magenta, y: Yellow, k: Black, a: Alpha): RGBAString;
export function cmykToRgbString(c: Cyan, m: Magenta, y: Yellow, k: Black, a?: Alpha) {
  const [r, g, b] = cmykToRgb(c, m, y, k);
  return a !== undefined ? `rgba(${r}, ${g}, ${b}, ${a / 100})` : `rgb(${r}, ${g}, ${b})`;
}

/**
 * Convert CMYK to HEX.
 * @param {Cyan} cyan - Cyan.
 * @param {Magenta} magenta - Magenta.
 * @param {Yellow} yellow - Yellow.
 * @param {Black} black - Black.
 * @return {HEXColor}
 */
export function cmykToHex(cyan: Cyan, magenta: Magenta, yellow: Yellow, black: Black): HEXColor {
  const [r, g, b] = cmykToRgb(cyan, magenta, yellow, black);
  return rgbToHex(r, g, b);
}

// -- RGB COLORS --
/**
 * Convert RGB to HEX.
 * @param {Red} r - Red.
 * @param {Green} g - Green.
 * @param {Blue} b - Blue.
 * @return {HEXColor}
 */
export function rgbToHex(r: Red, g: Green, b: Blue): HEXColor {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return `#${hex.padStart(6, '0')}`;
}

/**
 * Convert RGB to CMYK.
 * @param {Red} r - Red.
 * @param {Green} g - Green.
 * @param {Blue} b - Blue.
 * @return {CMYK}
 */
export function rgbToCmyk(r: Red, g: Green, b: Blue): CMYK {
  // Handle black color as a special case
  if (r === 0 && g === 0 && b === 0) {
    return [0, 0, 0, 1] as CMYK;
  }

  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const black = 1 - Math.max(red, green, blue);

  // If black is 1 (100%), then C, M, Y should be 0
  if (black === 1) {
    return [0, 0, 0, 1] as CMYK;
  }

  const cyan = (1 - red - black) / (1 - black);
  const magenta = (1 - green - black) / (1 - black);
  const yellow = (1 - blue - black) / (1 - black);

  return [cyan, magenta, yellow, black] as CMYK;
}

/**
 * Convert RGB to HSL
 * @param {Red} r - Red.
 * @param {Green} g - Green.
 * @param {Blue} b - Blue.
 * @return {HSL}
 */
export function rgbToHsl(r: Red, g: Green, b: Blue): HSL;
/**
 * Convert RGBA to HSLA
 * @param {Red} r - Red.
 * @param {Green} g - Green.
 * @param {Blue} b - Blue.
 * @param {Alpha} a - Alpha.
 * @return {HSLA}
 */
export function rgbToHsl(r: Red, g: Green, b: Blue, a: Alpha): HSLA;
export function rgbToHsl(r: Red, g: Green, b: Blue, a?: Alpha): HSL | HSLA {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case red:
        h = (green - blue) / d + (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / d + 2;
        break;
      case blue:
        h = (red - green) / d + 4;
        break;
    }

    h /= 6;
  }

  // For HSL, we need to preserve precision for lightness but round hue and saturation
  const hsl = [Math.round(h * 360), Math.round(s * 100), l * 100] as number[];
  return a !== undefined ? ([...hsl, a] as HSLA) : (hsl as HSL);
}

/**
 * Convert RGB to HSL String.
 * @param {Red} r - Red.
 * @param {Green} g - Green.
 * @param {Blue} b - Blue.
 * @return {HSLString}
 */
export function rgbToHslString(r: Red, g: Green, b: Blue): HSLString;
/**
 * Convert RGBA to HSLA String.
 * @param {Red} r - Red.
 * @param {Green} g - Green.
 * @param {Blue} b - Blue.
 * @param {Alpha} a - Alpha.
 * @return {HSLAString}
 */
export function rgbToHslString(r: Red, g: Green, b: Blue, a: Alpha): HSLAString;
export function rgbToHslString(r: Red, g: Green, b: Blue, a?: Alpha): HSLString | HSLAString {
  const [h, s, l] = rgbToHsl(r, g, b) as number[];
  return a !== undefined
    ? (`hsla(${h}, ${s}%, ${l}%, ${a / 100})` as HSLAString)
    : (`hsl(${h}, ${s}%, ${l}%)` as HSLString);
}

// -- HEX COLORS --
/**
 * Convert 3 digit hex color to 6 digit hex color.
 * @param {HEXColor} hex - 3 digit hex color.
 * @return {HEXColor}
 */
export function hexToSixDigit(hex: HEXColor): HEXColor {
  const result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);

  if (!result) {
    throw new Error(`Invalid 3 digit hex color: ${hex}`);
  }

  const [, r, g, b] = result;

  return `#${r}${r}${g}${g}${b}${b}`;
}

/**
 * Convert hex color to RGB.
 * @param {HEXColor} hex - Hex color.
 * @return {RGB | RGBA}
 */
export function hexToRgb(hex: HEXColor): RGB | RGBA {
  // Handle 3-digit hex colors
  if (hex.length === 4 || hex.length === 5) {
    return hexToRgb(hexToSixDigit(hex));
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);

  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const [, r, g, b, a] = result;

  if (a) {
    // If alpha channel exists, return RGBA
    return [
      parseInt(r, 16) as Red,
      parseInt(g, 16) as Green,
      parseInt(b, 16) as Blue,
      Math.round((parseInt(a, 16) / 255) * 100) as Alpha,
    ];
  }

  // Return RGB
  return [parseInt(r, 16) as Red, parseInt(g, 16) as Green, parseInt(b, 16) as Blue];
}

/**
 * Convert hex color to HSL.
 * @param {HEXColor} hex - Hex color.
 * @return {HSL | HSLA}
 */
export function hexToHsl(hex: HEXColor): HSL | HSLA {
  return rgbToHsl(...(hexToRgb(hex) as RGBA));
}

/**
 * Convert hex color to CMYK.
 * @param {HEXColor} hex - Hex color.
 * @return {CMYK}
 */
export function hexToCmyk(hex: HEXColor): CMYK {
  const [r, g, b] = hexToRgb(hex);
  return rgbToCmyk(r, g, b);
}

/**
 * Convert hex color to RGB String.
 * @param {HEXColor} hex - Hex color.
 * @return {RGBString}
 */
export function hexToRgbString(hex: HEXColor): RGBString;
/**
 * Convert hex color to RGBA String.
 * @param {HEXColor} hex - Hex color.
 * @param {Alpha} alpha - Alpha.
 * @return {RGBAString}
 */
export function hexToRgbString(hex: HEXColor, alpha: Alpha): RGBAString;
export function hexToRgbString(hex: HEXColor, alpha?: number): string {
  const [r, g, b] = hexToRgb(hex);

  if (typeof alpha === 'number' && !isNaN(alpha)) {
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
}

// -- HSL COLORS --
/**
 * Converts HSL color values to RGB.
 * @param {Hue} h - Hue value (0-360)
 * @param {Saturation} s - Saturation value (0-100)
 * @param {Lightness} l - Lightness value (0-100)
 * @return {RGB} RGB color values as a tuple [Red, Green, Blue]
 */
export function hslToRgb(h: Hue, s: Saturation, l: Lightness): RGB;
/**
 * Converts HSLA color values to RGBA.
 * @param {Hue} h - Hue value (0-360)
 * @param {Saturation} s - Saturation value (0-100)
 * @param {Lightness} l - Lightness value (0-100)
 * @param {Alpha} a - Alpha value (0-100)
 * @return {RGBA} RGBA color values as a tuple [Red, Green, Blue, Alpha]
 */
export function hslToRgb(h: Hue, s: Saturation, l: Lightness, a: Alpha): RGBA;
export function hslToRgb(h: Hue, s: Saturation, l: Lightness, a?: Alpha): RGB | RGBA {
  let hue = h / 360;
  let saturation = s / 100;
  let lightness = l / 100;

  let r, g, b;

  if (saturation === 0) {
    // Achromatic color (gray scale)
    r = g = b = lightness;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;

    r = hue2rgb(p, q, hue + 1 / 3);
    g = hue2rgb(p, q, hue);
    b = hue2rgb(p, q, hue - 1 / 3);
  }

  if (a !== undefined) {
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a] as RGBA;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)] as RGB;
}

/**
 * Converts HSL color values to HEX color format.
 * @param {Hue} h - Hue value (0-360)
 * @param {Saturation} s - Saturation value (0-100)
 * @param {Lightness} l - Lightness value (0-100)
 * @return {HEXColor} The HEX representation of the HSL color
 */
export function hslToHex(h: Hue, s: Saturation, l: Lightness): HEXColor {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(...rgb);
}

/**
 * Converts HSL color values to CMYK color format.
 * @param {Hue} h - Hue value (0-360)
 * @param {Saturation} s - Saturation value (0-100)
 * @param {Lightness} l - Lightness value (0-100)
 * @return {CMYK} The CMYK representation of the HSL color
 */
export function hslToCmyk(h: Hue, s: Saturation, l: Lightness): CMYK {
  const rgb = hslToRgb(h, s, l);
  return rgbToCmyk(...rgb);
}

// -- COLOR TRANSFORM --
/**
 * Adjusts the opacity of a color by setting its alpha value.
 * Supports HEX, RGB, RGBA, HSL, and HSLA color formats.
 * @param {HEXColor | RGBString | RGBAString} color - The color to adjust opacity for
 * @param {string | Alpha} opacity - The opacity value to set (0-100)
 * @return {string} The color with adjusted opacity, or the original color if not a valid color format
 */
export function colorOpacity(
  color: HEXColor | RGBString | RGBAString | HSLString | HSLAString,
  opacity: string | Alpha
): string {
  const alpha = Math.max(0, Math.min(100, parseFloat(opacity as string))) as Alpha;

  // Check if the input is a valid color format
  if (COLOR_REGEX.test(color)) {
    // Process different color formats accordingly
    if (COLOR_HEX_REGEX.test(color)) {
      // Convert HEX to RGB string with alpha
      return hexToRgbString(color as HEXColor, alpha);
    } else if (COLOR_RGB_REGEX.test(color)) {
      // Convert RGB to RGBA by adding alpha
      return color.replace(')', `, ${alpha / 100})`).replace('rgb', 'rgba');
    } else if (COLOR_RGBA_REGEX.test(color)) {
      // Replace existing alpha in RGBA
      return color.replace(/,\s*\d+(\.\d+)?\)/, `, ${alpha / 100})`);
    } else if (COLOR_HSL_REGEX.test(color)) {
      // Convert HSL to HSLA by adding alpha
      return color.replace(')', `, ${alpha / 100})`).replace('hsl', 'hsla');
    } else if (COLOR_HSLA_REGEX.test(color)) {
      // Replace existing alpha in HSLA
      return color.replace(/,\s*\d+(\.\d+)?\)/, `, ${alpha / 100})`);
    }
  }

  return color;
}

/**
 * Darkens a HEX color by reducing its lightness.
 * Only processes valid HEX colors, returning the original color unchanged if it's not a valid HEX.
 * @param {HEXColor} color - The HEX color to darken
 * @param {string | number} amount - The amount to darken the color by (0-100)
 * @return {string} The darkened color in RGB format, or the original color if not a valid HEX
 */
export function colorDarken(color: HEXColor, amount: string | number): string {
  const value = Math.max(0, Math.min(100, parseFloat(amount as string))) as Alpha;

  if (COLOR_HEX_REGEX.test(color)) {
    // Convert HEX to RGB and reduce each component by the specified percentage
    const [r, g, b] = hexToRgb(color);
    // Apply darkening by reducing each RGB component
    const factor = (100 - value) / 100;
    return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
  }

  return color;
}

/**
 * Adjusts the shade of a HEX color by a given percentage.
 * Lightens the color when percent is positive, darkens when negative.
 * @param {HEXColor} color - The HEX color to adjust (e.g. '#ff0000')
 * @param {number} percent - The percentage to adjust the color by
 * Positive values lighten the color, negative values darken it
 * @return {string} The adjusted HEX color
 */
export function colorShade(color: HEXColor, percent: number): string {
  let [R, G, B] = hexToRgb(color) as number[];

  if (percent < 0) {
    // Darken: Move towards black (0, 0, 0)
    const factor = (100 + percent) / 100;
    R = R * factor;
    G = G * factor;
    B = B * factor;
  } else if (percent > 0) {
    // Lighten: Move towards white (255, 255, 255)
    const factor = percent / 100;
    R = R + (255 - R) * factor;
    G = G + (255 - G) * factor;
    B = B + (255 - B) * factor;
  }
  // If percent is 0, no change

  // Ensure values don't exceed the maximum valid RGB value (255) or go below 0
  R = R > 255 ? 255 : R < 0 ? 0 : R;
  G = G > 255 ? 255 : G < 0 ? 0 : G;
  B = B > 255 ? 255 : B < 0 ? 0 : B;

  // Round values to integers
  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  // Convert to HEX format ensuring two characters per component
  const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
}

/**
 * Calculates the contrast of a HEX color and adjusts it accordingly.
 * Determines if a color is light or dark and adjusts its shade based on the amount.
 * Light colors are darkened, dark colors are lightened.
 * @param {HEXColor} color - The HEX color to adjust contrast for
 * @param {number} amount - The amount to adjust the color by (default: 40)
 * @return {string} The adjusted HEX color
 */
export function colorContrast(color: HEXColor, amount = 40): string {
  const [r, g, b] = hexToRgb(color);
  // Calculate luminance using standard formula and threshold at 186
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? colorShade(color, -amount) : colorShade(color, amount);
}
