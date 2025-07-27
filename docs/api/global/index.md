# Global Utilities

Universal utilities for working with strings, numbers, objects, colors, logging, and other base types.

## Submodules

- [Color](/api/global/color) - Color manipulation utilities
- [Helper](/api/global/helper) - General helper functions
- [Inspector](/api/global/inspector) - Type inspection utilities
- [Logger](/api/global/logger) - Logging utilities
- [Number](/api/global/number) - Number manipulation utilities
- [Object](/api/global/object) - Object manipulation utilities
- [String](/api/global/string) - String manipulation utilities
- [Timeout](/api/global/timeout) - Timeout utilities

## Installation

```typescript
import * as globalUtils from '@beerush/utils/global'
// or
import { toCamelCase } from '@beerush/utils/global'
```

## Overview

The global module provides utilities that can be used in any environment (browser or Node.js). These utilities help with common tasks such as string manipulation, object handling, type checking, logging, and more.

Each submodule is independently available for more granular imports:

```typescript
// Import only what you need
import { toCamelCase } from '@beerush/utils/global/string'
import { isString } from '@beerush/utils/global/inspector'
import { logger } from '@beerush/utils/global/logger'
```