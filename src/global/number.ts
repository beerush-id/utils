type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
                                                              ? Acc[number]
                                                              : Enumerate<N, [ ...Acc, Acc['length'] ]>

export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export const DEFAULT_DPI = 300;
export const CM_PER_INCH = 2.54;
export const MM_PER_INCH = 25.4;

/**
 * Convert millimetre (mm) to pixel (px), based on DPI.
 * @param {number} mm - Millimetre to convert.
 * @param {number} dpi - DPI to use.
 * @return {number}
 */
export function mmToPx(mm: number, dpi = DEFAULT_DPI) {
  return Math.round((mm * dpi) / MM_PER_INCH);
}

/**
 * Convert millimetre (mm) to centimetre (cm).
 * @param {number} mm - Millimetre to convert.
 * @return {number}
 */
export function mmToCm(mm: number) {
  return mm / 10;
}

/**
 * Convert millimetre (mm) to inch (in).
 * @param {number} mm - Millimetre to convert.
 * @return {number}
 */
export function mmToInch(mm: number) {
  return mm / MM_PER_INCH;
}

/**
 * Convert centimetre (cm) to pixel (px), based on DPI.
 * @param {number} cm - Centimetre to convert.
 * @param {number} dpi - DPI to use.
 * @return {number}
 */
export function cmToPx(cm: number, dpi = DEFAULT_DPI) {
  return mmToPx(cmToMm(cm), dpi);
}

/**
 * Convert centimetre (cm) to millimetre (mm).
 * @param {number} cm - Centimetre to convert.
 * @return {number}
 */
export function cmToMm(cm: number) {
  return cm * 10;
}

/**
 * Convert centimetre (cm) to inch (in).
 * @param {number} cm - Centimetre to convert.
 * @return {number}
 */
export function cmToInch(cm: number) {
  return cm / CM_PER_INCH;
}

export function inchToPx(inch: number, dpi = DEFAULT_DPI) {
  return mmToPx(inchToMm(inch), dpi);
}

export function inchToMm(inch: number) {
  return inch * MM_PER_INCH;
}

export function inchToCm(inch: number) {
  return inch * CM_PER_INCH;
}

export function pxToMm(px: number, dpi = DEFAULT_DPI) {
  return (px * MM_PER_INCH) / dpi;
}

export function pxToCm(px: number, dpi = DEFAULT_DPI) {
  return pxToMm(px, dpi) / 10;
}

export function pxToInch(px: number, dpi = DEFAULT_DPI) {
  return pxToMm(px, dpi) / MM_PER_INCH;
}

export function pxScale(px: number, mm: number, dpi = DEFAULT_DPI) {
  const mmInPixels = mmToPx(mm, dpi);
  return mmInPixels / px;
}

export function relativeMmToPx(
  size: number,
  canvasSize: number,
  displaySize: number,
  dpi = DEFAULT_DPI,
) {
  const sizeInPixels = mmToPx(size, dpi);
  const scale = pxScale(displaySize, canvasSize, dpi);
  return Math.round(sizeInPixels / scale);
}

export function pxDisplayScale(
  size: number,
  canvasSize: number,
  displaySize: number,
  dpi = DEFAULT_DPI,
) {
  const px = relativeMmToPx(size, canvasSize, displaySize, dpi);
  return (px / displaySize) * 100;
}

export function relScaleOf(size: number, baseSize: number) {
  return (size / baseSize) * 100;
}

export function aspectRatio(width: number, height: number) {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const divisor = gcd(width, height);
  return [ width / divisor, height / divisor ];
}
