import { describe, expect, it } from 'vitest';
import type { Cyan, Green, Magenta, Red } from '../../lib/index.js';
import {
  cmykToHex,
  cmykToRgb,
  cmykToRgbString,
  colorContrast,
  colorDarken,
  colorOpacity,
  colorShade,
  type HEXColor,
  hexToCmyk,
  hexToHsl,
  hexToRgb,
  hexToRgbString,
  hexToSixDigit,
  hslToCmyk,
  hslToHex,
  hslToRgb,
  rgbToCmyk,
  rgbToHex,
  rgbToHsl,
  rgbToHslString,
} from '../../lib/index.js';

describe('Color Utilities', () => {
  describe('CMYK Colors', () => {
    it('should convert CMYK to RGB', () => {
      expect(cmykToRgb(0, 100, 100, 0)).toEqual([255, 0, 0]);
      expect(cmykToRgb(100, 0, 100, 0)).toEqual([0, 255, 0]);
      expect(cmykToRgb(100, 100, 0, 0)).toEqual([0, 0, 255]);

      // Edge cases
      expect(cmykToRgb(0, 0, 0, 0)).toEqual([255, 255, 255]); // White
      expect(cmykToRgb(0, 0, 0, 100)).toEqual([0, 0, 0]); // Black
      expect(cmykToRgb(100, 100, 100, 100)).toEqual([0, 0, 0]); // Black
      expect(cmykToRgb(50, 50, 50, 50)).toEqual([64, 64, 64]); // Gray
    });

    it('should convert CMYK to RGB String', () => {
      expect(cmykToRgbString(0, 100, 100, 0)).toBe('rgb(255, 0, 0)');
      expect(cmykToRgbString(0, 100, 100, 0, 50)).toBe('rgba(255, 0, 0, 0.5)');

      // Edge cases
      expect(cmykToRgbString(0, 0, 0, 0)).toBe('rgb(255, 255, 255)'); // White
      expect(cmykToRgbString(0, 0, 0, 100)).toBe('rgb(0, 0, 0)'); // Black
      expect(cmykToRgbString(0, 0, 0, 0, 0)).toBe('rgba(255, 255, 255, 0)'); // Transparent white
    });

    it('should convert CMYK to HEX', () => {
      expect(cmykToHex(0, 100, 100, 0)).toBe('#ff0000');
      expect(cmykToHex(100, 0, 100, 0)).toBe('#00ff00');

      // Edge cases
      expect(cmykToHex(0, 0, 0, 0)).toBe('#ffffff'); // White
      expect(cmykToHex(0, 0, 0, 100)).toBe('#000000'); // Black
      expect(cmykToHex(100, 100, 100, 100)).toBe('#000000'); // Black
      expect(cmykToHex(50, 50, 50, 50)).toBe('#404040'); // Gray
    });
  });

  describe('RGB Colors', () => {
    it('should convert RGB to HEX', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');

      // Edge cases
      expect(rgbToHex(0, 0, 0)).toBe('#000000'); // Black
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff'); // White
      expect(rgbToHex(128, 128, 128)).toBe('#808080'); // Gray
    });

    it('should convert RGB to CMYK', () => {
      expect(rgbToCmyk(255, 0, 0)).toEqual([0, 1, 1, 0]);
      expect(rgbToCmyk(0, 255, 0)).toEqual([1, 0, 1, 0]);

      // Edge cases
      expect(rgbToCmyk(0, 0, 0)).toEqual([0, 0, 0, 1]); // Black
      expect(rgbToCmyk(255, 255, 255)).toEqual([0, 0, 0, 0]); // White
      expect(rgbToCmyk(128, 128, 128)).toEqual([0, 0, 0, 0.4980392156862745]); // Gray
    });

    it('should convert RGB to HSL', () => {
      const [h, s, l] = rgbToHsl(255, 0, 0);
      expect(h).toBeCloseTo(0);
      expect(s).toBeCloseTo(100);
      expect(l).toBeCloseTo(50);

      // Edge cases
      const [hBlack, sBlack, lBlack] = rgbToHsl(0, 0, 0);
      expect(hBlack).toBeCloseTo(0);
      expect(sBlack).toBeCloseTo(0);
      expect(lBlack).toBeCloseTo(0);

      const [hWhite, sWhite, lWhite] = rgbToHsl(255, 255, 255);
      expect(hWhite).toBeCloseTo(0);
      expect(sWhite).toBeCloseTo(0);
      expect(lWhite).toBeCloseTo(100);

      const [hGray, sGray, lGray] = rgbToHsl(128, 128, 128);
      expect(hGray).toBeCloseTo(0);
      expect(sGray).toBeCloseTo(0);
      expect(lGray).toBeCloseTo(50.19607843137255);
    });

    it('should convert RGB to HSL String', () => {
      expect(rgbToHslString(255, 0, 0)).toBe('hsl(0, 100%, 50%)');
      expect(rgbToHslString(255, 0, 0, 50)).toBe('hsla(0, 100%, 50%, 0.5)');

      // Edge cases
      expect(rgbToHslString(0, 0, 0)).toBe('hsl(0, 0%, 0%)');
      expect(rgbToHslString(255, 255, 255)).toBe('hsl(0, 0%, 100%)');
      expect(rgbToHslString(128, 128, 128, 0)).toBe('hsla(0, 0%, 50.19607843137255%, 0)');
    });
  });

  describe('HEX Colors', () => {
    it('should convert 3-digit HEX to 6-digit HEX', () => {
      expect(hexToSixDigit('#f00')).toBe('#ff0000');
      expect(hexToSixDigit('#0f0')).toBe('#00ff00');

      // Edge cases
      expect(hexToSixDigit('#000')).toBe('#000000');
      expect(hexToSixDigit('#fff')).toBe('#ffffff');
      expect(hexToSixDigit('#abc')).toBe('#aabbcc');
    });

    it('should convert HEX to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
      expect(hexToRgb('#00ff00')).toEqual([0, 255, 0]);

      // Edge cases
      expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
      expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
      expect(hexToRgb('#808080')).toEqual([128, 128, 128]);
      expect(hexToRgb('#f00')).toEqual([255, 0, 0]); // 3-digit hex
    });

    it('should convert HEX to HSL', () => {
      const [h, s, l] = hexToHsl('#ff0000');
      expect(h).toBeCloseTo(0);
      expect(s).toBeCloseTo(100);
      expect(l).toBeCloseTo(50);

      // Edge cases
      const [hBlack, sBlack, lBlack] = hexToHsl('#000000');
      expect(hBlack).toBeCloseTo(0);
      expect(sBlack).toBeCloseTo(0);
      expect(lBlack).toBeCloseTo(0);

      const [hWhite, sWhite, lWhite] = hexToHsl('#ffffff');
      expect(hWhite).toBeCloseTo(0);
      expect(sWhite).toBeCloseTo(0);
      expect(lWhite).toBeCloseTo(100);
    });

    it('should convert HEX to CMYK', () => {
      expect(hexToCmyk('#ff0000')).toEqual([0, 1, 1, 0]);
      expect(hexToCmyk('#00ff00')).toEqual([1, 0, 1, 0]);

      // Edge cases
      expect(hexToCmyk('#000000')).toEqual([0, 0, 0, 1]); // Black
      expect(hexToCmyk('#ffffff')).toEqual([0, 0, 0, 0]); // White
      expect(hexToCmyk('#808080')).toEqual([0, 0, 0, 0.4980392156862745]); // Gray
    });

    it('should convert HEX to RGB String', () => {
      expect(hexToRgbString('#ff0000')).toBe('rgb(255, 0, 0)');
      expect(hexToRgbString('#ff0000', 50)).toBe('rgba(255, 0, 0, 0.5)');

      // Edge cases
      expect(hexToRgbString('#000000')).toBe('rgb(0, 0, 0)');
      expect(hexToRgbString('#ffffff')).toBe('rgb(255, 255, 255)');
      expect(hexToRgbString('#808080', 50)).toBe('rgba(128, 128, 128, 0.5)');
      expect(hexToRgbString('#f00')).toBe('rgb(255, 0, 0)'); // 3-digit hex
    });
  });

  describe('HSL Colors', () => {
    it('should convert HSL to RGB', () => {
      expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
      expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
      expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);

      // Edge cases
      expect(hslToRgb(0, 0, 0)).toEqual([0, 0, 0]); // Black
      expect(hslToRgb(0, 0, 100)).toEqual([255, 255, 255]); // White
      expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]); // Red
    });

    it('should convert HSL to HEX', () => {
      expect(hslToHex(0, 100, 50)).toBe('#ff0000');
      expect(hslToHex(120, 100, 50)).toBe('#00ff00');
      expect(hslToHex(240, 100, 50)).toBe('#0000ff');

      // Edge cases
      expect(hslToHex(0, 0, 0)).toBe('#000000'); // Black
      expect(hslToHex(0, 0, 100)).toBe('#ffffff'); // White
      expect(hslToHex(0, 100, 50)).toBe('#ff0000'); // Red
    });

    it('should convert HSL to CMYK', () => {
      expect(hslToCmyk(0, 100, 50)).toEqual([0, 1, 1, 0]);
      expect(hslToCmyk(120, 100, 50)).toEqual([1, 0, 1, 0]);
      expect(hslToCmyk(240, 100, 50)).toEqual([1, 1, 0, 0]);

      // Edge cases
      expect(hslToCmyk(0, 0, 0)).toEqual([0, 0, 0, 1]); // Black
      expect(hslToCmyk(0, 0, 100)).toEqual([0, 0, 0, 0]); // White
    });
  });

  describe('Color Transformations', () => {
    it('should adjust color opacity', () => {
      expect(colorOpacity('#ff0000', '50')).toBe('rgba(255, 0, 0, 0.5)');
      expect(colorOpacity('rgb(255, 0, 0)', '50')).toBe('rgba(255, 0, 0, 0.5)');

      // Edge cases
      expect(colorOpacity('#000000', '0')).toBe('rgba(0, 0, 0, 0)');
      expect(colorOpacity('rgba(255, 0, 0, 0.8)', '50')).toBe('rgba(255, 0, 0, 0.5)');
      expect(colorOpacity('hsl(0, 100%, 50%)', '30')).toBe('hsla(0, 100%, 50%, 0.3)');
      expect(colorOpacity('hsla(0, 100%, 50%, 0.8)', '20')).toBe('hsla(0, 100%, 50%, 0.2)');
    });

    it('should darken colors', () => {
      expect(colorDarken('#ff0000', '50')).toBe('rgb(128, 0, 0)');
      expect(colorDarken('#ffffff', '20')).toBe('rgb(204, 204, 204)');

      // Edge cases
      expect(colorDarken('#000000', '50')).toBe('rgb(0, 0, 0)'); // Already black
      expect(colorDarken('#808080', '50')).toBe('rgb(64, 64, 64)'); // 50% darkening of 128 (50% gray)
    });

    it('should shade colors', () => {
      expect(colorShade('#ff0000', -50)).toBe('#800000');
      expect(colorShade('#ff0000', 50)).toBe('#ff8080');

      // Edge cases
      expect(colorShade('#000000', -50)).toBe('#000000'); // Black stays black when darkening
      expect(colorShade('#ffffff', 50)).toBe('#ffffff'); // White stays white when lightening
      expect(colorShade('#808080', 0)).toBe('#808080'); // No change when percent is 0
    });

    it('should calculate contrasting colors', () => {
      expect(colorContrast('#ffffff')).toBe('#999999');
      expect(colorContrast('#000000')).toBe('#666666');

      // Edge cases
      expect(colorContrast('#ffffff', 0)).toBe('#ffffff'); // No adjustment
      expect(colorContrast('#000000', 0)).toBe('#000000'); // No adjustment
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid HEX colors', () => {
      expect(() => hexToRgb('#xyz' as HEXColor)).toThrow();
      expect(() => hexToRgb('#12' as HEXColor)).toThrow();
      expect(() => hexToRgb('invalid' as HEXColor)).toThrow();
    });

    it('should throw error for invalid 3-digit HEX', () => {
      expect(() => hexToSixDigit('#gh1' as HEXColor)).toThrow();
      expect(() => hexToSixDigit('#1234' as HEXColor)).toThrow();
      expect(() => hexToSixDigit('invalid' as HEXColor)).toThrow();
    });

    it('should handle edge values correctly', () => {
      // Test boundary values for CMYK
      expect(cmykToRgb(0, 0, 0, 0)).toEqual([255, 255, 255]); // White
      expect(cmykToRgb(100, 100, 100, 100)).toEqual([0, 0, 0]); // Black
      expect(() => cmykToRgb(-1 as Cyan, 0, 0, 0)).not.toThrow(); // Out of range values
      expect(() => cmykToRgb(0, 101 as Magenta, 0, 0)).not.toThrow(); // Out of range values

      // Test boundary values for RGB
      expect(rgbToHex(0, 0, 0)).toBe('#000000'); // Black
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff'); // White
      expect(() => rgbToHex(-1 as Red, 0, 0)).not.toThrow(); // Out of range values
      expect(() => rgbToHex(0, 256 as Green, 0)).not.toThrow(); // Out of range values

      // Test boundary values for HSL
      expect(hslToHex(0, 0, 0)).toBe('#000000'); // Black
      expect(hslToHex(0, 0, 100)).toBe('#ffffff'); // White
    });
  });
});
