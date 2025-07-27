import { offsets, scaledBoundingClientRect } from './rectangle.js';
import { type CSSProperties, style } from './style.js';

export type DirectionX = 'before' | 'after' | 'between' | 'left' | 'right';
export type DirectionY = 'above' | 'below' | 'between' | 'top' | 'bottom';

export type RectOptions = {
  /** HTML Element to apply the styles to */
  element?: HTMLElement;
  /** HTML Element to move from and restore to the element */
  parent?: HTMLElement;
  /** HTML Element to get the bounding rectangles from. Default to parent element. */
  bounding?: HTMLElement;
  /** The horizontal position of the element from the parent */
  xDir?: DirectionX;
  /** The vertical position of the element from the parent */
  yDir?: DirectionY;
  /** The scale factor if the element is scaled */
  scale?: number;
  /** Swap the position if the given position will cause out of bounds */
  swap?: boolean;
  /** Space (margin) to apply to the element position after positioned relative to the parent */
  space?: number;
  observe?: boolean;
};

export type PopupOptions = {
  options: RectOptions;
  action?: 'hover' | 'click' | string;
  container?: string | HTMLElement;
  overlay?: HTMLElement;
};

export type DialogOptions = {
  container?: string;
  overlay?: HTMLElement;
};

export type PopupInstance = {
  show: (e?: MouseEvent, cb?: (t: 'open' | 'close', e?: MouseEvent) => void) => void;
  hide: (e?: MouseEvent, cb?: (t: 'open' | 'close', e?: MouseEvent) => void) => void;
  update: (options: PopupOptions) => void;
  destroy: () => void;
  disconnect?: () => void;
};

export type TooltipOptions = {
  text: string;
  className?: string;
  xDir?: DirectionX;
  yDir?: DirectionY;
  container?: string;
  bounding?: HTMLElement;
};

export type TooltipInstance = {
  update: (option: string | TooltipOptions) => void;
  destroy: () => void;
};

const OBSERVERS = new WeakMap<HTMLElement, ResizeObserver>();

/**
 * Apply a fixed position bounds of the given element, relative to the given parent element.
 * @param {RectOptions} options - The popup options.
 */
