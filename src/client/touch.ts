export type TouchOptions = {
  deltaScale?: number;
}

export function touch(element: HTMLElement, options: TouchOptions = {}) {

  return {
    update: (opt?: TouchOptions) => {

    },
  };
}
