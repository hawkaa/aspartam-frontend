import turf from 'turf';
import L from 'leaflet';

function reverse(coordinates) {
  return coordinates
    .map(innerCoordinates => innerCoordinates.map(c => [c[1], c[0]]));
}

function fromTurfToLeaflet(feature) {
  const coordinates = (feature.geometry.type === 'MultiPolygon')
    ? feature.geometry.coordinates.map(reverse)
    : reverse(feature.geometry.coordinates);
  return L.polygon(coordinates);
}

export function union(a, b) {
  return fromTurfToLeaflet(turf.union(a.toGeoJSON(), b.toGeoJSON()));
}

export function intersect(a, b) {
  const result = turf.intersect(a.toGeoJSON(), b.toGeoJSON());
  return result !== undefined
    ? fromTurfToLeaflet(result)
    : null;
}