export function popRect(options: RectOptions) {
  const {
    element,
    parent,
    bounding = parent,
    xDir = 'between',
    yDir = 'below',
    scale = 1,
    swap = true,
    space = 8,
  } = options;
  if (!element || !bounding) {
    console.warn('Popup ignored because the given element/bounds in the options is not an HTML Element.');
    return;
  }

  const { innerWidth, innerHeight } = window;
  const { width: elWidth, height: elHeight } = scaledBoundingClientRect(element, scale);
  const { left, top, right, bottom, width, height, centerX, centerY } = offsets(bounding, false, scale);

  const styles: CSSProperties = {};

  if (xDir === 'before') {
    const offSide = right + width + elWidth > innerWidth;

    if (offSide) {
      if (swap) {
        styles.left = `${left + width}px`;
      } else {
        styles.left = '0';
      }

      styles.marginLeft = `${space}px`;
      element.classList.add('x-after');
    } else {
      styles.right = `${right + width}px`;
      styles.marginRight = `${space}px`;
      element.classList.add('x-before');
    }
  } else if (xDir === 'after') {
    const offSide = left + width + elWidth > innerWidth;

    if (offSide) {
      if (swap) {
        styles.right = `${right + width}px`;
      } else {
        styles.right = '0';
      }

      styles.marginRight = `${space}px`;
      element.classList.add('x-before');
    } else {
      styles.left = `${left + width}px`;
      styles.marginLeft = `${space}px`;
      element.classList.add('x-after');
    }
  } else if (xDir === 'between') {
    const offsideLeft = centerX - elWidth / 2 < 0;
    const offsideRight = centerX + elWidth / 2 > innerWidth;

    if (offsideLeft) {
      styles.left = `${space}px`;
      styles.maxWidth = `${innerWidth - space * 2}px`;
      element.classList.add('x-screen-left');
    } else if (offsideRight) {
      styles.right = `${space}px`;
      styles.maxWidth = `${innerWidth - space * 2}px`;
      element.classList.add('x-screen-right');
    } else {
      styles.left = `${centerX}px`;
      styles.marginLeft = `${-elWidth / 2}px`;
      element.classList.add('x-between');
    }
  } else if (xDir === 'left') {
    styles.left = `${left}px`;
    element.classList.add('x-left');
  } else if (xDir === 'right') {
    styles.right = `${right}px`;
    element.classList.add('x-right');
  }

  if (yDir === 'above') {
    const offSide = top - height - elHeight < 0;

    if (offSide) {
      if (swap) {
        styles.top = `${top + height}px`;
      } else {
        styles.top = '0';
      }

      styles.marginTop = `${space}px`;
      element.classList.add('y-below');
    } else {
      styles.bottom = `${bottom + height}px`;
      styles.marginBottom = `${space}px`;
      element.classList.add('y-above');
    }
  } else if (yDir === 'below') {
    const offSide = top + height + elHeight > innerHeight;

    if (offSide) {
      if (swap) {
        styles.bottom = `${bottom + height}px`;
        element.classList.add('y-below');
      } else {
        styles.bottom = '0';
      }

      styles.marginBottom = `${space}px`;
      element.classList.add('y-above');
    } else {
      styles.top = `${top + height}px`;
      styles.marginTop = `${space}px`;
      element.classList.add('y-below');
    }
  } else if (yDir === 'between') {
    const offsideTop = centerY - elHeight / 2 < 0;
    const offsideBottom = centerY + elHeight / 2 > innerHeight;

    if (offsideTop) {
      styles.top = `${space}px`;
      styles.maxHeight = `${innerHeight - space * 2}px`;
      element.classList.add('y-screen-top');
    } else if (offsideBottom) {
      styles.bottom = `${space}px`;
      styles.maxHeight = `${innerHeight - space * 2}px`;
      element.classList.add('y-screen-bottom');
    } else {
      styles.top = `${centerY}px`;
      styles.marginTop = `-${Math.ceil(elHeight / 2)}px`;
      element.classList.add('y-between');
    }
  } else if (yDir === 'top') {
    styles.top = `${top}px`;
    element.classList.add('y-top');
  } else if (yDir === 'bottom') {
    styles.bottom = `${bottom}px`;
    element.classList.add('y-bottom');
  }

  // styles.transform = `translate3d(${ tx }, ${ ty }, 0)`;
  style(element, { styles });
}

/**
 * Move the given element to the given slot, and apply the Popup positions.
 * @param {HTMLElement} container - String as the document query selector.
 * @param {RectOptions} options - The popup options.
 * @param debounce - Delay before applying the styles.
 */
export function popTo(container: HTMLElement, options: RectOptions, debounce?: number) {
  const { element, observe } = options;

  if (!element) {
    console.warn('Popup ignored because the given element in the options is not an HTML Element.');
    return;
  }

  const apply = () => {
    if (typeof debounce === 'number') {
      setTimeout(() => {
        popRect(options);
      }, debounce);
    } else {
      popRect(options);
    }
  };

  container.appendChild(element);

  apply();

  if (observe) {
    let { innerWidth, innerHeight } = window;
    let caller: number;

    const observer = new ResizeObserver(() => {
      if (caller) {
        clearTimeout(caller);
      }

      caller = setTimeout(() => {
        const { innerWidth: width, innerHeight: height } = window;

        if (width !== innerWidth || height !== innerHeight) {
          innerWidth = width;
          innerHeight = height;
          apply();
        }
      }, 300) as never;
    });

    observer.observe(document.body);
    OBSERVERS.set(element, observer);
  }
}

/**
 * Restore the element node to its parent node.
 * @param {RectOptions} options
 * @param {number} debounce
 */
export function restore(options: RectOptions, debounce?: number) {
  const { element, parent } = options;

  if (!element || !parent) {
    console.warn('Popup ignored because the given element/parent in the options is not an HTML Element.');
    return;
  }

  element.removeAttribute('style');

  if (typeof debounce === 'number') {
    setTimeout(() => {
      parent.appendChild(element);
    }, debounce);
  } else {
    parent.appendChild(element);
  }

  const observer = OBSERVERS.get(element);
  if (observer) {
    observer.disconnect();
    OBSERVERS.delete(element);
  }
}

