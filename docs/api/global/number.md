# Number

Number manipulation utilities and unit conversion functions.

## Installation

```typescript
import * as number from '@beerush/utils/global/number'
// or
import { format } from '@beerush/utils/global/number'
```

## Functions

### `rule`

Create a ruler value for unit conversion between mm, px, cm, and in.

```typescript
rule(n: number | string, unit: Unit, dpi?: number, scale?: number): RulerValue
```

### `format`

Format a number with specified decimal places.

```typescript
format(value: number, decimals?: number): string
```

### `random`

Generate a random integer between min (inclusive) and max (exclusive).

```typescript
random(min: number, max: number): number
```

### `randomInt`

Generate a random integer between min and max (both inclusive).

```typescript
randomInt(min: number, max: number): number
```

### `clamp`

Clamp a number between min and max values.

```typescript
clamp(value: number, min: number, max: number): number
```

### `round`

Round a number to specified decimal places.

```typescript
round(value: number, decimals?: number): number
```

### `ceil`

Ceil a number to specified decimal places.

```typescript
ceil(value: number, decimals?: number): number
```

### `floor`

Floor a number to specified decimal places.

```typescript
floor(value: number, decimals?: number): number
```

### `toPercentage`

Convert a value to percentage based on min and max range.

```typescript
toPercentage(value: number, min: number, max: number): number
```

### `fromPercentage`

Convert a percentage to value based on min and max range.

```typescript
fromPercentage(percentage: number, min: number, max: number): number
```

### `toPrecision`

Format a number to specified significant digits.

```typescript
toPrecision(value: number, precision?: number): string
```

### `toFixed`

Format a number to fixed decimal places, removing trailing zeros.

```typescript
toFixed(value: number, decimals?: number): string
```

## Types

- `Unit` - Supported units: `'px' | 'mm' | 'cm' | 'in'`
- `UnitMap` - Map of unit information
- `RulerValue` - Object with converted values in all supported units
- `Range<F, T>` - Type for a range of numbers from F to T

## Constants

- `DEFAULT_UNIT` - Default unit ('mm')
- `KNOWN_UNITS` - Map of known units with their names and labels
- `DEFAULT_DPI` - Default DPI (300)
- `DEFAULT_PPI` - Default PPI (96)
- `DEFAULT_DECIMALS` - Default decimal places (2)
- `CM_PER_INCH` - Centimeters per inch (2.54)
- `MM_PER_INCH` - Millimeters per inch (25.4)