# String

String manipulation utilities for formatting and transforming text.

## Installation

```typescript
import * as string from '@beerush/utils/global/string'
// or
import { toCamelCase } from '@beerush/utils/global/string'
```

## Functions

### `toCamelCase`

Convert string into camelCase format.

```typescript
toCamelCase<T extends string>(text: T): CamelCase<T>
```

### `toKebabCase`

Convert string into kebab-case format.

```typescript
toKebabCase<T extends string>(text: T): KebabCase<T>
```

### `toPascalCase`

Convert string into PascalCase format.

```typescript
toPascalCase<T extends string>(text: T): PascalCase<T>
```

### `toSnakeCase`

Convert string into snake_case format.

```typescript
toSnakeCase<T extends string>(text: T): SnakeCase<T>
```

### `capitalize`

Convert string into capital format.

```typescript
capitalize<T extends string>(text: T): Capitalize<T>
```

### `humanize`

Convert dash format into human-readable format, and optionally capitalize it.

```typescript
humanize(text: string, capital?: boolean): string
```

### `dashify`

Convert string such camelCase to dash format.

```typescript
dashify(text: string): string
```

### `makePath`

Convert string into a path.

```typescript
makePath(path: string): string
```

### `cleanPath`

Make sure no double-slash in a path.

```typescript
cleanPath(path: string): string
```

### `base64`

Convert string into a valid Base64 encoding.

```typescript
base64(input: string, mime?: string): string
```

### `base64Decode`

Decode Base64 string.

```typescript
base64Decode(input: string): string
```

### `camelize`

Convert string into camelCase format. (Deprecated: Use `toCamelCase` instead)

```typescript
camelize(text: string): string
```

## Types

- `CamelCase<T>` - Type for converting string literal types to camelCase
- `KebabCase<T>` - Type for converting string literal types to kebab-case
- `PascalCase<T>` - Type for converting string literal types to PascalCase
- `SnakeCase<T>` - Type for converting string literal types to snake_case