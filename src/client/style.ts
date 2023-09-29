import { entries } from '../global/index.js';
import { KebabCase } from '../global/string.js';

export type CSSProperties = Partial<
  {
    [K in KebabCase<keyof CSSStyleDeclaration>]: string | number;
  } &
  {
    [K in keyof CSSStyleDeclaration]: string | number;
  } &
  {
    [key: `--${ string }`]: string | number;
  }
>;

export type CSSStyles = {
  [K in keyof CSSStyleDeclaration]: number | string;
} & {
  [key: `--${ string }`]: number | string;
};

export type StyleOptions = {
  styles: CSSProperties;
  reset?: boolean;
};

export type StyleInstance = {
  update: (options: StyleOptions) => void;
  destroy: () => void;
};

/**
 * Apply CSS Style Declarations to the given element.
 * @param {HTMLElement} element - HTML Element to apply the styles to.
 * @param {CSSProperties} styles - CSS Properties.
 * @param {boolean} reset - Reset the element's style before applying the new styles.
 * @returns {StyleInstance} - Style Instance.
 */
export function style(element: HTMLElement, styles: CSSProperties, reset?: boolean): StyleInstance {
  styleElement(element, styles, reset);

  return {
    update: (updatedStyles: CSSProperties, updatedReset?: boolean) => styleElement(
      element,
      updatedStyles,
      updatedReset,
    ),
    destroy: () => styleElement(element, {}, true),
  };
}

function styleElement(element: HTMLElement, styles: CSSProperties, reset?: boolean) {
  if (reset) {
    element.removeAttribute('style');
  }

  for (const [ key, value ] of entries(styles)) {
    if (typeof value !== 'undefined' && value !== null) {
      const val: string = toCssUnit(key, value);

      if ((key as string).includes('-')) {
        element.style.setProperty(key as string, val);
      } else {
        element.style[key as never] = val;
      }
    }
  }
}

export function toCssUnit(key: keyof CSSProperties, value: string | number): string {
  if (typeof value === 'string') return value;

  const unit = UNIT_MAP.find(({ search }) => search.test(key as string));

  if (unit) {
    return `${ value }${ unit.unit }`;
  }

  if ((value > 0 || value < 0)) {
    return `${ value }px`;
  }

  return `${ value }`;
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
