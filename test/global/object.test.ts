import { describe, expect, it } from 'vitest';
import {
  clone,
  cloneMap,
  cloneSet,
  entries,
  merge,
  mergeItems,
  nestedPathMaps,
  nestedPaths,
  read,
  remove,
  replace,
  replaceItems,
  splitItems,
  stringify,
  write,
} from '../../lib/index.js'; // eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const obj: any = {
  a: 1,
  b: 2,
  c: {
    a: 1,
    b: 2,
    c: {
      a: 1,
      b: 2,
    },
  },
  d: {
    a: 1,
    b: 2,
  },
};

describe('Object Reader', function () {
  it(`should return 1 when calling read(obj, 'a')`, function () {
    const testObj = JSON.parse(JSON.stringify(obj));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(read(testObj, 'a')).toBe(1);
  });

  it(`should return 2 when calling read(obj, 'b')`, function () {
    const testObj = JSON.parse(JSON.stringify(obj));
    expect(read(testObj, 'b')).toBe(2);
  });

  it(`should return 1 when calling read(obj, 'c.a')`, function () {
    const testObj = JSON.parse(JSON.stringify(obj));
    expect(read(testObj, 'c.a')).toBe(1);
  });

  it(`should return 2 when calling read(obj, 'c.c.b')`, function () {
    const testObj = JSON.parse(JSON.stringify(obj));
    expect(read(testObj, 'c.c.b')).toBe(2);
  });
});

describe('Object Writer', function () {
  it('should write 10 to "obj.a".', function () {
    const testObj = JSON.parse(JSON.stringify(obj));
    write(testObj, 'a', 10);
    expect(testObj.a).toBe(10);
  });

  it('should write 4 to "obj.b".', function () {
    const testObj = JSON.parse(JSON.stringify(obj));
    write(testObj, 'b', 4);
    expect(testObj.b).toBe(4);
  });

  it('should write 4 to "obj.c.c.b".', function () {
    const testObj = JSON.parse(JSON.stringify(obj));
    write(testObj, 'c.c.b', 4);
    expect(testObj.c.c.b).toBe(4);
  });

  it('should write 4 to "obj.e.0.a", and "obj.e" is an array.', function () {
    const testObj = JSON.parse(JSON.stringify(obj));
    write(testObj, 'e.0.a', 4);
    expect(Array.isArray(testObj.e)).toBe(true);
    expect(testObj.e[0].a).toBe(4);
  });

  it('should write 4 to "obj.f.0.0", and "obj.e" is an array.', function () {
    const testObj = JSON.parse(JSON.stringify(obj));
    write(testObj, 'f.0.0', 4);
    expect(Array.isArray(testObj.f[0])).toBe(true);
    expect(testObj.f[0][0]).toBe(4);
  });
});

describe('Object Remover', function () {
  it('should remove property "a" from object', function () {
    const testObj = JSON.parse(JSON.stringify({ a: 1, b: 2 }));
    remove(testObj, 'a');
    expect(testObj.a).toBeUndefined();
    expect(testObj.b).toBe(2);
  });

  it('should remove nested property "c.a" from object', function () {
    const testObj = JSON.parse(JSON.stringify({ a: 1, c: { a: 1, b: 2 } }));
    remove(testObj, 'c.a');
    expect(testObj.c.a).toBeUndefined();
    expect(testObj.c.b).toBe(2);
  });

  it('should remove array element at index 1', function () {
    const testObj = JSON.parse(JSON.stringify({ arr: [1, 2, 3] }));
    remove(testObj, 'arr.1');
    expect(testObj.arr.length).toBe(2);
    expect(testObj.arr[0]).toBe(1);
    expect(testObj.arr[1]).toBe(3);
  });
});

