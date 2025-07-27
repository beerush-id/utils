type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
export type Unit = 'px' | 'mm' | 'cm' | 'in';
export type UnitMap = {
  [key in Unit]: {
    name: string;
    label: string;
  };
};

export const DEFAULT_UNIT: Unit = 'mm';
export const KNOWN_UNITS = {
  px: {
    name: 'px',
    label: 'Pixels',
  },
  mm: {
    name: 'mm',
    label: 'Millimetres',
  },
  cm: {
    name: 'cm',
    label: 'Centimetres',
  },
  in: {
    name: 'in',
    label: 'Inches',
  },
};
export const DEFAULT_DPI = 300;
export const DEFAULT_PPI = 96;
export const DEFAULT_DECIMALS = 2;
export const CM_PER_INCH = 2.54;
export const MM_PER_INCH = 25.4;

export type RulerValue = {
  mm: number;
  mms: string;
  px: number;
  pxs: string;
  cm: number;
  cms: string;
  in: number;
  ins: string;
  at: (ddpi?: number) => RulerValue;
};

export function rule(n: number | string, unit: Unit, dpi = DEFAULT_PPI, scale = 1): RulerValue {
  if (typeof n === 'string') {
    n = parseFloat(n);
  }

  const value = px(n, unit, dpi);

  return {
    get mm() {
      return unit === 'mm' ? (n as number) : toFixed(pxToMm(value * scale, dpi), DEFAULT_DECIMALS);
    },
    get mms() {
      return `${unit === 'mm' ? n : toFixed(pxToMm(value * scale, dpi), DEFAULT_DECIMALS)}mm`;
    },
    get cm() {
      return unit === 'cm' ? (n as number) : toFixed(pxToCm(value * scale, dpi), DEFAULT_DECIMALS);
    },
    get cms() {
      return `${unit === 'cm' ? n : toFixed(pxToCm(value * scale, dpi), DEFAULT_DECIMALS)}cm`;
    },
    get in() {
      return unit === 'in' ? (n as number) : toFixed(pxToInch(value * scale, dpi), DEFAULT_DECIMALS);
    },
    get ins() {
      return `${unit === 'in' ? n : toFixed(pxToInch(value * scale, dpi), DEFAULT_DECIMALS)}in`;
    },
    get px() {
      return unit === 'px' ? (n as number) : toFixed(value * scale, DEFAULT_DECIMALS);
    },
    get pxs() {
      return `${unit === 'px' ? n : toFixed(value * scale, DEFAULT_DECIMALS)}px`;
    },
    at(ppi = DEFAULT_PPI) {
      return rule(n, unit, ppi, scale);
    },
  };
}

export type Ruler = {
  mm: (n: number | string, s?: number) => RulerValue;
  cm: (n: number | string, s?: number) => RulerValue;
  in: (n: number | string, s?: number) => RulerValue;
  px: (n: number | string, s?: number) => RulerValue;
  of: (n: number | string, s?: number) => RulerValue;
  dpi: number;
  unit: Unit;
  scale: number;
};

export function createRuler(unit: Unit = 'px', ppi = DEFAULT_PPI, scale = 1): Ruler {
  return {
    mm: (n: number | string, s: number = scale) => rule(n, 'mm', ppi, s),
    cm: (n: number | string, s: number = scale) => rule(n, 'cm', ppi, s),
    in: (n: number | string, s: number = scale) => rule(n, 'in', ppi, s),
    px: (n: number | string, s: number = scale) => rule(n, 'px', ppi, s),
    of: (n: number | string, s: number = scale) => rule(n, unit, ppi, s),
    get dpi(): number {
      return ppi;
    },
    set dpi(d: number) {
      if (d !== ppi) {
        ppi = d;
      }
    },
    get unit(): Unit {
      return unit;
    },
    set unit(u: Unit) {
      if (unit !== u) {
        unit = u;
      }
    },
    get scale(): number {
      return scale;
    },
    set scale(s: number) {
      if (s !== scale) {
        scale = s;
      }
    },
  };
}

