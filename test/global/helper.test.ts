import { describe, expect, it } from 'vitest';
import { extract, nullify, nullifyItems, typify, typifyItem, unit } from '../../lib/index.js';

describe('Helper Utilities', () => {
  describe('Extract', () => {
    it('should convert string to boolean', () => {
      expect(extract('true')).toBe(true);
      expect(extract('false')).toBe(false);
    });

    it('should convert string to number', () => {
      expect(extract('123')).toBe(123);
      expect(extract('-123.45')).toBe(-123.45);
    });

    it('should convert string to date', () => {
      const date = new Date('2023-01-01');
      expect(extract('2023-01-01')).toEqual(date);
    });

    it('should handle null and undefined', () => {
      expect(extract('null')).toBe(null);
      expect(extract('undefined')).toBe(undefined);
    });

    // Edge cases
    it('should preserve non-string values', () => {
      expect(extract(true)).toBe(true);
      expect(extract(false)).toBe(false);
      expect(extract(123)).toBe(123);
      expect(extract(null)).toBe(null);
      expect(extract(undefined)).toBe(undefined);
      expect(extract({})).toEqual({});
      expect(extract([])).toEqual([]);
    });

    it('should handle edge cases for numbers', () => {
      expect(extract('0')).toBe(0);
      expect(extract('-0')).toBe(-0);
      expect(extract('.5')).toBe(0.5);
      expect(extract('-.5')).toBe(-0.5);
      expect(extract('1.23456789')).toBe(1.23456789);
    });

    it('should handle edge cases for booleans', () => {
      expect(extract('TRUE')).toBe('TRUE'); // Should not convert
      expect(extract('FALSE')).toBe('FALSE'); // Should not convert
      expect(extract('True')).toBe('True'); // Should not convert
      expect(extract('False')).toBe('False'); // Should not convert
    });

    it('should handle edge cases for dates', () => {
      // Valid date strings
      expect(extract('2023-01-01T00:00:00.000Z')).toBeInstanceOf(Date);
      expect(extract('2023-01-01T00:00:00Z')).toBeInstanceOf(Date);

      // Invalid date strings should remain as strings
      expect(extract('invalid-date')).toBe('invalid-date');
      expect(extract('2023-13-01')).toBe('2023-13-01'); // Invalid month
    });

    it('should handle edge cases for null and undefined', () => {
      expect(extract('null')).toBe(null);
      expect(extract('undefined')).toBe(undefined);
      expect(extract('NULL')).toBe('NULL'); // Should not convert
      expect(extract('UNDEFINED')).toBe('UNDEFINED'); // Should not convert
    });
  });

  describe('Unit', () => {
    it('should extract value and unit from string', () => {
      expect(unit('10px')).toEqual({ value: 10, unit: 'px' });
      expect(unit('-20.5em')).toEqual({ value: -20.5, unit: 'em' });
    });

    it('should return undefined for invalid unit strings', () => {
      expect(unit('invalid')).toBeUndefined();
      expect(unit('123')).toBeUndefined();
    });

    // Edge cases
    it('should handle edge cases for unit strings', () => {
      expect(unit('0px')).toEqual({ value: 0, unit: 'px' });
      expect(unit('.5rem')).toEqual({ value: 0.5, unit: 'rem' });
      expect(unit('-.5rem')).toEqual({ value: -0.5, unit: 'rem' });
      expect(unit('100%')).toEqual({ value: 100, unit: '%' });
      expect(unit('-50%')).toEqual({ value: -50, unit: '%' });
      expect(unit('10.5pt')).toEqual({ value: 10.5, unit: 'pt' });
      expect(unit('2.5em')).toEqual({ value: 2.5, unit: 'em' });
    });

    it('should handle edge cases for invalid unit strings', () => {
      expect(unit('')).toBeUndefined();
      expect(unit('px')).toBeUndefined();
      expect(unit('10')).toBeUndefined();
      expect(unit('10.')).toBeUndefined();
      expect(unit('.')).toBeUndefined();
      expect(unit('10.5.2px')).toBeUndefined();
      expect(unit('10 5px')).toBeUndefined();
      expect(unit('10px 5px')).toBeUndefined();
      expect(unit(null as any)).toBeUndefined();
      expect(unit(undefined as any)).toBeUndefined();
      expect(unit(123 as any)).toBeUndefined();
    });
  });

  describe('Typify', () => {
    it('should convert object string values to appropriate types', () => {
      const input = {
        bool: 'true',
        num: '123',
        date: '2023-01-01',
        nested: {
          value: '456',
        },
      };

      const expected = {
        bool: true,
        num: 123,
        date: new Date('2023-01-01'),
        nested: {
          value: 456,
        },
      };

      expect(typify(input)).toEqual(expected);
    });

    // Edge cases
    it('should handle edge cases for typify', () => {
      // Empty object
      expect(typify({})).toEqual({});

      // Object with no convertible values
      const obj1 = {
        str: 'hello',
        bool: true,
        num: 123,
        arr: [1, 2, 3],
        obj: { a: 'b' },
      };
      expect(typify(obj1)).toEqual({
        str: 'hello',
        bool: true,
        num: 123,
        arr: [1, 2, 3],
        obj: { a: 'b' },
      });

      // Deeply nested object
      const nested = {
        level1: {
          level2: {
            level3: {
              value: 'true',
            },
          },
          array: ['1', '2', 'false'],
        },
      };

      expect(typify(nested)).toEqual({
        level1: {
          level2: {
            level3: {
              value: true,
            },
          },
          array: [1, 2, false],
        },
      });

      // Mixed convertible and non-convertible values
      const mixed = {
        convertTrue: 'true',
        dontConvert: 'TRUE',
        convertNum: '42',
        dontConvertAlpha: '42px',
        convertNegative: '-3.14',
        convertDate: '2023-01-01',
        nullVal: 'null',
        undefVal: 'undefined',
      };

      expect(typify(mixed)).toEqual({
        convertTrue: true,
        dontConvert: 'TRUE',
        convertNum: 42,
        dontConvertAlpha: '42px',
        convertNegative: -3.14,
        convertDate: new Date('2023-01-01'),
        nullVal: null,
        undefVal: undefined,
      });
    });

    it('should handle arrays in objects', () => {
      const input = {
        arr: ['true', '123', '2023-01-01'],
        nested: {
          arr: ['false', '456'],
        },
      };

      const result = typify(input);
      expect(result.arr).toEqual([true, 123, new Date('2023-01-01')]);
      expect(result.nested.arr).toEqual([false, 456]);
    });
  });

  describe('TypifyItem', () => {
    it('should convert array string values to appropriate types', () => {
      const input = ['true', '123', '2023-01-01'];
      const expected = [true, 123, new Date('2023-01-01')];

      expect(typifyItem(input)).toEqual(expected);
    });

    // Edge cases
    it('should handle edge cases for typifyItem', () => {
      // Empty array
      expect(typifyItem([])).toEqual([]);

      // Array with no convertible values
      expect(typifyItem(['hello', 'world'])).toEqual(['hello', 'world']);

      // Mixed convertible and non-convertible values
      expect(typifyItem(['true', 'TRUE', '123', '123px', '-3.14'])).toEqual([true, 'TRUE', 123, '123px', -3.14]);

      // Nested arrays
      expect(typifyItem(['true', ['false', '123'], '456'])).toEqual([true, [false, 123], 456]);

      // Array with objects
      expect(typifyItem(['true', { value: '123' }, 'false'])).toEqual([true, { value: 123 }, false]);

      // Array with non-string values
      expect(typifyItem([true, 123, null, undefined])).toEqual([true, 123, null, undefined]);
    });
  });

  describe('Nullify', () => {
    it('should replace undefined values with null in objects', () => {
      const input = {
        a: undefined,
        b: 123,
        c: {
          d: undefined,
        },
      };

      const expected = {
        a: null,
        b: 123,
        c: {
          d: null,
        },
      };

      expect(nullify(input)).toEqual(expected);
    });

    // Edge cases
    it('should handle edge cases for nullify', () => {
      // Empty object
      expect(nullify({})).toEqual({});

      // Object with no undefined values
      const obj1 = {
        a: 123,
        b: 'hello',
        c: true,
        d: null,
      };
      expect(nullify(obj1)).toEqual(obj1);

      // Deeply nested object with undefined values
      const nested = {
        level1: {
          level2: {
            level3: {
              value: undefined,
            },
          },
          array: [undefined, 1, 2],
        },
        value: undefined,
      };

      expect(nullify(nested)).toEqual({
        level1: {
          level2: {
            level3: {
              value: null,
            },
          },
          array: [null, 1, 2],
        },
        value: null,
      });

      // Object with NaN values
      const withNaN = {
        a: NaN,
        b: 123,
        c: {
          d: NaN,
        },
      };

      expect(nullify(withNaN)).toEqual({
        a: null,
        b: 123,
        c: {
          d: null,
        },
      });
    });

    it('should handle arrays in objects with nullify', () => {
      const input = {
        arr: [undefined, 1, undefined],
        nested: {
          arr: [NaN, 2],
        },
      };

      expect(nullify(input)).toEqual({
        arr: [null, 1, null],
        nested: {
          arr: [null, 2],
        },
      });
    });
  });

  describe('NullifyItems', () => {
    it('should replace undefined values with null in arrays', () => {
      const input = [undefined, 123, [undefined]];
      const expected = [null, 123, [null]];

      expect(nullifyItems(input)).toEqual(expected);
    });

    // Edge cases
    it('should handle edge cases for nullifyItems', () => {
      // Empty array
      expect(nullifyItems([])).toEqual([]);

      // Array with no undefined values
      expect(nullifyItems([1, 2, 3])).toEqual([1, 2, 3]);

      // Array with NaN values
      expect(nullifyItems([NaN, 1, NaN])).toEqual([null, 1, null]);

      // Nested arrays with undefined values
      expect(nullifyItems([undefined, [undefined, 1, [undefined]], 2])).toEqual([null, [null, 1, [null]], 2]);

      // Array with objects containing undefined
      expect(nullifyItems([undefined, { a: undefined, b: 1 }, null])).toEqual([null, { a: null, b: 1 }, null]);

      // Mixed array with various falsy values
      expect(nullifyItems([undefined, null, 0, false, '', NaN])).toEqual([null, null, 0, false, '', null]);
    });
  });
});
