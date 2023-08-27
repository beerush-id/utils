export type CamelCase<T> = T extends `${ infer F }${ '-' | '_' | ' ' }${ infer R }${ infer C }`
                           ? `${ F }${ Uppercase<R> }${ CamelCase<C> }`
                           : T extends string ? Lowercase<T> : '';

export type KebabCase<T, A extends string = ''> = T extends `${ infer F }${ infer R }`
                                                  ? KebabCase<R, `${ A }${ F extends Lowercase<F>
                                                                           ? ''
                                                                           : '-' }${ Lowercase<F> }`>
                                                  : A;

export type PascalCase<T> = T extends `${ infer F }${ '-' | '_' | ' ' }${ infer R }`
                            ? `${ Capitalize<F> }${ PascalCase<R> }`
                            : T extends string ? Capitalize<T> : '';

export type SnakeCase<T, A extends string = ''> = T extends `${ infer F }${ infer R }`
                                                  ? SnakeCase<R, `${ A }${ F extends Lowercase<F>
                                                                           ? ''
                                                                           : '_' }${ Lowercase<F> }`>
                                                  : A;

/**
 * Convert string into camelCase format.
 * @param {T} text
 * @return {CamelCase<T>}
 */
export function toCamelCase<T extends string>(text: T): CamelCase<T> {
  return text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  }).replace(/[_-]/g, '') as never;
}

/**
 * Convert string into KebabCase format.
 * @param {T} text
 * @return {KebabCase<T>}
 */
export function toKebabCase<T extends string>(text: T): KebabCase<T> {
  return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() as KebabCase<T>;
}

/**
 * Convert string into PascalCase format.
 * @param {T} text
 * @return {PascalCase<T>}
 */
export function toPascalCase<T extends string>(text: T): PascalCase<T> {
  return text.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
    return g1.toUpperCase() + g2.toLowerCase();
  }) as PascalCase<T>;
}

/**
 * Convert string into snake_case format.
 * @param {T} text
 * @return {SnakeCase<T>}
 */
export function toSnakeCase<T extends string>(text: T): SnakeCase<T> {
  return text.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() as SnakeCase<T>;
}

/**
 * Convert string into capital format.
 * @param {string} text - String to convert.
 * @returns {string}
 */
export function capitalize<T extends string>(text: T): Capitalize<T> {
  return text.replace(/\w+/g, m => m.replace(/^[a-z]/, c => c.toUpperCase())) as never;
}

/**
 * Convert dash format into human-readable format, and optionally capitalize it.
 * @param {string} text - String to convert.
 * @param {boolean} capital - Mark to capitalize the result.
 * @returns {string}
 */
export function humanize(text: string, capital?: boolean): string {
  const result = text.replace(/[-_]/g, ' ');
  return capital ? capitalize(result) : result;
}

/**
 * Convert string such camelCase to dash format.
 * @param {string} text - String to convert.
 * @returns {string}
 */
export function dashify(text: string): string {
  return text.replace(/[A-Z]/g, m => `-${ m.toLowerCase() }`);
}

export const dash = dashify;

/**
 * Convert string into a path.
 * @param {string} path - String to convert.
 * @returns {string}
 */
export function makePath(path: string): string {
  const allowed = path.replace(/\s+/g, '-').match(/[\w\-_./:]+/g) || [];
  return cleanPath(allowed.join('').toLowerCase());
}

/**
 * Make sure no double-slash in a path.
 * @param {string} path - String to convert.
 * @returns {string}
 */
export function cleanPath(path: string): string {
  return path.replace(/\/+/g, '/').replace(/\/$/, '');
}

/**
 * Convert string into a valid Base64 encoding.
 * @param {string} input
 * @param {string} mime
 * @returns {string}
 */
export function base64(input: string, mime = 'image/png') {
  if (input.startsWith('data:')) return input;
  return `data:${ mime };base64,${ input }`;
}

/**
 * Decode Base64 string.
 * @param {string} input
 * @returns {string}
 */
export function base64Decode(input: string) {
  return input.replace(/^data:[^,]+,/, '');
}

/**
 * Convert string into camelCase format.
 * @deprecated Use `toCamelCase` instead.
 * @param {string} text - String to convert.
 * @returns {string}
 */
export function camelize(text: string): string {
  return toCamelCase(text);
}
