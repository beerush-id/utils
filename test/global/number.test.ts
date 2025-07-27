import { describe, expect, it } from 'vitest';
import {
  aspectRatio,
  cmToInch,
  cmToMm,
  cmToPx,
  createRuler,
  DEFAULT_DPI,
  dpiFromPx,
  dpiScale,
  inchToCm,
  inchToMm,
  inchToPx,
  isEven,
  isFloat,
  isInt,
  mmToCm,
  mmToInch,
  mmToPx,
  percent,
  ppm,
  pxScale,
  pxToCm,
  pxToInch,
  pxToMm,
  rule,
  scale,
} from '../../lib/index.js';

describe('Number Utilities', () => {
  describe('Basic Number Checks', () => {
    it('should check if number is even', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(3)).toBe(false);
      // Edge cases
      expect(isEven(0)).toBe(true);
      expect(isEven(-2)).toBe(true);
      expect(isEven(-3)).toBe(false);
      expect(isEven(2.0)).toBe(true);
      expect(isEven(Number.MAX_SAFE_INTEGER)).toBe(false);
      expect(isEven(Number.MIN_SAFE_INTEGER)).toBe(false);
    });

    it('should check if number is integer', () => {
      expect(isInt(5)).toBe(true);
      expect(isInt(5.5)).toBe(false);
      // Edge cases
      expect(isInt(0)).toBe(true);
      expect(isInt(-1)).toBe(true);
      expect(isInt(1.0)).toBe(true);
      expect(isInt(NaN)).toBe(false);
      expect(isInt(Infinity)).toBe(false);
      expect(isInt(-Infinity)).toBe(false);
      expect(isInt(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(isInt(Number.MIN_SAFE_INTEGER)).toBe(true);
      expect(isInt(Math.PI)).toBe(false);
    });

    it('should check if number is float', () => {
      expect(isFloat(5.5)).toBe(true);
      expect(isFloat(5)).toBe(false);
      // Edge cases
      expect(isFloat(0)).toBe(false);
      expect(isFloat(0.0)).toBe(false);
      expect(isFloat(-1.5)).toBe(true);
      expect(isFloat(NaN)).toBe(false);
      expect(isFloat(Infinity)).toBe(false);
      expect(isFloat(-Infinity)).toBe(false);
      expect(isFloat(Number.MAX_SAFE_INTEGER)).toBe(false);
      expect(isFloat(Number.MIN_SAFE_INTEGER)).toBe(false);
      expect(isFloat(Math.PI)).toBe(true);
    });
  });

  describe('Ruler Functions', () => {
    it('should create ruler values', () => {
      const value = rule(10, 'mm');
      expect(value.mm).toBe(10);
      expect(value.px).toBeCloseTo(37.795275590551185);
      expect(value.cm).toBe(1);
      expect(value.in).toBeCloseTo(0.3937007874015748);
    });

    it('should create custom ruler', () => {
      const ruler = createRuler('px', 300);
      expect(ruler.mm(10).px).toBeCloseTo(118.11023622047244);
      expect(ruler.cm(1).px).toBeCloseTo(118.11023622047244);
      expect(ruler.in(1).px).toBe(300);
    });

    it('should handle edge cases in ruler functions', () => {
      // Zero values
      const zeroValue = rule(0, 'mm');
      expect(zeroValue.mm).toBe(0);
      expect(zeroValue.px).toBe(0);
      expect(zeroValue.cm).toBe(0);
      expect(zeroValue.in).toBe(0);

      // Negative values
      const negativeValue = rule(-10, 'mm');
      expect(negativeValue.mm).toBe(-10);
      expect(negativeValue.px).toBeCloseTo(-37.795275590551185);
      expect(negativeValue.cm).toBe(-1);
      expect(negativeValue.in).toBeCloseTo(-0.3937007874015748);

      // Fractional values
      const fractionalValue = rule(0.5, 'mm');
      expect(fractionalValue.mm).toBe(0.5);
      expect(fractionalValue.px).toBeCloseTo(1.889763779527559);
      expect(fractionalValue.cm).toBe(0.05);
      expect(fractionalValue.in).toBeCloseTo(0.01968503937007874);

      // Large values
      const largeValue = rule(10000, 'mm');
      expect(largeValue.mm).toBe(10000);
      expect(largeValue.px).toBeCloseTo(37795.275590551185);
      expect(largeValue.cm).toBe(1000);
      expect(largeValue.in).toBeCloseTo(393.7007874015748);
    });

    it('should handle different units in ruler functions', () => {
      // Test all units with consistent DPI
      const mmValue = rule(10, 'mm', DEFAULT_DPI);
      const cmValue = rule(1, 'cm', DEFAULT_DPI);
      const inValue = rule(1, 'in', DEFAULT_DPI);
      const pxValue = rule(DEFAULT_DPI, 'px', DEFAULT_DPI);

      // They should all be equivalent at 300 DPI
      expect(mmValue.mm).toBe(10);
      expect(cmValue.mm).toBe(10);
      expect(inValue.mm).toBeCloseTo(25.4);
      expect(pxValue.mm).toBeCloseTo(25.4);
    });

    it('should handle scale in ruler functions', () => {
      const value = rule(10, 'mm', 300, 2);
      expect(value.mm).toBe(10);
      // At 300 DPI, 10mm = 118.11px (from earlier tests)
      // With scale of 2, it should be 118.11 * 2 = 236.22px
      expect(value.px).toBeCloseTo(236.2204724409449);
    });

    it('should handle DPI changes with at() method', () => {
      const value = rule(10, 'mm', 300);
      const newValue = value.at(150);
      expect(newValue.mm).toBe(10);
      // At 300 DPI, 10mm = 118.11px
      // At 150 DPI (half of 300), it should be half the pixels = 59.055px
      expect(newValue.px).toBeCloseTo(59.05511811023622);
    });
  });

  describe('Unit Conversions', () => {
    describe('Millimeter Conversions', () => {
      it('should convert mm to px', () => {
        expect(mmToPx(10)).toBeCloseTo(118.11023622047244);
      });

      it('should convert mm to cm', () => {
        expect(mmToCm(10)).toBe(1);
      });

      it('should convert mm to inch', () => {
        expect(mmToInch(25.4)).toBe(1);
      });

      it('should handle edge cases in mm conversions', () => {
        // Zero values
        expect(mmToPx(0)).toBe(0);
        expect(mmToCm(0)).toBe(0);
        expect(mmToInch(0)).toBe(0);

        // Negative values
        expect(mmToPx(-10)).toBeCloseTo(-118.11023622047244);
        expect(mmToCm(-10)).toBe(-1);
        expect(mmToInch(-25.4)).toBe(-1);

        // Fractional values
        expect(mmToPx(0.5)).toBeCloseTo(5.905511811023622);
        expect(mmToCm(0.5)).toBe(0.05);
        expect(mmToInch(12.7)).toBe(0.5);

        // Large values
        expect(mmToPx(10000)).toBeCloseTo(118110.23622047245);
        expect(mmToCm(10000)).toBe(1000);
        expect(mmToInch(10000)).toBeCloseTo(393.7007874015748);
      });
    });

    describe('Centimeter Conversions', () => {
      it('should convert cm to px', () => {
        expect(cmToPx(1)).toBeCloseTo(118.11023622047244);
      });

      it('should convert cm to mm', () => {
        expect(cmToMm(1)).toBe(10);
      });

      it('should convert cm to inch', () => {
        expect(cmToInch(2.54)).toBe(1);
      });

      it('should handle edge cases in cm conversions', () => {
        // Zero values
        expect(cmToPx(0)).toBe(0);
        expect(cmToMm(0)).toBe(0);
        expect(cmToInch(0)).toBe(0);

        // Negative values
        expect(cmToPx(-1)).toBeCloseTo(-118.11023622047244);
        expect(cmToMm(-1)).toBe(-10);
        expect(cmToInch(-2.54)).toBe(-1);

        // Fractional values
        expect(cmToPx(0.1)).toBeCloseTo(11.811023622047244);
        expect(cmToMm(0.1)).toBe(1);
        expect(cmToInch(1.27)).toBe(0.5);

        // Large values
        expect(cmToPx(1000)).toBeCloseTo(118110.23622047245);
        expect(cmToMm(1000)).toBe(10000);
        expect(cmToInch(1000)).toBeCloseTo(393.7007874015748);
      });
    });

    describe('Inch Conversions', () => {
      it('should convert inch to px', () => {
        expect(inchToPx(1)).toBe(300);
      });

      it('should convert inch to mm', () => {
        expect(inchToMm(1)).toBe(25.4);
      });

      it('should convert inch to cm', () => {
        expect(inchToCm(1)).toBe(2.54);
      });

      it('should handle edge cases in inch conversions', () => {
        // Zero values
        expect(inchToPx(0)).toBe(0);
        expect(inchToMm(0)).toBe(0);
        expect(inchToCm(0)).toBe(0);

        // Negative values
        expect(inchToPx(-1)).toBe(-300);
        expect(inchToMm(-1)).toBe(-25.4);
        expect(inchToCm(-1)).toBe(-2.54);

        // Fractional values
        expect(inchToPx(0.5)).toBe(150);
        expect(inchToMm(0.5)).toBe(12.7);
        expect(inchToCm(0.5)).toBe(1.27);

        // Large values
        expect(inchToPx(100)).toBe(30000);
        expect(inchToMm(100)).toBe(2540);
        expect(inchToCm(100)).toBe(254);
      });
    });

    describe('Pixel Conversions', () => {
      it('should convert px to mm', () => {
        expect(pxToMm(118.11023622047244)).toBeCloseTo(10);
      });

      it('should convert px to cm', () => {
        expect(pxToCm(118.11023622047244)).toBeCloseTo(1);
      });

      it('should convert px to inch', () => {
        expect(pxToInch(300)).toBe(1);
      });

      it('should handle edge cases in px conversions', () => {
        // Zero values
        expect(pxToMm(0)).toBe(0);
        expect(pxToCm(0)).toBe(0);
        expect(pxToInch(0)).toBe(0);

        // Negative values
        expect(pxToMm(-118.11023622047244)).toBeCloseTo(-10);
        expect(pxToCm(-118.11023622047244)).toBeCloseTo(-1);
        expect(pxToInch(-300)).toBe(-1);

        // Fractional values
        expect(pxToMm(59.05511811023622)).toBeCloseTo(5);
        expect(pxToCm(59.05511811023622)).toBeCloseTo(0.5);
        expect(pxToInch(150)).toBe(0.5);

        // Large values
        expect(pxToMm(118110.23622047245)).toBeCloseTo(10000);
        expect(pxToCm(118110.23622047245)).toBeCloseTo(1000);
        expect(pxToInch(30000)).toBe(100);
      });
    });
  });

  describe('Scale and DPI Functions', () => {
    it('should calculate pixel scale', () => {
      expect(pxScale(100, 10)).toBeCloseTo(1.1811023622047245);
    });

    it('should calculate DPI from pixels', () => {
      expect(dpiFromPx(300, 25.4)).toBe(300);
    });

    it('should calculate DPI scale', () => {
      expect(dpiScale(300, 96)).toBeCloseTo(3.125);
    });

    it('should calculate pixels per millimeter', () => {
      expect(ppm()).toBeCloseTo(11.811023622047244);
    });

    it('should scale values', () => {
      expect(scale(100, 2)).toBe(200);
    });

    it('should handle edge cases in scale and DPI functions', () => {
      // Zero values
      expect(pxScale(0, 10)).toBe(0);
      expect(pxScale(100, 0)).toBe(0);
      expect(dpiFromPx(0, 25.4)).toBe(0);
      expect(dpiFromPx(300, 0)).toBe(Infinity);
      expect(dpiScale(0, 96)).toBe(0);
      expect(dpiScale(300, 0)).toBe(Infinity);
      expect(ppm(0)).toBe(0);
      expect(scale(0, 2)).toBe(0);
      expect(scale(100, 0)).toBe(0);

      // Negative values
      expect(pxScale(-100, 10)).toBeCloseTo(-1.1811023622047245);
      expect(dpiFromPx(-300, 25.4)).toBe(-300);
      expect(dpiScale(-300, 96)).toBeCloseTo(-3.125);
      expect(scale(-100, 2)).toBe(-200);
      expect(scale(100, -2)).toBe(-200);

      // Fractional values
      expect(pxScale(50, 10)).toBeCloseTo(2.362204724409449);
      expect(dpiFromPx(150, 25.4)).toBe(150);
      expect(dpiScale(150, 96)).toBeCloseTo(1.5625);
      expect(scale(100, 0.5)).toBe(50);

      // Large values
      expect(pxScale(10000, 10)).toBeCloseTo(0.011811023622047244);
      expect(dpiFromPx(30000, 25.4)).toBeCloseTo(30000);
      expect(dpiScale(30000, 96)).toBeCloseTo(312.5);
      expect(scale(100, 1000)).toBe(100000);
    });
  });

  describe('Utility Functions', () => {
    it('should calculate percentage', () => {
      expect(percent(50, 200)).toBe(25);
    });

    it('should calculate aspect ratio', () => {
      expect(aspectRatio(1920, 1080)).toEqual([16, 9]);
      expect(aspectRatio(640, 480)).toEqual([4, 3]);
    });

    it('should handle edge cases in utility functions', () => {
      // Percentage edge cases
      expect(percent(0, 100)).toBe(0);
      expect(percent(100, 100)).toBe(100);
      expect(percent(50, 0)).toBe(Infinity);
      expect(percent(-50, 100)).toBe(-50);
      expect(percent(50, -100)).toBe(-50);
      expect(percent(0, 0)).toBeNaN();

      // Aspect ratio edge cases
      expect(aspectRatio(0, 1080)).toEqual([0, 1]);
      expect(aspectRatio(1920, 0)).toEqual([1, 0]);
      expect(aspectRatio(0, 0)).toEqual([NaN, NaN]);
      expect(aspectRatio(100, 100)).toEqual([1, 1]);
      expect(aspectRatio(7, 13)).toEqual([7, 13]);
      expect(aspectRatio(1000, 1)).toEqual([1000, 1]);
    });
  });
});
