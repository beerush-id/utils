export function camelize(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  }).replace(/[_-]/g, '');
}

export function capitalize(text: string): string {
  return text.replace(/\w+/g, m => m.replace(/^[a-z]/, c => c.toUpperCase()));
}

export function humanize(text: string, capital?: boolean): string {
  const result = text.replace(/[-_]/g, ' ');
  return capital ? capitalize(result) : result;
}

export function dash(text: string): string {
  return text.replace(/[A-Z]/g, m => `-${ m.toLowerCase() }`);
}

export function makePath(path: string): string {
  const allowed = path.replace(/\s+/g, '-').match(/[\w-_.\/:]+/g) || [];
  return cleanPath(allowed.join('').toLowerCase());
}

export function cleanPath(path: string): string {
  return path.replace(/\/+/g, '/').replace(/\/$/, '');
}
