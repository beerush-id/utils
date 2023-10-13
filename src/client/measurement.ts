export function getDisplayDPI(withRatio?: boolean): number {
  const div = document.createElement('div');

  div.style.width = '1in';
  div.style.position = 'absolute';
  div.style.left = '-100%';
  div.style.top = '-100%';

  document.body.appendChild(div);
  const dpi = div.offsetWidth;
  document.body.removeChild(div);

  return withRatio ? dpi * devicePixelRatio : dpi;
}
