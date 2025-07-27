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
  if (!text) return '' as CamelCase<T>;
  
  // Split on various separators while preserving letter case for now
  const words = text
    .split(/[-_\s]+/g) // Split on separators first
    .filter(word => word.length > 0); // Remove empty words
  
  if (words.length === 0) return '' as CamelCase<T>;
  
  // Process each word to handle camelCase boundaries
  const processedWords = words.map(word => {
    // Split camelCase boundaries: HelloWorld -> Hello World
    return word.replace(/([a-z])([A-Z])/g, '$1 $2')
               .split(' ')
               .filter(part => part.length > 0);
  }).flat();
  
  // First word lowercase, rest capitalize first letter
  return processedWords
    .map((word, index) => {
      const lowerWord = word.toLowerCase();
      if (index === 0) {
        return lowerWord;
      }
      return lowerWord.charAt(0).toUpperCase() + lowerWord.substring(1);
    })
    .join('') as CamelCase<T>;
}

/**
 * Convert string into KebabCase format.
 * @param {T} text
 * @return {KebabCase<T>}
 */
export function toKebabCase<T extends string>(text: T): KebabCase<T> {
  if (!text) return '' as KebabCase<T>;
  
  const result = text
    // Insert a space between lower case and upper case letters
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace separators with spaces
    .replace(/[-_\s]+/g, ' ')
    .trim()
    // Replace spaces with hyphens and convert to lowercase
    .replace(/\s+/g, '-')
    .toLowerCase();
    
  return result as KebabCase<T>;
}

/**
 * Convert string into PascalCase format.
 * @param {T} text
 * @return {PascalCase<T>}
 */
export function toPascalCase<T extends string>(text: T): PascalCase<T> {
  if (!text) return '' as PascalCase<T>;
  
  // Split on various separators while preserving letter case for now
  const words = text
    .split(/[-_\s]+/g) // Split on separators first
    .filter(word => word.length > 0); // Remove empty words
  
  if (words.length === 0) return '' as PascalCase<T>;
  
  // Process each word to handle camelCase boundaries
  const processedWords = words.map(word => {
    // Split camelCase boundaries: HelloWorld -> Hello World
    return word.replace(/([a-z])([A-Z])/g, '$1 $2')
               .split(' ')
               .filter(part => part.length > 0);
  }).flat();
  
  // Capitalize first letter of each word
  return processedWords
    .map(word => {
      const lowerWord = word.toLowerCase();
      return lowerWord.charAt(0).toUpperCase() + lowerWord.substring(1);
    })
    .join('') as PascalCase<T>;
}

/**
 * Convert string into snake_case format.
 * @param {T} text
 * @return {SnakeCase<T>}
 */
export function toSnakeCase<T extends string>(text: T): SnakeCase<T> {
  if (!text) return '' as SnakeCase<T>;
  
  const result = text
    // Insert a space between lower case and upper case letters
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace separators with spaces
    .replace(/[-_\s]+/g, ' ')
    .trim()
    // Replace spaces with underscores and convert to lowercase
    .replace(/\s+/g, '_')
    .toLowerCase();
    
  return result as SnakeCase<T>;
}

/**
 * Convert string into capital format.
 * @param {string} text - String to convert.
 * @returns {string}
 */
export function capitalize<T extends string>(text: T): Capitalize<T> {
  if (!text) return '' as Capitalize<T>;
  return text.replace(/\w+/g, word => {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  }) as Capitalize<T>;
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
  return text.replace(/([A-Z])/g, (match, p1, offset) => {
    return (offset > 0 ? '-' : '') + p1.toLowerCase();
  });
}

export const dash = dashify;

/**
 * Convert string into a path.
 * @param {string} path - String to convert.
 * @returns {string}
 */
export function makePath(path: string): string {
  const allowed = path.replace(/\s+/g, '-').replace(/_+/g, '-').match(/[\w\-_./:]+/g) || [];
  return cleanPath(allowed.join('').toLowerCase());
}

/**
 * Make sure no double-slash in a path.
 * @param {string} path - String to convert.
 * @returns {string}
 */
export function cleanPath(path: string): string {
  // Handle special cases
  if (path === '/') return path;
  if (path === '//') return '/';
  
  const cleaned = path.replace(/\/+/g, '/');
  return cleaned === '/' ? cleaned : cleaned.replace(/\/$/, '');
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