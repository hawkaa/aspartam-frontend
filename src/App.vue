<template>
  <div>
    <md-toolbar class="md-primary">
      <h1 class="md-title">Aspartam Polygon Editor</h1>
      <div class="md-toolbar-section-end">
        <h5>Status: Saved</h5>
      </div>
    </md-toolbar>
    <div id="map" />
  </div>
</template>

<script>
import L from 'leaflet';

export default {
  mounted: () => {
    /* render the map when the element is mounted */
    L.map('map');
  },
};
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
</style>
