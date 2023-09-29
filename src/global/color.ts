import { Range } from './number.js';

export const COLOR_REGEX = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^)]*\)/i;
export const COLOR_HEX_REGEX = /^#([0-9a-f]{3}){1,2}$/i;
export const COLOR_RGB_REGEX = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i;
export const COLOR_RGBA_REGEX = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(\.\d+)?)\)$/i;
export const COLOR_HSL_REGEX = /^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/i;
export const COLOR_HSLA_REGEX = /^hsla\((\d+),\s*(\d+)%?,\s*(\d+)%?,\s*(\d+(\.\d+)?)\)$/i;
export const COLOR_HEX_TO_RGB_REGEX = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i;

export type Red = Range<0, 255>;
export type Green = Range<0, 255>;
export type Blue = Range<0, 255>;
export type Alpha = Range<0, 100>;
export type Hue = Range<0, 360>;
export type Saturation = Range<0, 100>;
export type Lightness = Range<0, 100>;
export type Cyan = Range<0, 100>;
export type Magenta = Range<0, 100>;
export type Yellow = Range<0, 100>;
export type Black = Range<0, 100>;

export type HEXColor = `#${ string }`;
export type RGB = [ Red, Green, Blue ];
export type RGBString = `rgb(red, green, blue)`;
export type RGBA = [ Red, Green, Blue, Alpha ];
export type RGBAString = `rgba(red, green, blue, alpha)`;
export type HSL = [ Hue, Saturation, Lightness ];
export type HSLString = `hsl(hue, saturation%, lightness%)`;
export type HSLA = [ Hue, Saturation, Lightness, Alpha ];
export type HSLAString = `hsla(hue, saturation%, lightness%, alpha)`;
export type CMYK = [ Cyan, Magenta, Yellow, Black ];
export type CMYKString = `cmyk(cyan, magenta, yellow, black)`;

// -- CMYK COLORS --
/**
 * Convert CMYK to RGB.
 * @param {Cyan} cyan - Cyan.
 * @param {Magenta} magenta - Magenta.
 * @param {Yellow} yellow - Yellow.
 * @param {Black} black - Black.
 * @return {RGB}
 */
export function cmykToRgb(cyan: Cyan, magenta: Magenta, yellow: Yellow, black: Black): RGB {
  const r = 255 * (1 - cyan) * (1 - black);
  const g = 255 * (1 - magenta) * (1 - black);
  const b = 255 * (1 - yellow) * (1 - black);

  return [ r as Red, g as Green, b as Blue ];
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
  const [ r, g, b ] = cmykToRgb(c, m, y, k);
  return a ? `rgba(${ r }, ${ g }, ${ b }, ${ a })` : `rgb(${ r }, ${ g }, ${ b })`;
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
  const r = 255 * (1 - cyan) * (1 - black) as Red;
  const g = 255 * (1 - magenta) * (1 - black) as Green;
  const b = 255 * (1 - yellow) * (1 - black) as Blue;

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
  return `#${ hex.padStart(6, '0') }`;
}

/**
 * Convert RGB to CMYK.
 * @param {Red} r - Red.
 * @param {Green} g - Green.
 * @param {Blue} b - Blue.
 * @return {CMYK}
 */
export function rgbToCmyk(r: Red, g: Green, b: Blue): CMYK {
  const cyan = 1 - (r / 255);
  const magenta = 1 - (g / 255);
  const yellow = 1 - (b / 255);
  const black = Math.min(cyan, magenta, yellow);

  return [ cyan, magenta, yellow, black ] as CMYK;
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
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  const hsl = [ h * 360, s * 100, l * 100 ];
  return a ? [ ...hsl, a ] as HSLA : hsl as HSL;
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
  const [ h, s, l ] = rgbToHsl(r, g, b) as number[];
  return a ? `hsla(${ h }, ${ s }%, ${ l }%, ${ a })` as HSLAString : `hsl(${ h }, ${ s }%, ${ l }%)` as HSLString;
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
    throw new Error(`Invalid 3 digit hex color: ${ hex }`);
  }

  const [ , r, g, b ] = result;

  return `#${ r }${ r }${ g }${ g }${ b }${ b }`;
}