export function percent(a: number, b: number) {
  return (a / b) * 100;
}

export const ruler = createRuler();

function px(value: number | string, unit: Unit, dpi = DEFAULT_DPI, scale = 1): number {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  if (unit === 'mm') {
    return mmToPx(value * scale, dpi);
  } else if (unit === 'cm') {
    return cmToPx(value * scale, dpi);
  } else if (unit === 'in') {
    return inchToPx(value * scale, dpi);
  } else if (unit === 'px') {
    return toFixed(value * scale, DEFAULT_DECIMALS);
  }

  return toFixed(value * scale);
}

function toPixel<T>(obj: T, unit: Unit = 'mm', dpi = DEFAULT_DPI, scale = 1) {
  if (typeof obj === 'number') {
    return rule(calc(obj, scale), unit, dpi).px;
  } else if (typeof obj === 'function') {
    return (...args: unknown[]) => {
      return obj(...args.map((item) => toPixel(item, unit, dpi, scale)));
    };
  } else if (typeof obj === 'object') {
    return new Proxy(obj as never, {
      get: (target, prop) => {
        const value: unknown = Reflect.get(target, prop);

        if (typeof value === 'number') {
          return rule(calc(value, scale), unit, dpi).px;
        } else if (typeof value === 'function') {
          return (...args: unknown[]) => {
            const result = value.bind(target)(...args.map((item) => toPixel(item, unit, dpi, scale)));
            return fromPixel(result, unit, dpi, scale);
          };
        }

        return fromPixel(value, unit, dpi, scale);
      },
      set: (target, prop, value) => {
        Reflect.set(target, prop, toPixel(value, unit, dpi, scale));

        return true;
      },
    });
  }

  return obj;
}

function fromPixel<T>(obj: T, unit: Unit = 'mm', dpi = DEFAULT_DPI, scale = 1): T {
  if (typeof obj === 'number') {
    return (rule(calc(obj, scale), 'px', dpi)[unit] || obj) as never;
  } else if (typeof obj === 'function') {
    return ((...args: unknown[]) => {
      const result = obj(...args.map((item) => fromPixel(item, unit, dpi, scale)));
      return toPixel(result, unit, dpi, scale);
    }) as never;
  } else if (typeof obj === 'object') {
    return new Proxy(obj as never, {
      get: (target, prop) => {
        const value: unknown = Reflect.get(target, prop);

        if (typeof value === 'number') {
          return rule(calc(value, scale), unit, dpi).px;
        } else if (typeof value === 'function') {
          return (...args: unknown[]) => {
            const result = value.bind(target)(...args.map((item) => fromPixel(item, unit, dpi, scale)));
            return toPixel(result, unit, dpi, scale);
          };
        }

        return toPixel(value, unit, dpi, scale);
      },
      set: (target, prop, value) => {
        Reflect.set(target, prop, fromPixel(value, unit, dpi, scale));

        return true;
      },
    });
  }

  return obj;
}

function calc(n: number, scale = 1) {
  return scale < 0 ? n / Math.abs(scale) : n * scale;
}

export function toFixed(value: number): number;
export function toFixed(value: number, decimal?: number): number;
export function toFixed(value: number, decimal?: number, textMode?: boolean): string;
export function toFixed(value: number, decimal?: number, textMode?: boolean) {
  return decimal ? (textMode ? value.toFixed(decimal) : parseFloat(value.toFixed(decimal))) : value;
}

/**
 * Gets the pixel per millimetre (ppm) based on DPI.
 * @param {number} dpi
 * @return {number}
 */
export function ppm(dpi = DEFAULT_DPI): number {
  return dpi / MM_PER_INCH;
}

/**
 * Gets the DPI scale between two DPI values.
 * @param {number} dpi
 * @param {96} ddpi
 * @return {number}
 */
