# Object

Object manipulation utilities for getting, setting, and transforming object properties.

## Installation

```typescript
import * as object from '@beerush/utils/global/object'
// or
import { read } from '@beerush/utils/global/object'
```

## Functions

### `read`

Get the value of an object by using a path.

```typescript
read<T extends object, P extends NestedPath<T>>(
  object: T,
  path: P,
  fallback?: unknown
): NestedPathValue<T, P>
```

### `write`

Set the value of an object by using a path.

```typescript
write<T extends object, P extends NestedPath<T>, V extends NestedPathValue<T, P>>(
  object: T,
  path: P,
  value: V
): T
```

### `has`

Check if an object has a property by using a path.

```typescript
has<T extends object, P extends NestedPath<T>>(
  object: T,
  path: P
): boolean
```

### `omit`

Create a new object with specified properties omitted.

```typescript
omit<T extends object, K extends keyof T>(
  object: T,
  keys: K[]
): Omit<T, K>
```

### `pick`

Create a new object with only specified properties.

```typescript
pick<T extends object, K extends keyof T>(
  object: T,
  keys: K[]
): Pick<T, K>
```

### `extend`

Extend an object with another object's properties.

```typescript
extend<T extends object, S extends object>(
  target: T,
  source: S
): T & S
```

### `clean`

Remove all undefined, null, and empty values from an object.

```typescript
clean<T extends object>(object: T): T
```

### `flatten`

Flatten a nested object to a single level object with dot-notation keys.

```typescript
flatten<T extends object>(
  object: T,
  prefix?: string
): Record<string, unknown>
```

### `unflatten`

Convert a flattened object with dot-notation keys back to a nested object.

```typescript
unflatten<T extends Record<string, unknown>>(
  object: T
): object
```

### `map`

Map over an object's properties and return a new object.

```typescript
map<T extends object, R>(
  object: T,
  mapper: (value: T[keyof T], key: keyof T, object: T) => R
): { [K in keyof T]: R }
```

### `filter`

Filter an object's properties and return a new object.

```typescript
filter<T extends object>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T, object: T) => boolean
): Partial<T>
```

### `reduce`

Reduce an object's properties to a single value.

```typescript
reduce<T extends object, R>(
  object: T,
  reducer: (accumulator: R, value: T[keyof T], key: keyof T, object: T) => R,
  initialValue: R
): R
```

### `keys`

Get all keys of an object, including nested paths.

```typescript
keys<T extends object>(object: T): NestedPath<T>[]
```

### `values`

Get all values of an object, including nested values.

```typescript
values<T extends object>(object: T): NestedPathValue<T, NestedPath<T>>[]
```

### `entries`

Get all key-value pairs of an object, including nested paths and values.

```typescript
entries<T extends object>(
  object: T
): [NestedPath<T>, NestedPathValue<T, NestedPath<T>>][]
```

### `clone`

Deep clone an object.

```typescript
clone<T extends object>(object: T): T
```

### `merge`

Deep merge multiple objects.

```typescript
merge<T extends object[]>(...objects: T): T
```

### `isEmpty`

Check if an object is empty.

```typescript
isEmpty<T extends object>(object: T): boolean
```

### `isNotEmpty`

Check if an object is not empty.

```typescript
isNotEmpty<T extends object>(object: T): boolean
```

## Types

- `NestedPath<T>` - Type for nested object paths using dot notation
- `NestedArrayPath<T>` - Type for nested array paths using dot notation
- `NestedPathValue<T, P>` - Type for values at nested object paths
- `NestedPaths<T>` - Type for arrays of nested object paths
- `NestedPathMaps<T>` - Type for mapping nested paths to their values