import { entries, type KebabCase, merge, toKebabCase } from '../global/index.js';

export type CSSRuleValue = string | number | {
  [key: `@${ string }` | `:${ string }`]: string | number | CSSRuleValue;
};

export type CSSRuleSet = Partial<{
  [K in KebabCase<keyof CSSStyleDeclaration>]: CSSRuleValue;
} & {
  [K in keyof CSSStyleDeclaration]: CSSRuleValue;
} & {
  [key: `--${ string }`]: CSSRuleValue;
}>;

export type CSSRules = {
  [selector: string]: CSSRuleSet & {
    children?: CSSRules;
  };
};

export type RuleSetter = (rules: CSSRules) => void;
export type RuleDestroy = () => void;
export type RuleDestroyer = (fn: () => void) => void;
export type CSSInstance = [ RuleSetter, RuleDestroy ];

export function useCss(): CSSInstance {
  let style: HTMLStyleElement;

  const ensureStyle = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!style) {
      style = document.createElement('style');
      style.id = Date.now().toString();
      document.head.appendChild(style);
    }
  };

  const update = (updatedRules: CSSRules) => {
    ensureStyle();

    if (Object.keys(updatedRules).length && style) {
      style.innerHTML = parseRule(updatedRules);
    }
  };

  const destroy = () => {
    if (style) {
      style.remove();
    }
  };

  return [ update, destroy ];
}

export function createCss(destroyer: RuleDestroyer): RuleSetter {
  const [ update, destroy ] = useCss();

  if (typeof destroyer === 'function') {
    destroyer(destroy);
  }

  return update;
}

export function css(element: HTMLElement, rules: CSSRules) {
  let style = element;

  if (element.tagName !== 'style') {
    style = document.createElement('style');
    element.appendChild(style);
  }

  style.innerHTML = parseRule(rules);

  return {
    update: (updatedRules: CSSRules) => {
      style.innerHTML = parseRule(updatedRules);
    },
    destroy: () => {
      if (style) {
        style.remove();
      }
    },
  };
}

function parseRule(rule: CSSRules = {}, parent?: string, indent = ''): string {
  const output: string[] = [];
  const states: CSSRules = {};
  const queries: {
    [query: string]: CSSRules;
  } = {};

  for (const [ selector, rules ] of entries(rule)) {
    const cssSelector = createSelector(selector as string, parent);

    output.push(`${ indent }${ cssSelector } {`);

    for (const [ prop, value ] of entries(rules)) {
      if (prop === 'children') {
        continue;
      }

      if (typeof value === 'object') {
        for (const [ key, val ] of entries(value)) {
          if (key === '@') {
            if (/[A-Z]+/.test(prop as string)) {
              output.push(`  ${ indent }${ toKebabCase(prop as string) }: ${ val };`);
            } else {
              output.push(`  ${ indent }${ prop }: ${ val };`);
            }
          } else {
            if ((key as string).startsWith(':')) {
              const stateSelector = createSelector(`&${ key as string }`, cssSelector);

              if (!states[stateSelector]) {
                states[stateSelector] = {};
              }

              merge(states[stateSelector], { [prop]: val });
            } else if ((key as string).startsWith('@')) {
              if (!queries[key]) {
                queries[key] = {};
              }

              if (!queries[key][cssSelector]) {
                queries[key][cssSelector] = {};
              }

              merge(queries[key][cssSelector], { [prop]: val });
            }
          }
        }
      } else {
        if (/[A-Z]+/.test(prop as string)) {
          output.push(`  ${ indent }${ toKebabCase(prop as string) }: ${ value };`);
        } else {
          output.push(`  ${ indent }${ prop }: ${ value };`);
        }
      }
    }

    output.push(`${ indent }}`);

    if (typeof rules.children === 'object') {
      output.push(parseRule(rules.children, selector as string, indent));
    }

    if (Object.keys(states).length) {
      output.push(parseRule(states, parent, indent));
    }

    if (Object.keys(queries).length) {
      for (const [ query, queryRules ] of entries(queries)) {
        output.push(`${ (query as string).replace('@', '@media ') } {`);
        output.push(parseRule(queryRules, undefined, '  '));
        output.push(`}`);
      }
    }
  }

  return output.join('\n');
}

function createSelector(selector: string, parent?: string) {
  if (!parent) {
    return selector;
  }

  if (selector.startsWith('&')) {
    return parent + selector.slice(1);
  } else {
    return `${ parent } ${ selector }`;
  }
}

export function contourFilter(amount: number, color = 'red'): string {
  const top = `drop-shadow(-${ amount } 0 0 ${ color })`;
  const right = `drop-shadow(0 -${ amount } 0 ${ color })`;
  const bottom = `drop-shadow(${ amount } 0 0 ${ color })`;
  const left = `drop-shadow(0 ${ amount } 0 ${ color })`;

  return [ top, right, bottom, left ].join(' ');
}

export type FillParentOptions = {
  width?: boolean;
  height?: boolean;
};

export function fillParent(self: HTMLElement, options: FillParentOptions = { height: true, width: true }) {
  if (!self.parentElement || !(self.parentElement instanceof HTMLElement)) {
    throw new Error('Element must have a parent to fill!');
  }

  const parent = self.parentElement;
  const observer = new ResizeObserver((e) => {
    update(options);
  });

  observer.observe(parent);

  const update = (newOptions?: FillParentOptions) => {
    if (newOptions) {
      options = newOptions;
    }

    const { width: parentWidth, height: parentHeight } = parent.getBoundingClientRect();
    const siblings = parent.children;

    let height = parentHeight;
    let width = parentWidth;

    for (let i = 0; i < siblings.length; ++i) {
      if (siblings[i] !== self) {
        observer.observe(siblings[i]);
        height -= siblings[i].getBoundingClientRect().height;
        width -= siblings[i].getBoundingClientRect().width;
      }
    }

    if (options.width) {
      self.style.width = `${ width }px`;
    }

    if (options.height) {
      self.style.height = `${ height }px`;
    }
  };

  return {
    update,
    destroy: () => {
      observer.disconnect();
    },
  };
}

export function fillHeight(self: HTMLElement) {
  return fillParent(self, { height: true });
}

export function fillWidth(self: HTMLElement) {
  return fillParent(self, { width: true });
}