export function dpiScale(dpi: number = DEFAULT_DPI, ddpi = 96): number {
  return dpi / ddpi;
}

/**
 * Scale a value by a given scale.
 * @param {number} value
 * @param {number} scale
 * @param {number} decimal
 * @return {number}
 */
export function scale(value: number, scale: number, decimal?: number): number {
  return toFixed(value * scale, decimal);
}

/**
 * Convert millimetre (mm) to pixel (px), based on DPI.
 * @param {number} mm - Millimetre to convert.
 * @param {number} dpi - DPI to use.
 * @return {number}
 */
export function mmToPx(mm: number, dpi: number = DEFAULT_DPI): number {
  return (mm * dpi) / MM_PER_INCH;
}

/**
 * Convert millimetre (mm) to centimetre (cm).
 * @param {number} mm - Millimetre to convert.
 * @return {number}
 */
export function mmToCm(mm: number): number {
  return mm / 10;
}

/**
 * Convert millimetre (mm) to inch (in).
 * @param {number} mm - Millimetre to convert.
 * @return {number}
 */
export function mmToInch(mm: number): number {
  return mm / MM_PER_INCH;
}

/**
 * Convert centimetre (cm) to pixel (px), based on DPI.
 * @param {number} cm - Centimetre to convert.
 * @param {number} dpi - DPI to use.
 * @return {number}
 */
export function cmToPx(cm: number, dpi: number = DEFAULT_DPI): number {
  return mmToPx(cmToMm(cm), dpi);
}

/**
 * Convert centimetre (cm) to millimetre (mm).
 * @param {number} cm - Centimetre to convert.
 * @return {number}
 */
export function cmToMm(cm: number): number {
  return cm * 10;
}

/**
 * Convert centimetre (cm) to inch (in).
 * @param {number} cm - Centimetre to convert.
 * @return {number}
 */
export function cmToInch(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inchToPx(inch: number, dpi = DEFAULT_DPI): number {
  return mmToPx(inchToMm(inch), dpi);
}

export function inchToMm(inch: number): number {
  return inch * MM_PER_INCH;
}

export function inchToCm(inch: number): number {
  return inch * CM_PER_INCH;
}

export function pxToMm(px: number, dpi = DEFAULT_DPI): number {
  return (px * MM_PER_INCH) / dpi;
}

export function pxToCm(px: number, dpi = DEFAULT_DPI): number {
  return pxToMm(px, dpi) / 10;
}

export function pxToInch(px: number, dpi = DEFAULT_DPI): number {
  return pxToMm(px, dpi) / MM_PER_INCH;
}

export function pxScale(px: number, mm: number, dpi = DEFAULT_DPI): number {
  if (px === 0 || mm === 0) return 0;
  const mmInPixels = mmToPx(mm, dpi);
  return mmInPixels / px;
}

export function dpiFromPx(px: number, mm: number): number {
  return (px / mm) * MM_PER_INCH;
}

export function pxDrop(px: number, dpi = DEFAULT_DPI, ppi = DEFAULT_PPI): number {
  return (px * ppi) / dpi;
}

export function relativeMmToPx(size: number, canvasSize: number, displaySize: number, dpi = DEFAULT_DPI): number {
  const sizeInPixels = mmToPx(size, dpi);
  const scale = pxScale(displaySize, canvasSize, dpi);
  return sizeInPixels / scale;
}

export function pxDisplayScale(size: number, canvasSize: number, displaySize: number, dpi = DEFAULT_DPI): number {
  const px = relativeMmToPx(size, canvasSize, displaySize, dpi);
  return (px / displaySize) * 100;
}

export function relScaleOf(size: number, baseSize: number): number {
  return (size / baseSize) * 100;
}

export function aspectRatio(width: number, height: number): [number, number] {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const divisor = gcd(width, height);
  return [width / divisor, height / divisor];
}