describe('Object Cloner', function () {
  it('should clone a simple object', function () {
    const original = { a: 1, b: 2 };
    const cloned = clone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  it('should clone a nested object', function () {
    const original = { a: 1, b: { c: 2 } };
    const cloned = clone(original);
    expect(cloned).toEqual(original);
    expect(cloned.b).not.toBe(original.b);
  });

  it('should perform deep cloning without references to original objects', function () {
    const original = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          f: [1, 2, 3],
        },
      },
      g: [4, 5, { h: 6 }],
    };

    const cloned = clone(original);

    // Check that the cloned object equals the original
    expect(cloned).toEqual(original);

    // Check that the cloned object is not the same reference as original
    expect(cloned).not.toBe(original);

    // Check that nested objects are not the same references
    expect(cloned.b).not.toBe(original.b);
    expect(cloned.b.d).not.toBe(original.b.d);
    expect(cloned.g).not.toBe(original.g);

    // Check that nested arrays are not the same references
    expect(cloned.b.d.f).not.toBe(original.b.d.f);
    expect(cloned.g).not.toBe(original.g);

    // Check that objects inside arrays are not the same references
    expect(cloned.g[2]).not.toBe(original.g[2]);

    // Modify the cloned object to verify independence
    cloned.b.c = 999;
    cloned.b.d.e = 888;
    cloned.g[0] = 777;
    cloned.b.d.f[0] = 666;

    // Verify original object is unchanged
    expect(original.b.c).toBe(2);
    expect(original.b.d.e).toBe(3);
    expect(original.g[0]).toBe(4);
    expect(original.b.d.f[0]).toBe(1);
  });

  it('should clone a Map', function () {
    const original = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const cloned = clone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  it('should clone a Set', function () {
    const original = new Set([1, 2, 3]);
    const cloned = clone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  it('should clone a Date', function () {
    const original = new Date('2022-01-01');
    const cloned = clone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });
});

describe('Map and Set cloners', function () {
  it('should clone a Map with nested values', function () {
    const original = new Map([
      ['a', { b: 1 }],
      ['c', [1, 2]],
    ]);
    const cloned = cloneMap(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.get('a')).not.toBe(original.get('a'));
  });

  it('should clone a Set with nested values', function () {
    const original = new Set([{ a: 1 }, [1, 2]]);
    const cloned = cloneSet(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });
});

describe('Object Merger', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    a: 1,
    b: 2,
    c: {
      a: 1,
      b: 2,
      c: 3,
    },
  };

  it('should merge { g: 10 } into "data"', function () {
    const testData = JSON.parse(JSON.stringify(data));
    merge(testData, { g: 10 });

    // Existing value must be preserved.
    expect(testData.a).toBe(1);
    // New value must be available.
    expect(testData.g).toBe(10);
  });

  it('should recursively merge { c: { d: 10 }, g: 11 } into "data"', function () {
    const testData = JSON.parse(JSON.stringify(data));
    merge(testData, { c: { d: 10 }, g: 11 });

    // Existing value must be preserved.
    expect(testData.a).toBe(1);
    expect(testData.c.a).toBe(1);
    // New value must be defined.
    expect(testData.c.d).toBe(10);
    expect(testData.g).toBe(11);
  });
});

describe('Array Merger', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    a: 1,
    b: [
      {
        a: 1,
        b: 2,
      },
      {
        a: 1,
        b: 2,
      },
    ],
    c: [],
  };

  it('should merge { b: [ { b: 3 } ] } into "data"', function () {
    const testData = JSON.parse(JSON.stringify(data));
    merge(testData, { b: [{ b: 3 }] });

    expect(testData.b[0].a).toBe(1);
    expect(testData.b[0].b).toBe(3);
    expect(testData.b[1].a).toBe(1);
  });

  it('should merge { c: [ { a: 3 },{ a: 1 } ] } into "data"', function () {
    const testData = JSON.parse(JSON.stringify(data));
    merge(testData, { c: [{ a: 3 }, { a: 1 }] });

    expect(testData.c[0].a).toBe(3);
    expect(testData.c[1].a).toBe(1);
    expect(testData.c[1].b).toBe(undefined);
  });

  it('should merge [ { b: 5 } ] into "data.b"', function () {
    const testData = JSON.parse(JSON.stringify(data));
    mergeItems(testData.b, [{ b: 5 }]);

    expect(testData.a).toBe(1);
    expect(testData.b[0].a).toBe(1);
    expect(testData.b[0].b).toBe(5);
    expect(testData.b[1].a).toBe(1);
  });

  it('should merge [ { a: 5 }, { a: 5 } ] } into "data.c"', function () {
    const testData = JSON.parse(JSON.stringify(data));
    mergeItems(testData.c, [{ a: 5 }, { a: 5 }]);

    expect(testData.a).toBe(1);
    expect(testData.c[0].a).toBe(5);
    expect(testData.c[1].a).toBe(5);
  });
});

