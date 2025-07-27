# Inspector

Type inspection utilities for checking value types and characteristics.

## Installation

```typescript
import * as inspector from '@beerush/utils/global/inspector'
// or
import { isString } from '@beerush/utils/global/inspector'
```

## Functions

### `typeOf`

Get the generic type of the given value. Unlike `typeof`, the returned type will be a generic type. For example, calling `typeOf([])` will return `array` instead of `object`.

```typescript
typeOf(value: unknown): GenericType
```

### `isString`

Check if the given value is a string.

```typescript
isString(value: unknown): value is string
```

### `isNumber`

Check if the given value is a number.

```typescript
isNumber(value: unknown): value is number
```

### `isEven`

Check if the given value is an even number.

```typescript
isEven(value: unknown): boolean
```

### `isOdd`

Check if the given value is an odd number.

```typescript
isOdd(value: unknown): boolean
```

### `isArray`

Check if the given value is an array.

```typescript
isArray(value: unknown): value is unknown[]
```

### `isObject`

Check if the given value is an object.

```typescript
isObject(value: unknown): value is Record<string, unknown>
```

### `isFunction`

Check if the given value is a function.

```typescript
isFunction(value: unknown): value is Function
```

### `isBoolean`

Check if the given value is a boolean.

```typescript
isBoolean(value: unknown): value is boolean
```

### `isDate`

Check if the given value is a date.

```typescript
isDate(value: unknown): value is Date
```

### `isRegExp`

Check if the given value is a regular expression.

```typescript
isRegExp(value: unknown): value is RegExp
```

### `isError`

Check if the given value is an error.

```typescript
isError(value: unknown): value is Error
```

### `isNull`

Check if the given value is null.

```typescript
isNull(value: unknown): value is null
```

### `isUndefined`

Check if the given value is undefined.

```typescript
isUndefined(value: unknown): value is undefined
```

### `isNil`

Check if the given value is null or undefined.

```typescript
isNil(value: unknown): value is null | undefined
```

### `isEmpty`

Check if the given value is empty (null, undefined, empty string, empty array, or empty object).

```typescript
isEmpty(value: unknown): boolean
```

### `isStringified`

Check if the given value is a stringified version of a specific type.

```typescript
isStringified(value: string): boolean
```

### `isBooleanString`

Check if the given value is a stringified boolean.

```typescript
isBooleanString(value: string): boolean
```

### `isNumberString`

Check if the given value is a stringified number.

```typescript
isNumberString(value: string): boolean
```

### `isDateString`

Check if the given value is a stringified date.

```typescript
isDateString(value: string): boolean
```

### `isUnitString`

Check if the given value is a unit string (e.g., '10px', '5em').

```typescript
isUnitString(value: string): boolean
```

## Types

- `GenericType` - Union of all supported generic types:
  - `'string'`
  - `'number'`
  - `'object'`
  - `'array'`
  - `'date'`
  - `'function'`
  - `'boolean'`
  - `'null'`
  - `'regexp'`
  - `'error'`
  - `'map'`
  - `'set'`
  - `'undefined'`