/**
 * Convert hex color to RGB.
 * @param {HEXColor} hex - Hex color.
 * @return {RGB | RGBA}
 */
export function hexToRgb(hex: HEXColor): RGB | RGBA {
  if (hex.length < 5) {
    return hexToRgb(hexToSixDigit(hex));
  }

  const result = /^#[0-9a-f]+/i.exec(hex);

  if (!result) {
    throw new Error(`Invalid hex color: ${ hex }`);
  }

  const [ input ] = result;
  const [ , r, g, b ] = COLOR_HEX_TO_RGB_REGEX.exec(input) || [];
  const alpha = input.substring(7);

  if (alpha) {
    return [
      parseInt(r, 16) as Red,
      parseInt(g, 16) as Green,
      parseInt(b, 16) as Blue,
      (parseInt(alpha || '1') / 100) as Alpha,
    ];
  }

  return [
    parseInt(r, 16) as Red,
    parseInt(g, 16) as Green,
    parseInt(b, 16) as Blue,
  ];
}

/**
 * Convert hex color to HSL.
 * @param {HEXColor} hex - Hex color.
 * @return {HSL | HSLA}
 */
export function hexToHsl(hex: HEXColor): HSL | HSLA {
  return rgbToHsl(...hexToRgb(hex) as RGBA);
}

/**
 * Convert hex color to CMYK.
 * @param {HEXColor} hex - Hex color.
 * @return {CMYK}
 */
export function hexToCmyk(hex: HEXColor): CMYK {
  const [ r, g, b ] = hexToRgb(hex);
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
  const [ r, g, b ] = hexToRgb(hex);

  if (typeof alpha === 'number' && !isNaN(alpha)) {
    return `rgba(${ r }, ${ g }, ${ b }, ${ alpha > 1 ? alpha / 100 : alpha })`;
  } else {
    return `rgb(${ r }, ${ g }, ${ b })`;
  }
}

// -- COLOR TRANSFORM --
export function colorOpacity(color: HEXColor, opacity: string | Alpha): string {
  const alpha = parseFloat(opacity as string) as Alpha;

  if (COLOR_REGEX.test(color)) {
    if (COLOR_HEX_REGEX.test(color)) {
      return hexToRgbString(color, alpha);
    } else if (COLOR_RGB_REGEX.test(color)) {
      return color.replace(')', `, ${ alpha / 100 })`).replace('rgb', 'rgba');
    } else if (COLOR_RGBA_REGEX.test(color)) {
      return color.replace(/,\s*\d+(\.\d+)?\)/, `, ${ alpha / 100 })`);
    } else if (COLOR_HSL_REGEX.test(color)) {
      return color.replace(')', `, ${ alpha / 100 })`).replace('hsl', 'hsla');
    } else if (COLOR_HSLA_REGEX.test(color)) {
      return color.replace(/,\s*\d+(\.\d+)?\)/, `, ${ alpha / 100 })`);
    }
  }

  return color;
}

export function colorDarken(color: HEXColor, amount: string | number): string {
  const value = parseInt(amount as string, 10);

  if (COLOR_HEX_REGEX.test(color)) {
    const [ r, g, b ] = hexToRgb(color);
    return `rgb(${ Math.round(r / value) }, ${ Math.round(g / value) }, ${ Math.round(b / value) })`;
  }

  return color;
}

export function colorShade(color: HEXColor, percent: number) {
  let [ R, G, B ] = hexToRgb(color) as number[];

  R = (R * (100 + percent) / 100);
  G = (G * (100 + percent) / 100);
  B = (B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR = ((R.toString(16).length == 1) ? '0' + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length == 1) ? '0' + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length == 1) ? '0' + B.toString(16) : B.toString(16));

  return '#' + RR + GG + BB;
}

export function colorContrast(color: HEXColor, amount = 0): string {
  const [ r, g, b ] = hexToRgb(color);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? colorShade(color, -amount) : colorShade(color, amount);
}