describe('Object Replacer', function () {
  const data = {
    a: 1,
    b: {
      a: 1,
      b: 2,
    },
    c: [{ a: 1 }, { a: 2 }, { a: 3 }],
  };

  it('should replace "data" with { a: 5 }', function () {
    const d = JSON.parse(JSON.stringify(data));
    replace(d, { a: 5 });

    expect(d.a).toBe(5);
    expect(d.b).toBe(undefined);
    expect(d.c).toBe(undefined);
  });

  it('should recursively replace "data" with { a: 10, b: { a: 2, c: 3 }, c: [ { a: 5 } ] }', function () {
    const d = JSON.parse(JSON.stringify(data));
    replace(d, { a: 10, b: { a: 2, c: 3 }, c: [{ a: 5 }] });

    expect(d.a).toBe(10);
    expect(d.b.a).toBe(2);
    expect(d.b.c).toBe(3);
    expect(d.c[0].a).toBe(5);

    expect(d.b.b).toBe(undefined);
    expect(d.c[1]).toBe(undefined);
  });
});

describe('Array Replacer', function () {
  const data = {
    a: 1,
    b: {
      a: 1,
      b: 2,
    },
    c: [{ a: 1 }, { a: 2 }, { a: 3 }],
  };

  it('should replace "data.b" with [ { a: 5 } ]', function () {
    const d = JSON.parse(JSON.stringify(data));
    replace(d, { b: [{ a: 5 }] });

    expect(Array.isArray(d.b)).toBe(true);
    expect(d.b[0].a).toBe(5);
    expect(d.b.a).toBe(undefined);
  });

  it('should replace "data.c" with [ { a: 5 }, { a: 6 } ]', function () {
    const d = JSON.parse(JSON.stringify(data));
    replaceItems(d.c, [{ a: 5 }, { a: 6 }]);

    expect(d.c[0].a).toBe(5);
    expect(d.c[1].a).toBe(6);
    expect(d.c[2]).toBe(undefined);
  });
});

describe('Array Splitter', function () {
  it('should split array into columns with max rows', function () {
    const array = [1, 2, 3, 4, 5, 6, 7];
    const result = splitItems(array, 3);

    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('should return single column when array length is less than max rows', function () {
    const array = [1, 2, 3];
    const result = splitItems(array, 5);

    expect(result).toEqual([[1, 2, 3]]);
  });
});

describe('Object Stringifier', function () {
  it('should convert object to raw string', function () {
    const obj = { a: 1, b: 'test' };
    const result = stringify(obj);

    expect(result).toBe('{"a":1,"b":"test"}');
  });

  it('should convert array to raw string', function () {
    const arr = [1, 2, 'test'];
    const result = stringify(arr);

    expect(result).toBe('[1,2,"test"]');
  });

  it('should convert function to string', function () {
    const fn = function test() {
      return 'test';
    };
    const result = stringify(fn);

    expect(result).toBe(fn.toString());
  });
});

describe('Typed Object Entries', function () {
  it('should return typed entries of an object', function () {
    const obj = { a: 1, b: 'test' };
    const result = entries(obj);

    expect(result).toEqual([
      ['a', 1],
      ['b', 'test'],
    ]);
  });
});

describe('Nested Paths', function () {
  it('should get all nested paths of an object', function () {
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
    const result = nestedPaths(obj);

    expect(result).toEqual(['a', 'b', 'b.c', 'b.d', 'b.d.e']);
  });

  it('should get all nested paths of an array', function () {
    const arr = [{ a: 1 }, { b: 2 }];
    const result = nestedPaths(arr);

    expect(result).toEqual(['0', '0.a', '1', '1.b']);
  });
});

describe('Nested Path Maps', function () {
  it('should get nested path maps of an object', function () {
    const obj = { a: 1, b: { c: 2 } };
    const result = nestedPathMaps(obj);

    expect(result).toEqual({ a: 1, b: { c: 2 }, 'b.c': 2 });
  });

  it('should get nested path maps with value replacement', function () {
    const obj = { a: 1, b: { c: 2 } };
    const result = nestedPathMaps(obj, (key, value) => {
      if (key === 'a') return 10;
      return value;
    });

    expect(result).toEqual({ a: 10, b: { c: 2 }, 'b.c': 2 });
  });
});

describe('Object Reader Edge Cases', function () {
  it('should throw error when trying to read from non-object', function () {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      read('string', 'a');
    }).toThrow('Can not get a from string!');
  });

  it('should return fallback value when key is not found', function () {
    const obj = { a: 1 };
    expect(read(obj, 'b' as never, 'default')).toBe('default');
  });

  it('should handle reading from array with numeric keys', function () {
    const obj = { arr: [1, 2, 3] };
    expect(read(obj, 'arr.1')).toBe(2);
  });

  it('should handle reading from deeply nested paths with missing intermediates', function () {
    const obj = { a: {} };
    expect(read(obj, 'a.b.c' as never, 'default')).toBe('default');
  });
});

