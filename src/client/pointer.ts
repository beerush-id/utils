import { entries, logger } from '../global/index.js';

export type DragRectSubscriber = (rect: DragRect) => void;
export type DragRect = {
  x: number;
  y: number;
}
export type DragPointer<T> = {
  destroy: () => void;
  update: (e: HTMLElement, b: number, m: number) => void;
  subscribe: (publish: DragRectSubscriber) => () => void;
  set: (rect: Partial<T>) => void;
};

export type WheelRectSubscriber = (rect: WheelRect) => void;
export type WheelRect = {
  x: number;
  y: number;
  scale: number;
}
export type WheelPointer<T> = {
  destroy: () => void;
  subscribe: (publish: WheelRectSubscriber) => () => void;
  set: (rect: Partial<T>) => void;
}

const SPECIAL_KEYS: string[] = [
  'AltLeft',
  'AltRight',
  'ControlLeft',
  'ControlRight',
];

export type PointerEventType = 'move' | 'dragstart' | 'drag' | 'dragend' | 'scale';
export type PointerEvent = {
  type: 'move' | 'dragstart' | 'drag' | 'dragend' | 'scale';
  value: unknown;
}

export type MoveEvent = {
  type: 'move';
  value: MouseEvent;
}

export type DragStartEvent = {
  type: 'dragstart';
  value: MouseEvent;
}

export type DragEvent = {
  type: 'drag';
  value: MouseEvent;
}

export type DragEndEvent = {
  type: 'dragend';
  value: MouseEvent;
}

export type ScaleEvent = {
  type: 'scale';
  value: WheelEvent;
}

export type PointerDragEvent = {
  type: 'dragstart' | 'drag' | 'dragend';
  value: DragRect;
}

export type PointerEvents<T> = T extends 'move'
                               ? MoveEvent
                               : PointerEvent;

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PointerOptions = {
  rect: Rectangle;
  scale?: number;
  button?: number;
  scalable?: boolean;
  draggable?: boolean;
}

