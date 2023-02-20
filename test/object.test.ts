import { merge, mergeItems, read, replace, replaceItems, write } from '../src/object';

const obj: any = {
  a: 1,
  b: 2,
  c: {
    a: 1,
    b: 2,
    c: {
      a: 1,
      b: 2
    }
  },
  d: {
    a: 1,
    b: 2
  }
};

describe('Object Reader', function() {
  it(`should return 1 when calling read(obj, 'a')`, function() {
    expect(read(obj, 'a')).toBe(1);
  });

  it(`should return 2 when calling read(obj, 'b')`, function() {
    expect(read(obj, 'b')).toBe(2);
  });

  it(`should return 1 when calling read(obj, 'c.a')`, function() {
    expect(read(obj, 'c.a')).toBe(1);
  });

  it(`should return 2 when calling read(obj, 'c.c.b')`, function() {
    expect(read(obj, 'c.c.b')).toBe(2);
  });
});

describe('Object Writer', function() {
  it('should write 10 to "obj.a".', function() {
    write(obj, 'a', 10);
    expect(obj.a).toBe(10);
  });

  it('should write 4 to "obj.b".', function() {
    write(obj, 'b', 4);
    expect(obj.b).toBe(4);
  });

  it('should write 4 to "obj.c.c.b".', function() {
    write(obj, 'c.c.b', 4);
    expect(obj.c.c.b).toBe(4);
  });

  it('should write 4 to "obj.e.0.a", and "obj.e" is an array.', function() {
    write(obj, 'e.0.a', 4);
    expect(Array.isArray(obj.e)).toBe(true);
    expect(obj.e[0].a).toBe(4);
  });

  it('should write 4 to "obj.f.0.0", and "obj.e" is an array.', function() {
    write(obj, 'f.0.0', 4);
    expect(Array.isArray(obj.f[0])).toBe(true);
    expect(obj.f[0][0]).toBe(4);
  });
});

describe('Object Merger', function() {
  const data: any = {
    a: 1,
    b: 2,
    c: {
      a: 1,
      b: 2,
      c: 3
    }
  };

  it('should merge { g: 10 } into "data"', function() {
    merge(data, { g: 10 });

    // Existing value must be preserved.
    expect(data.a).toBe(1);
    // New value must be available.
    expect(data.g).toBe(10);
  });

  it('should recursively merge { c: { d: 10 }, g: 11 } into "data"', function() {
    merge(data, { c: { d: 10 }, g: 11 });

    // Existing value must be preserved.
    expect(data.a).toBe(1);
    expect(data.c.a).toBe(1);
    // New value must be defined.
    expect(data.c.d).toBe(10);
    expect(data.g).toBe(11);
  });
});

describe('Array Merger', function() {
  const data: any = {
    a: 1,
    b: [
      {
        a: 1,
        b: 2
      },
      {
        a: 1,
        b: 2
      }
    ],
    c: []
  };

  it('should merge { b: [ { b: 3 } ] } into "data"', function() {
    merge(data, { b: [ { b: 3 } ] });

    expect(data.b[0].a).toBe(1);
    expect(data.b[0].b).toBe(3);
    expect(data.b[1].a).toBe(1);
  });

  it('should merge { c: [ { a: 3 },{ a: 1 } ] } into "data"', function() {
    merge(data, { c: [ { a: 3 }, { a: 1 } ] });

    expect(data.c[0].a).toBe(3);
    expect(data.c[1].a).toBe(1);
    expect(data.c[1].b).toBe(undefined);
  });

  it('should merge [ { b: 5 } ] into "data.b"', function() {
    mergeItems(data.b, [ { b: 5 } ]);

    expect(data.a).toBe(1);
    expect(data.b[0].a).toBe(1);
    expect(data.b[0].b).toBe(5);
    expect(data.b[1].a).toBe(1);
  });

  it('should merge [ { a: 5 }, { a: 5 } ] } into "data.c"', function() {
    mergeItems(data.c, [ { a: 5 }, { a: 5 } ]);

    expect(data.a).toBe(1);
    expect(data.c[0].a).toBe(5);
    expect(data.c[1].a).toBe(5);
  });
});

describe('Object Replacer', function() {
  const data: any = {
    a: 1,
    b: {
      a: 1,
      b: 2
    },
    c: [ { a: 1 }, { a: 2 }, { a: 3 } ]
  };

  it('should replace "data" with { a: 5 }', function() {
    const d = JSON.parse(JSON.stringify(data));
    replace(d, { a: 5 });

    expect(d.a).toBe(5);
    expect(d.b).toBe(undefined);
    expect(d.c).toBe(undefined);
  });

  it('should recursively replace "data" with { a: 10, b: { a: 2, c: 3 }, c: [ { a: 5 } ] }', function() {
    const d = JSON.parse(JSON.stringify(data));
    replace(d, { a: 10, b: { a: 2, c: 3 }, c: [ { a: 5 } ] });

    expect(d.a).toBe(10);
    expect(d.b.a).toBe(2);
    expect(d.b.c).toBe(3);
    expect(d.c[0].a).toBe(5);

    expect(d.b.b).toBe(undefined);
    expect(d.c[1]).toBe(undefined);
  });
});

describe('Array Replacer', function() {
  const data: any = {
    a: 1,
    b: {
      a: 1,
      b: 2
    },
    c: [ { a: 1 }, { a: 2 }, { a: 3 } ]
  };

  it('should replace "data.b" with [ { a: 5 } ]', function() {
    const d = JSON.parse(JSON.stringify(data));
    replace(d, { b: [ { a: 5 } ] });

    expect(Array.isArray(d.b)).toBe(true);
    expect(d.b[0].a).toBe(5);
    expect(d.b.a).toBe(undefined);
  });

  it('should replace "data.c" with [ { a: 5 }, { a: 6 } ]', function() {
    const d = JSON.parse(JSON.stringify(data));
    replaceItems(d.c, [ { a: 5 }, { a: 6 } ]);

    expect(d.c[0].a).toBe(5);
    expect(d.c[1].a).toBe(6);
    expect(d.c[2]).toBe(undefined);
  });
});