describe('Object Writer Edge Cases', function () {
  it('should throw error when trying to write to non-object', function () {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      write('string', 'a', 'value');
    }).toThrow('Can not set a to string.');
  });

  it('should create intermediate objects when writing to deep paths', function () {
    const obj = {};
    write(obj, 'a.b.c' as never, 'value' as never);
    expect(obj).toEqual({ a: { b: { c: 'value' } } });
  });

  it('should create intermediate arrays when writing to numeric paths', function () {
    const obj = {};
    write(obj, 'a.0.b' as never, 'value' as never);
    expect(obj).toEqual({ a: [{ b: 'value' }] });
  });
});

describe('Object Remover Edge Cases', function () {
  it('should throw error when trying to remove from non-object', function () {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      remove('string', 'a');
    }).toThrow('Can not remove a from string.');
  });

  it('should handle removing non-existent properties', function () {
    const obj = { a: 1 };
    remove(obj, 'b' as never);
    expect(obj).toEqual({ a: 1 });
  });

  it('should handle removing from deeply nested paths', function () {
    const obj = { a: { b: { c: 1 } } };
    remove(obj, 'a.b.c' as never);
    expect(obj).toEqual({ a: { b: {} } });
  });
});

describe('Object Cloner Edge Cases', function () {
  it('should clone primitive values', function () {
    expect(clone(1)).toBe(1);
    expect(clone('string')).toBe('string');
    expect(clone(true)).toBe(true);
  });

  it('should clone null and undefined', function () {
    expect(clone(null)).toBe(null);
    expect(clone(undefined)).toBe(undefined);
  });

  it('should clone empty objects and arrays', function () {
    expect(clone({})).toEqual({});
    expect(clone([])).toEqual([]);
  });

  it('should properly clone objects with special values', function () {
    const obj = {
      nullVal: null,
      undefVal: undefined,
      num: 0,
      str: '',
      bool: false,
    };
    const cloned = clone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });
});

describe('Merge Functions Edge Cases', function () {
  it('should handle merging with null values', function () {
    const target = { a: 1 };
    merge(target, { a: null });
    expect(target.a).toBe(null);
  });

  it('should handle merging arrays with different lengths and cleanup', function () {
    const target = { arr: [1, 2, 3] };
    merge(target, { arr: [4, 5] }, true);
    expect(target.arr).toEqual([4, 5]);
  });

  it('should handle merging undefined values', function () {
    const target = { a: 1 };
    merge(target, { a: undefined });
    expect(target.a).toBe(undefined);
  });
});

describe('Split Items Edge Cases', function () {
  it('should handle empty arrays', function () {
    const result = splitItems([], 3);
    expect(result).toEqual([]);
  });

  it('should handle exact multiples of maxRows', function () {
    const array = [1, 2, 3, 4, 5, 6];
    const result = splitItems(array, 3);
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it('should handle maxRows of 0 or negative numbers', function () {
    const array = [1, 2, 3];
    const result = splitItems(array, 0);
    expect(result).toEqual([[1, 2, 3]]);
  });
});

describe('Stringify Edge Cases', function () {
  it('should handle null and undefined values', function () {
    expect(stringify(null)).toBe('null');
    expect(stringify(undefined)).toBe(undefined);
  });

  it('should handle nested objects with various data types', function () {
    const obj = {
      num: 1,
      str: 'test',
      bool: true,
      nullVal: null,
      arr: [1, 2],
      nested: { a: 1 },
    };
    const result = stringify(obj);
    expect(result).toBe('{"num":1,"str":"test","bool":true,"nullVal":null,"arr":[1,2],"nested":{"a":1}}');
  });
});

describe('Nested Paths Edge Cases', function () {
  it('should handle empty objects', function () {
    const result = nestedPaths({});
    expect(result).toEqual([]);
  });

  it('should handle empty arrays', function () {
    const result = nestedPaths([]);
    expect(result).toEqual([]);
  });

  it('should handle complex nested structures', function () {
    const obj = {
      a: [
        {
          b: {
            c: [1, 2],
          },
        },
      ],
    };
    const result = nestedPaths(obj);
    expect(result).toEqual(['a', 'a.0', 'a.0.b', 'a.0.b.c', 'a.0.b.c.0', 'a.0.b.c.1']);
  });
});