export function pointer(element: HTMLElement, options?: PointerOptions) {
  let { button = 0, draggable = false, scale = 1 } = (options || {}) as PointerOptions;
  const subscribers: Array<(e: PointerEvent) => void> = [];

  const ptl = element.querySelector('[data-ptl]') as HTMLElement;
  const ptr = element.querySelector('[data-ptr]') as HTMLElement;
  const pbl = element.querySelector('[data-pbl]') as HTMLElement;
  const pbr = element.querySelector('[data-pbr]') as HTMLElement;

  console.log(ptl, ptr, pbl, pbr);

  const update = (opt: PointerOptions) => {
    const { scalable, draggable } = opt;

    if (scalable) {
      for (const elem of [ ptl, ptr, pbl, pbr ]) {
        elem?.addEventListener('mousedown', scaleStart);
        elem?.addEventListener('mousemove', scaleMove);
        elem?.addEventListener('mouseup', scaleEnd);
      }
    } else {
      for (const elem of [ ptl, ptr, pbl, pbr ]) {
        elem?.removeEventListener('mousedown', scaleStart);
        elem?.removeEventListener('mousemove', scaleMove);
        elem?.removeEventListener('mouseup', scaleEnd);
      }
    }

    if (draggable) {
      element.addEventListener('mousedown', dragStart);
      element.addEventListener('mousemove', dragMove);
      element.addEventListener('mouseup', dragEnd);
    } else {
      element.removeEventListener('mousedown', dragStart);
      element.removeEventListener('mousemove', dragMove);
      element.removeEventListener('mouseup', dragEnd);
    }
  };

  const lock = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const scaleStart = (e: MouseEvent) => {
    lock(e);
  };

  const scaleMove = (e: MouseEvent) => {
    lock(e);
  };

  const scaleEnd = (e: MouseEvent) => {
    lock(e);
  };

  const dragStart = (e: MouseEvent) => {
    lock(e);
  };

  const dragMove = (e: MouseEvent) => {
    lock(e);
  };

  const dragEnd = (e: MouseEvent) => {
    lock(e);
  };

  const subscribe = (run: (e: PointerEvent) => void) => {
    if (!subscribers.length) {
      element.addEventListener('mousedown', mousedown);
      element.addEventListener('mousemove', mousemove);
      element.addEventListener('mouseup', mouseup);
    }

    subscribers.push(run);

    logger.info('pointer.subscribe', subscribers.length);

    return () => {
      const index = subscribers.indexOf(run);

      if (index > -1) {
        subscribers.splice(index, 1);
      }

      logger.info('pointer.unsubscribe', subscribers.length);

      if (!subscribers.length) {
        element.removeEventListener('mousedown', mousedown);
        element.removeEventListener('mousemove', mousemove);
        element.removeEventListener('mouseup', mouseup);

        logger.info('pointer.idle', subscribers.length);
      }
    };
  };

  let startX = 0;
  let startY = 0;
  let width = 0;
  let height = 0;
  let dragging = false;

  const mousedown = (e: MouseEvent) => {
    const domRect = element.getBoundingClientRect();

    if (draggable && button === e.button) {
      e.stopPropagation();
      e.preventDefault();

      startX = domRect.x;
      startY = domRect.y;
      width = domRect.width;
      height = domRect.height;
      dragging = true;

      element.dispatchEvent(new CustomEvent('drag-start', {
        detail: { x: startX, y: startY, width, height },
      }));
    }

    console.log(e);
  };

  const mousemove = (e: MouseEvent) => {
    if (dragging) {
      e.stopPropagation();
      e.preventDefault();

      startX = (e.x - startX) / scale;
      startY = (e.y - startY) / scale;
    }
  };

  const mouseup = (e: MouseEvent) => {
    //
  };

  const emit = (e: PointerEvent) => {
    for (const run of subscribers) {
      run(e);
    }
  };

  return {
    on<T extends PointerEventType>(type: T, run: (e: PointerEvents<T>) => void) {
      return subscribe((e: PointerEvent) => {
        if (e.type === type) {
          run(e as PointerEvents<T>);
        }
      });
    },
    subscribe,
    update: (o?: PointerOptions) => {
      scale = o?.scale ?? 1;
      draggable = o?.draggable ?? false;
      button = o?.button ?? 0;
    },
    destroy: subscribe(() => undefined),
  };
}

export function pointermove<T extends WheelRect>(
  element: HTMLElement,
  init: T,
  button = 0,
  deltaScale = 1,
  deltaMove = 1,
): WheelPointer<T> {
  const subscribe = (publish: WheelRectSubscriber) => {
    const wheel = wheelmove(element, init, deltaScale, deltaMove);
    const drag = dragmove(element, init, button, 1);

    wheel.subscribe(publish);
    drag.subscribe(publish as DragRectSubscriber);

    return () => {
      wheel.destroy();
      drag.destroy();
    };
  };

  return {
    destroy: subscribe(() => undefined),
    subscribe,
    set: (rect: Partial<T>) => {
      for (const [ key, value ] of entries(rect)) {
        if (![ 'set', 'subscribe' ].includes(key as string)) {
          init[key] = value as never;
        }
      }
    },
  };
}

