import { extract } from '../src/converter';
import { isDate } from '../src/inspector';

describe('Extract', function() {
  it('should preserve true as true', function() {
    const bool = extract(true);
    expect(bool).toBe(true);
  });

  it('should convert "true" into true', function() {
    const bool = extract('true');
    expect(bool).toBe(true);
  });

  it('should convert "false" into false', function() {
    const bool = extract('false');
    expect(bool).toBe(false);
  });

  it('should convert "10" into 10', function() {
    const bool = extract('10');
    expect(bool).toBe(10);
  });

  it('should convert "undefined" into undefined', function() {
    const bool = extract('undefined');
    expect(bool).toBe(undefined);
  });

  it('should convert "null" into null', function() {
    const bool = extract('null');
    expect(bool).toBe(null);
  });

  it('should convert "2023-02-04T06:25:49.231Z" into Date', function() {
    const bool = extract('2023-02-04T06:25:49.231Z');
    expect(isDate(bool)).toBe(true);
  });
});
