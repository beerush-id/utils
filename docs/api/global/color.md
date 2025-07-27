# Color

Color manipulation utilities for converting between different color formats.

## Installation

```typescript
import * as color from '@beerush/utils/global/color'
// or
import { hexToRgb } from '@beerush/utils/global/color'
```

## Functions

### `cmykToRgb`

Convert CMYK to RGB.

```typescript
cmykToRgb(cyan: Cyan, magenta: Magenta, yellow: Yellow, black: Black): RGB
```

### `hexToRgb`

Convert HEX to RGB.

```typescript
hexToRgb(hex: HEXColor): RGB
```

### `hslToRgb`

Convert HSL to RGB.

```typescript
hslToRgb(hue: Hue, saturation: Saturation, lightness: Lightness): RGB
```

### `hslaToRgba`

Convert HSLA to RGBA.

```typescript
hslaToRgba(hue: Hue, saturation: Saturation, lightness: Lightness, alpha: Alpha): RGBA
```

### `rgbToHex`

Convert RGB to HEX.

```typescript
rgbToHex(red: Red, green: Green, blue: Blue): HEXColor
```

### `rgbToHsl`

Convert RGB to HSL.

```typescript
rgbToHsl(red: Red, green: Green, blue: Blue): HSL
```

### `rgbaToHsla`

Convert RGBA to HSLA.

```typescript
rgbaToHsla(red: Red, green: Green, blue: Blue, alpha: Alpha): HSLA
```

### `toHex`

Convert any color format to HEX.

```typescript
toHex(color: string): HEXColor
```

### `toRgb`

Convert any color format to RGB string.

```typescript
toRgb(color: string): RGBString
```

### `toRgba`

Convert any color format to RGBA string.

```typescript
toRgba(color: string, alpha?: number): RGBAString
```

## Types

- `Red` - Range from 0 to 255
- `Green` - Range from 0 to 255
- `Blue` - Range from 0 to 255
- `Alpha` - Range from 0 to 100
- `Hue` - Range from 0 to 360
- `Saturation` - Range from 0 to 100
- `Lightness` - Range from 0 to 100
- `HEXColor` - Hex color string format
- `RGB` - RGB tuple format
- `RGBA` - RGBA tuple format
- `HSL` - HSL tuple format
- `HSLA` - HSLA tuple format
- `CMYK` - CMYK tuple format