import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL,
});

export function get() {
  return api.get('polygons')
    .then(response => response.data);
}

export function put(polygons) {
  return api.post('polygons', polygons)
    .then(response => response.data);
}

export function reset() {
  return api.get('reset')
    .then(response => response.data);
}
