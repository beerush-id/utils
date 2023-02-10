/**
 * Convert string into camelCase format.
 * @param {string} text - String to convert.
 * @returns {string}
 */
export function camelize(text: string): string {
  return text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  }).replace(/[_-]/g, '');
}

/**
 * Convert string into capital format.
 * @param {string} text - String to convert.
 * @returns {string}
 */
export function capitalize(text: string): string {
  return text.replace(/\w+/g, m => m.replace(/^[a-z]/, c => c.toUpperCase()));
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
  const allowed = path.replace(/\s+/g, '-').match(/[\w-_.\/:]+/g) || [];
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