export function wheelmove<T extends WheelRect>(
  element: HTMLElement,
  init: T,
  deltaScale = 1,
  deltaMove = 1,
): WheelPointer<T> {
  const subscribers: WheelRectSubscriber[] = [];

  const subscribe = (publish: WheelRectSubscriber) => {
    publish(init);

    if (!subscribers.length) {
      element.addEventListener('wheel', wheel, { passive: true });
      window.addEventListener('keydown', keydown);
      window.addEventListener('keyup', keyup);
    }

    subscribers.push(publish);

    return () => {
      subscribers.splice(subscribers.indexOf(publish), 1);

      if (!subscribers.length) {
        element.removeEventListener('wheel', wheel);
        window.removeEventListener('keydown', keydown);
        window.removeEventListener('keyup', keyup);
      }
    };
  };

  const wheel = (e: WheelEvent) => {
    e.stopPropagation();

    if (e.altKey) {
      if (e.deltaY < 0) {
        init.y += deltaMove;
      } else {
        init.y -= deltaMove;
      }
    } else if (e.shiftKey) {
      if (e.deltaY < 0) {
        init.x += deltaMove;
      } else {
        init.x -= deltaMove;
      }
    } else {
      const scale = (0.05 * deltaScale);
      const dx = init.x * scale;
      const dy = init.y * scale;

      if (e.deltaY < 0) {
        init.scale += scale;

        init.x += dx;
        init.y += dy;
      } else {
        init.scale -= scale;

        init.x -= dx;
        init.y -= dy;
      }
    }

    emit();
  };
  const keydown = (e: KeyboardEvent) => {
    if (SPECIAL_KEYS.includes(e.code)) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (e.ctrlKey) {
      if (e.code === 'Numpad0') {
        init.x = 0;
        init.y = 0;
        init.scale = 0;

        emit();
      }

      if (e.code === 'Numpad1') {
        init.x = 0;
        init.y = 0;
        init.scale = 1;

        emit();
      }
    }
  };
  const keyup = (e: KeyboardEvent) => {
    if (e.code === 'AltLeft' || e.code === 'AltRight') {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const emit = () => {
    for (const publish of subscribers) {
      publish({ x: init.x, y: init.y, scale: init.scale });
    }
  };

  return {
    destroy: subscribe(() => undefined),
    subscribe,
    set: (rect: Partial<T>) => {
      for (const [ key, value ] of entries(rect)) {
        if (![ 'set', 'subscribe' ].includes(key as string)) {
          init[key as never] = value as never;
        }
      }
    },
  };
}

export function dragmove<T extends DragRect>(
  element: HTMLElement,
  init: T,
  button = 0,
  deltaMove = 1,
): DragPointer<T> {
  const subscribers: DragRectSubscriber[] = [];

  let s: MouseEvent;
  let x = 0;
  let y = 0;

  const dragStart = (e: MouseEvent) => {
    if (e.button === button) {
      e.preventDefault();
      e.stopPropagation();

      s = e;
      x = init.x as never;
      y = init.y as never;

      emit();
    }
  };

  const drag = (e: MouseEvent) => {
    if (s) {
      e.preventDefault();
      e.stopPropagation();

      if (e.shiftKey) {
        init.x = x + Math.round((e.x - s.x) / deltaMove);
      } else if (e.ctrlKey) {
        init.y = y + Math.round((e.y - s.y) / deltaMove);
      } else {
        init.x = x + Math.round((e.x - s.x) / deltaMove);
        init.y = y + Math.round((e.y - s.y) / deltaMove);
      }

      emit();
    }
  };

  const dragEnd = () => {
    if (s) {
      x = init.x as never;
      y = init.y as never;

      s = null as never;

      emit();
    }
  };

  const emit = () => {
    for (const publish of subscribers) {
      publish({ x: init.x, y: init.y });
    }
  };

  const subscribe = (publish: DragRectSubscriber) => {
    publish(init);

    if (!subscribers.length) {
      element.addEventListener('mousedown', dragStart);
      window.addEventListener('mousemove', drag);
      window.addEventListener('mouseup', dragEnd);
    }

    subscribers.push(publish);

    return () => {
      subscribers.splice(subscribers.indexOf(publish), 1);

      if (!subscribers.length) {
        element.removeEventListener('mousedown', dragStart);
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', dragEnd);
      }
    };
  };

  return {
    destroy: subscribe(() => undefined),
    update: (e: HTMLElement, b: number, m: number) => {
      if (element !== e) {
        element.removeEventListener('mousedown', dragStart);
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', dragEnd);

        element = e;

        element.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', dragEnd);
      }

      if (button !== b) {
        button = b;
      }
      if (deltaMove !== m) {
        deltaMove = m;
      }
    },
    subscribe,
    set: (rect: Partial<T>) => {
      for (const [ key, value ] of entries(rect)) {
        if (![ 'set', 'subscribe' ].includes(key as string)) {
          init[key] = value as never;
        }
      }
    },
  };
}
