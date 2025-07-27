# Logger

Logging utilities with different log levels and debug mode support.

## Installation

```typescript
import * as logger from '@beerush/utils/global/logger'
// or
import { logger } from '@beerush/utils/global/logger'
```

## Properties

### `logger`

Main logger instance with methods for different log levels.

```typescript
const logger: Logger
```

## Logger Methods

### `info`

Log an informational message.

```typescript
logger.info(...args: unknown[]): void
```

### `warn`

Log a warning message.

```typescript
logger.warn(...args: unknown[]): void
```

### `error`

Log an error message.

```typescript
logger.error(...args: unknown[]): void
```

### `debug`

Log a debug message (only shown when debug mode is enabled).

```typescript
logger.debug(...args: unknown[]): void
```

### `setDebug`

Enable or disable debug mode.

```typescript
logger.setDebug(enabled?: boolean, stack?: boolean): void
```

## Types

### `Logger`

Interface for the logger object.

```typescript
type Logger = {
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  setDebug: (enabled?: boolean, stack?: boolean) => void;
}
```