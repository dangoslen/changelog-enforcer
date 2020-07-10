# Contributing
Thanks for your interest in contributing! This is a very small and specific project - we would like to keep it that way.

If you have an idea for a new feature, please open an [issue](https://github.com/dangoslen/changelog-enforcer/issues/new) first and discuss your idea for enhancement.

If you have run into a problem, likewise open an [issue](https://github.com/dangoslen/changelog-enforcer/issues/new) and we will address it as best as we see fit. 

## Development
Currently, this project uses vanilla javascript via `node`. Dependencies are managed via `npm`.

### Installing
After cloning this repository, run

```
npm install
```

### Building
```
npm run package
```

### Tests
```
npm test
```

This will run `npm lint` and lint code with [ESLint](https://eslint.org/)

## Packaging
Currently, whenever a change is made to actual source, it must be packaged for consumption by the developer. This is done via the [Building](#-building) step above. There are plans to eventually make this automated on for both pull requests and releases. 