/**
 * Create a popup instance.
 * @param {HTMLElement} self
 * @param {PopupOptions} config
 * @return {PopupInstance}
 */
export function popup(self: HTMLElement, config: PopupOptions): PopupInstance {
  let { action, overlay } = config;
  let container = popupContainer(config.container);

  const parent = self.parentElement as HTMLElement;
  const options = { ...config.options, element: self, parent } as RectOptions;

  const show = (e?: MouseEvent, cb?: (t: 'open' | 'close', e?: MouseEvent) => void) => {
    if (overlay) {
      overlay.addEventListener('click', hide);
      appendTo(container, overlay);
    }

    popTo(container, options);

    if (action === 'click' && !overlay) {
      parent.style.pointerEvents = 'none';

      setTimeout(() => {
        window.addEventListener('click', hide);
      }, 100);
    }

    if (typeof cb === 'function') {
      cb('open', e);
    }
  };

  const hide = (e?: MouseEvent, cb?: (t: 'open' | 'close', e?: MouseEvent) => void) => {
    if (overlay) {
      overlay.removeEventListener('click', hide);
      appendTo(parent, overlay);
    }

    restore(options);

    if (action === 'click' && !overlay) {
      parent.style.removeProperty('pointer-events');

      setTimeout(() => {
        window.removeEventListener('click', hide);
      }, 100);
    }

    if (typeof cb === 'function') {
      cb('close', e);
    }
  };

  const disconnect = () => {
    parent.removeEventListener('mouseenter', show);
    parent.removeEventListener('mouseleave', hide);
    parent.removeEventListener('click', show);
    parent.removeEventListener('click', hide);
    window.removeEventListener('click', hide);
  };

  if (action === 'hover') {
    parent.addEventListener('mouseenter', show);
    parent.addEventListener('mouseleave', hide);
    parent.addEventListener('click', hide);
  } else if (action === 'click') {
    parent.addEventListener('click', show);
  }

  self.addEventListener('popup:show' as never, show);
  self.addEventListener('popup:hide' as never, hide);

  return {
    show,
    hide,
    disconnect,
    update(cfg: PopupOptions) {
      action = cfg.action;
      overlay = cfg.overlay;
      container = popupContainer(cfg.container);
      Object.assign(options, cfg.options, { element: self, parent });
    },
    destroy() {
      disconnect();
      self.remove();

      if (overlay) {
        overlay.remove();
      }
    },
  };
}

/**
 * Create a dialog instance.
 * @param {HTMLElement} self
 * @param {DialogOptions} options
 * @returns {PopupInstance}
 */
export function dialog(self: HTMLDialogElement, options: DialogOptions): PopupInstance {
  let { container = '.dialog-container', overlay } = options;
  const parent = self.parentElement as HTMLDialogElement;

  const show = (e?: MouseEvent, cb?: (t: 'open' | 'close', e?: MouseEvent) => void) => {
    if (overlay) {
      appendTo(container, overlay);
    }

    if (self instanceof HTMLDialogElement) {
      self.showModal();
    } else {
      const elem = self as HTMLElement;

      appendTo(container, self);

      const { width, height } = elem.getBoundingClientRect();
      elem.style.setProperty('--offset-left', `${width / 2}px`);
      elem.style.setProperty('--offset-top', `${height / 2}px`);
    }

    if (typeof cb === 'function') {
      cb('open', e);
    }
  };

  const hide = (e?: MouseEvent, cb?: (t: 'open' | 'close', e?: MouseEvent) => void) => {
    if (overlay) {
      appendTo(parent, overlay);
    }

    if (self instanceof HTMLDialogElement) {
      self.close();
    } else {
      appendTo(parent, self);
    }

    if (typeof cb === 'function') {
      cb('close', e);
    }
  };

  const cleanup = () => {
    if (overlay) {
      appendTo(parent, overlay);
    }
  };

  const backdropClick = (e: MouseEvent) => {
    if (!(e.target instanceof HTMLSelectElement) && isBackdropClick(e)) {
      hide(e);
    }
  };

  if (self instanceof HTMLDialogElement) {
    self.addEventListener('close', cleanup);
    self.addEventListener('click', backdropClick);
  }

  return {
    show,
    hide,
    update(cfg: PopupOptions) {
      overlay = cfg.overlay;
      container = (cfg.container || '.dialog-container') as string;
    },
    destroy() {
      self.remove();
      self.removeEventListener('close', cleanup);
      self.removeEventListener('click', backdropClick);

      if (overlay) {
        overlay.remove();
      }
    },
  };
}

