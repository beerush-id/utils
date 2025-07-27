# API Reference

Welcome to the API reference for @beerush/utils. This section provides detailed documentation for all available functions and utilities in the library.

## Module Structure

The library is organized into three main modules:

- [Client](/api/client/) - Client-side utilities for DOM manipulation, styling, forms, files, clipboard operations, and more
- [Global](/api/global/) - Universal utilities for working with strings, numbers, objects, colors, logging, and other base types
- [Server](/api/server/) - Server-side utility functions

## Usage Examples

```typescript
// Import from main module
import { toCamelCase } from '@beerush/utils/global'
import { addClass } from '@beerush/utils/client'

// Import from specific submodule
import { toKebabCase } from '@beerush/utils/global/string'
import { hide } from '@beerush/utils/client/style'
```

Browse the individual module sections for detailed API documentation.