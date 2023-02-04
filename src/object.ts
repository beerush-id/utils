import { F, O, S } from 'ts-toolbelt';
import { isArray, isObject } from './inspector';

/**
 * Get the value of an object by using a path.
 * @param {T} object - An object to get the value from.
 * @param {AutoPath<T, P>} path - A dot separated string as a key to get the value.
 * @returns {Path<T, Split<P, ".">>}
 */
export function read<T extends object, P extends string>(
  object: T,
  path: F.AutoPath<T, P>
): O.Path<T, S.Split<P>> {
  const key = path as string;

  if (typeof object !== 'object') {
    throw new Error(`Can not get ${ key } from ${ typeof object }!`);
  }

  const keys = key.split('.');

  if (keys.length > 1) {
    return keys.reduce((a, b, i) => {
      const next = a[b];
      return (i + 1) === keys.length ? next : (next || {});
    }, object as O.Object) as never;
  } else {
    return (object as O.Object)[key];
  }
}

/**
 * Set the value of an object by using a path.
 * @param {T} object - An object to set the value into.
 * @param {AutoPath<T, P>} path - A dot separated string as a path to set the value.
 * @param {Path<T, S.Split<P>>} value - New value to be set.
 */
export function write<T extends object, P extends string>(
  object: T,
  path: F.AutoPath<T, P>,
  value?: unknown
): void {
  const key = path as string;

  if (typeof object !== 'object') {
    throw new Error(`Can not set ${ key } to ${ typeof object }.`);
  }

  const keys = key.split('.');

  if (keys.length <= 1) {
    (object as O.Object)[key] = value;
  } else {
    keys.reduce((a, b, i) => {
      if ((i + 1) === keys.length) {
        a[b] = value;
      } else {
        const next = a[b];
        const nextKey = keys[i + 1];

        if (typeof next !== 'object') {
          a[b] = (nextKey === '0' || Number(nextKey)) ? [] : {};
        }
      }

      return a[b];
    }, object as O.Object);
  }
}

/**
 * Recursively replace the value of an object with value from another object by preserving the reference.
 * @param {object} object - An object to put the new value into.
 * @param {object} source - An object to put the new value from.
 */
export function replace(object: object, source: object): void {
  merge(object, source, true);
}

/**
 * Recursively replace the item of an array with item from another array by preserving the reference.
 * @param {unknown[]} array - An array to put the new item into.
 * @param {unknown[]} source - An array to pull the new item from.
 */
export function replaceItems(array: unknown[], source: unknown[]): void {
  mergeItems(array, source, true);
}

/**
 * Recursively merge two objects by preserving the reference.
 * @param {object} object - An object to put the new value into.
 * @param {object} source - An object to put the new value from.
 */
export function merge(object: object, source: object, cleanup?: boolean) {
  for (const [ key, value ] of Object.entries(source)) {
    if (isArray(object[key as never]) && isArray(value)) {
      mergeItems(object[key as never], value, cleanup);
    } else if (isObject(object[key as never]) && isObject(value)) {
      merge(object[key as never], value, cleanup);
    } else {
      object[key as never] = value as never;
    }
  }

  if (cleanup) {
    for (const key of Object.keys(object)) {
      if (!(key in source)) {
        delete object[key as never];
      }
    }
  }
}

/**
 * Recursively merge two array by preserving the reference.
 * @param {unknown[]} array - An array to put the new item into.
 * @param {unknown[]} source - An array to pull the new item from.
 */
export function mergeItems(array: unknown[], source: unknown[], cleanup?: boolean) {
  if (!isArray(array) || !isArray(source)) {
    throw new Error('Target and source must be an Array!');
  }

  source.forEach((item, i) => {
    if (isArray(array[i]) && isArray(item)) {
      mergeItems(array[i] as unknown[], item as unknown[], cleanup);
    } else if (isObject(array[i]) && isObject(item)) {
      merge(array[i] as object, item as object, cleanup);
    } else {
      array[i] = item;
    }
  });

  if (cleanup && array.length > source.length) {
    array.splice(source.length, array.length - source.length);
  }
}

/**
 * Split array into multiple columns by limiting the max rows.
 * @param array - An array to split.
 * @param maxRows - The max rows per column.
 */
export function splitItems<T>(array: T[], maxRows: number): Array<T[]> {
  if (array.length <= maxRows) {
    return [ array ];
  }

  const group: Array<T[]> = [];
  const limit = Math.ceil(array.length / maxRows);

  for (let col = 0; col < limit; ++col) {
    const column = [];

    for (let i = (col * maxRows); i < ((col * maxRows) + maxRows); ++i) {
      if (typeof array[i] !== 'undefined') {
        column.push(array[i]);
      }
    }

    if (column.length) {
      group.push(column);
    }
  }

  return group;
}

/**
 * Convert Javascript object into Raw string.
 * @param object
 * @returns {string}
 */
export function stringify(object: unknown): string {
  const text: string[] = [];

  if (isObject(object)) {
    text.push('{');

    for (const [ key, value ] of Object.entries(object as object)) {
      text.push(key, ':', stringify(value) as never, ',');
    }

    text.push('}');
  } else if (Array.isArray(object)) {
    text.push('[');

    for (const item of object) {
      text.push(stringify(item), ',');
    }

    text.push(']');
  } else if (typeof object === 'function') {
    text.push(object.toString());
  } else {
    text.push(JSON.stringify(object));
  }

  return text.join('');
}
