import { logger } from '../global/index.js';

export type HotkeyOptions = {
  keys: string[];
  handler: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  once?: boolean;
};

export type HotkeyInstance = {
  update: (options: HotkeyOptions) => void;
  destroy: () => void;
};

export function createHotkey(
  keys: string[],
  target: HTMLElement,
  handler: (e: KeyboardEvent) => void,
  preventDefault?: boolean,
  stopPropagation?: boolean,
  strict?: boolean
): HotkeyInstance {
  const keyup = (e: KeyboardEvent) => {
    if (strict && e.target !== target) return;
    if (!target.contains(e.target as Node)) return;

    const modifiers = [...keys];
    const primary = modifiers.pop();

    if (primary !== e.key) {
      return;
    }

    for (const modifier of modifiers) {
      if (!e[`${modifier as never}Key`]) {
        return;
      }
    }

    if (preventDefault) {
      e.preventDefault();
    }

    if (stopPropagation) {
      e.stopImmediatePropagation();
    }

    handler(e);
  };

  window.addEventListener('keydown', keyup);
  logger.debug(`[use:hotkey] Hotkey registered: ${keys.join(' + ')}.`);

  return {
    update: (options: HotkeyOptions) => {
      keys = options.keys || keys;
      handler = options.handler || handler;
      preventDefault = options.preventDefault || preventDefault;
      stopPropagation = options.stopPropagation || stopPropagation;
    },
    destroy: () => {
      logger.debug(`[use:hotkey] Hotkey unregistered ${keys.join(' + ')}.`);
      window.removeEventListener('keydown', keyup);
    },
  };
}

export function hotkey(target: HTMLElement, options: HotkeyOptions) {
  return createHotkey(options.keys, target, options.handler, options.preventDefault, options.stopPropagation, true);
}
