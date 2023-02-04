import { isArray, isBooleanString, isDateString, isNumberString, isObject, isString, isUnitString } from './inspector';

/**
 * Convert string to a generic type such as boolean, date, etc.
 * @param value
 */
export function extract(value: unknown) {
  if (typeof value === 'string') {
    if (isBooleanString(value)) {
      return value === 'true';
    } else if (value === 'null') {
      return null;
    } else if (value === 'undefined') {
      return undefined;
    } else if (isNumberString(value)) {
      return Number(value);
    } else if (isDateString(value)) {
      return new Date(value);
    }
  }

  return value;
}

/**
 * Extract the value and unit of a unit string (e.g, '10px' into { value: 10, unit: 'px' }).
 * @param {string} value
 * @returns {{unit: string, value: number}}
 */
export function unit(value: string) {
  if (isUnitString(value)) {
    return {
      value: parseFloat(value),
      unit: value.replace(`${ parseFloat(value) }`, '')
    };
  }
}

/**
 * Recursively convert any string value of an object that can be converted to a generic type such as boolean, date, etc.
 * @param target - Object to convert.
 */
export function typify<T extends object>(target: T): T {
  for (const [ key, value ] of Object.entries(target)) {
    if (isObject(value)) {
      target[key as keyof T] = typify(value);
    } else if (isArray(value)) {
      target[key as keyof T] = typifyItem(value) as T[keyof T];
    } else if (isString(value)) {
      target[key as keyof T] = extract(value) as T[keyof T];
    }
  }

  return target;
}

/**
 * Recursively convert any string item of an array that can be converted to a generic type such as boolean, date, etc.
 * @param items - Array to convert.
 */
export function typifyItem<T>(items: T[]): T[] {
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];

    if (isObject(item)) {
      items[i] = typify(item as never);
    } else if (isArray(item)) {
      items[i] = typifyItem(item as unknown[]) as never;
    } else if (isString(item)) {
      items[i] = extract(item) as never;
    }
  }

  return items;
}

/**
 * Recursively replace all undefined value of an object with null.
 * @param target - Object to replace.
 */
export function nullify<T extends object>(target: T): T {
  for (const [ key, value ] of Object.entries(target)) {
    if (isObject(value)) {
      target[key as keyof T] = nullify(value);
    } else if (isArray(value)) {
      target[key as keyof T] = nullifyItems<T[keyof T]>(value) as T[keyof T];
    } else if (typeof value === 'undefined' || isNaN(value)) {
      target[key as keyof T] = null as T[keyof T];
    }
  }

  return target;
}

/**
 * Recursively replace undefined values of an array with null.
 * @param items - Array to replace the undefined values.
 */
export function nullifyItems<T>(items: T[]): T[] {
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];

    if (isObject(item)) {
      items[i] = nullify(item as never);
    } else if (isArray(item)) {
      items[i] = nullifyItems(item as never) as never;
    } else if (typeof item === 'undefined' || isNaN(item as number)) {
      items[i] = null as never;
    }
  }

  return items;
}
