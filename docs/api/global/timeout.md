# Timeout

Timeout utilities for working with asynchronous operations.

## Installation

```typescript
import * as timeout from '@beerush/utils/global/timeout'
// or
import { sleep } from '@beerush/utils/global/timeout'
```

## Functions

### `sleep`

A simple promise based setTimeout.

```typescript
sleep(timeout: number): Promise<void>
```