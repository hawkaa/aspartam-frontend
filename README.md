# Aspartam Frontend

![Build status](https://circleci.com/gh/hawkaa/aspartam-frontend.svg?style=shield&circle-token=:circle-token)

#### Getting started
```
yarn
```

#### Development server
```
yarn start
```

#### Running tests
```
yarn test
```

#### Linting
```
yarn lint
```

#### Building for production
```
yarn build
```

## Future work
Some thoughts on how to make this app better:

* Do not store state as one giant GeoJSON FeatureCollection object, but rather as a list of features/polygons.
* Some test coverage on the app itself, as well as the Vuex store would be neat.
* Alert boxes doesn't close after open.
* Map could zoom to bounding box of the polygons on first load (and reset).
* Some progress bar on loading would be nice. Loading state already implemented, but no UI.