/**
 * Create a tooltip instance.
 * @param {HTMLElement} parent
 * @param {string | TooltipOptions} textOption
 * @return {TooltipInstance}
 */
export function tooltip(parent: HTMLElement, textOption: string | TooltipOptions): TooltipInstance {
  const element = document.createElement('span');
  const container = popupContainer((textOption as TooltipOptions).container);

  element.setAttribute('class', 'tooltip fade-in');
  parent.appendChild(element);

  const update = (option: string | TooltipOptions) => {
    if (typeof option === 'string') {
      element.innerText = option;
    } else if (typeof option === 'object') {
      element.innerText = option.text;

      if (option.className) {
        element.setAttribute('class', ['tooltip fade-in', option.className].join(' '));
      }
    }
  };

  update(textOption);

  const show = () => {
    popTo(container, {
      element,
      parent,
      bounding: (textOption as TooltipOptions).bounding,
      xDir: (textOption as TooltipOptions).xDir,
      yDir: (textOption as TooltipOptions).yDir,
      swap: true,
    });
  };

  const hide = () => {
    restore({
      element: element,
      parent,
    });
  };

  parent.addEventListener('mouseenter', show);
  parent.addEventListener('mouseleave', hide);

  return {
    update,
    destroy() {
      element.remove();
      parent.removeEventListener('mouseenter', show);
      parent.removeEventListener('mouseleave', hide);
    },
  };
}

/**
 * Move the given element to the given target.
 * @param {HTMLElement | string} target
 * @param {HTMLElement} element
 */
export function appendTo(target: HTMLElement | string, element: HTMLElement) {
  if (typeof target === 'string') {
    const wrapper = document.querySelector(target);

    if (wrapper) {
      wrapper.appendChild(element);
    } else {
      document.body.appendChild(element);
    }
  } else {
    target.appendChild(element);
  }
}

/**
 * Check if the given mouse event is a backdrop click.
 * @param {MouseEvent} event
 * @return {boolean}
 */
function isBackdropClick(event: MouseEvent): boolean {
  const target = event.target as HTMLElement;

  if (target) {
    const rect = target.getBoundingClientRect();
    return (
      rect.left > event.clientX || rect.right < event.clientX || rect.top > event.clientY || rect.bottom < event.clientY
    );
  }

  return false;
}

/**
 * Create a popup container.
 * @param {string} name
 * @return {HTMLElement}
 */
function popupContainer(name?: string | HTMLElement): HTMLElement {
  if (name instanceof HTMLElement) {
    return name;
  }

  let container = document.querySelector(name ?? '.popup-container');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('popup-container');
    document.body.appendChild(container);
  }

  return container as HTMLElement;
}

/**
 * Create a popup instance.
 * @deprecated Use `popup` instead.
 * @param {HTMLElement} element
 * @param {PopupOptions} config
 * @returns {PopupInstance}
 */
export function createPopup(element: HTMLElement, config: PopupOptions): PopupInstance {
  return popup(element, config);
}

/**
 * Create a dialog instance.
 * @deprecated Use `dialog` instead.
 * @param {HTMLDialogElement} element
 * @param {DialogOptions} options
 * @return {PopupInstance}
 */
export function createDialog(element: HTMLDialogElement, options: DialogOptions): PopupInstance {
  return dialog(element, options);
}
