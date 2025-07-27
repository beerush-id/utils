import { entries } from '../global/index.js';
import { type KebabCase } from '../global/string.js';

export type CSSProperties = Partial<
  {
    [K in KebabCase<keyof CSSStyleDeclaration>]: string | number;
  } & {
    [K in keyof CSSStyleDeclaration]: string | number;
  } & {
    [key: `--${string}`]: string | number;
  }
>;

export type CSSStyles = {
  [K in keyof CSSStyleDeclaration]: number | string;
} & {
  [key: `--${string}`]: number | string;
};

export type StyleOptions = {
  styles: CSSProperties;
  deltaScale?: number;
  reset?: boolean;
};

export type StyleInstance = {
  update: (options: StyleOptions) => void;
  destroy: () => void;
};

export const CSS_UNIT_REGEX = /(\d+)(px|pc|pt|mm|cm|in)/gi;
export const CSS_SINGLE_UNIT_REGEX = /(\d+)(px|pc|pt|mm|cm|in)/i;

/**
 * Apply CSS Style Declarations to the given element.
 * @param {HTMLElement} element - HTML Element to apply the styles to.
 * @param {StyleOptions} options - CSS Properties.
 * @returns {StyleInstance} - Style Instance.
 */
export function style(element: HTMLElement, { styles, reset, deltaScale = 1 }: StyleOptions): StyleInstance {
  styleElement(element, styles, reset, deltaScale);

  return {
    update: (newOptions: StyleOptions) => {
      styleElement(element, newOptions.styles, newOptions.reset, newOptions.deltaScale);
    },
    destroy: () => styleElement(element, {}, true),
  };
}

function styleElement(element: HTMLElement, styles: CSSProperties, reset?: boolean, deltaScale = 1) {
  if (reset) {
    element.removeAttribute('style');
  }

  for (const [key, value] of entries(styles)) {
    if (typeof value !== 'undefined' && value !== null) {
      const val: string = toCssUnit(key, value, deltaScale);

      if ((key as string).includes('-')) {
        element.style.setProperty(key as string, val);
      } else {
        element.style[key as never] = val;
      }
    }
  }
}

export function toCssUnit(key: keyof CSSProperties, value: string | number, scale = 1): string {
  if (typeof value === 'string') {
    const values = value.match(CSS_UNIT_REGEX);

    if (values) {
      values.forEach((v) => {
        const [, num, unit] = v.match(CSS_SINGLE_UNIT_REGEX) as RegExpMatchArray;
        value = (value as string).replace(v, `${parseFloat(num) * scale}${unit}`);
      });
    }

    return value;
  }

  const unit = UNIT_MAP.find(({ search }) => search.test(key as string));

  if (unit) {
    return unit.unit ? `${value * scale}` : `${value}${unit.unit}`;
  }

  if (value > 0 || value < 0) {
    return `${value * scale}px`;
  }

  return `${value * scale}`;
}

const UNIT_MAP = [
  {
    search: /^rotate/,
    unit: 'deg',
  },
  {
    search: /^scale/,
    unit: '',
  },
];
