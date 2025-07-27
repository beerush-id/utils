# `@beerush/utils`

A TypeScript utilities library for internal use, but you can use it as well if you want.

## Documentation

Visit the [Documentation Site](https://beerush-id.github.io/utils/) for detailed information on how to use this library.

### Development

To run the documentation locally:

```bash
# Install dependencies
npm install

# Run documentation dev server
npm run docs:dev
```

### Building Documentation

To build the documentation for production:

```bash
npm run docs:build
```

The built documentation will be located in `docs/.vitepress/dist`.

## GitHub Pages Deployment

This repository is configured with a GitHub Actions workflow that automatically deploys the documentation to GitHub Pages whenever changes are pushed to the `main` branch.

To enable GitHub Pages:

1. Go to the repository settings
2. Navigate to "Pages" in the sidebar
3. Under "Source", select "GitHub Actions"
4. The documentation will now be automatically deployed on each push to `main`

## API Docs

You can also check the [API Docs](https://beerush-id.github.io/utils/) for detailed API reference.