import L from 'leaflet';
import { union, intersect } from './turf-leaflet';

const a = L.polygon([
  [0, 0],
  [2, 0],
  [2, 1],
  [0, 1],
]);

const b = L.polygon([
  [1, 0],
  [3, 0],
  [3, 1],
  [1, 1],
]);

const c = L.polygon([
  [20, 20],
  [20, 21],
  [21, 21],
  [21, 20],
]);

test('union should return the union of two features', () => {
  const expected = L.polygon([
    [0, 0],
    [3, 0],
    [3, 1],
    [0, 1],
  ]);
  /* easier to compare bounds */
  expect(union(a, b).getBounds()).toEqual(expected.getBounds());
});

test('union still merge non adjacent polygons', () => {
  const expected = L.polygon([
    [0, 0],
    [0, 21],
    [21, 21],
    [21, 0],
  ]);
  /* easier to compare bounds */
  expect(union(a, c).getBounds()).toEqual(expected.getBounds());
});


test('intersect should return the intersection of two features', () => {
  const expected = L.polygon([
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 1],
  ]);
  /* easier to compare bounds */
  expect(intersect(a, b).getBounds()).toEqual(expected.getBounds());
});

test('intersect should return null if no result', () => {
  expect(intersect(a, c)).toBeNull();
});
