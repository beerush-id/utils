# Helper

General helper functions for type conversion and value extraction.

## Installation

```typescript
import * as helper from '@beerush/utils/global/helper'
// or
import { extract } from '@beerush/utils/global/helper'
```

## Functions

### `extract`

Convert string to a generic type such as boolean, date, etc.

```typescript
extract(value: unknown): unknown
```

### `unit`

Extract the value and unit of a unit string (e.g, `'10px'` into `{ value: 10, unit: 'px' }`).

```typescript
unit(value: string): { value: number, unit: string } | undefined
```