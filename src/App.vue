<template>
  <md-app>
    <md-app-toolbar class="md-primary">
      <h1 class="md-title">Aspartam Polygon Editor</h1>
      <div class="md-toolbar-section-end">
        <md-button @click="union">Union</md-button>
        <md-button @click="intersect">Intersect</md-button>
      </div>
    </md-app-toolbar>
    <md-app-content>
      <div id="map" />
      <md-dialog-alert
        :md-active.sync="dialogAlert"
        md-content="Desired operation requires exactly two input polygons" />
    </md-app-content>
  </md-app>
</template>

<script>
import L from 'leaflet';
import { union, intersect } from './turf-leaflet';

export default {

  data() {
    return {
      /* toggle for alert box */
      dialogAlert: false,

      /* selected polygon ids */
      selected: new Set(),

      /* polygon layer group */
      polygonLayerGroup: null,

    };
  },

  computed: {
    polygons() {
      return this.$store.state.polygons;
    },
  },

  watch: {
    polygons(val) {
      // keep the polygon layer in sync
      this.polygonLayerGroup.clearLayers();
      this.selected.clear();
      const features = L.geoJSON(val);
      features.getLayers().forEach(layer => this.polygonLayerGroup.addLayer(layer));
    },
  },

  mounted() {
    /* render the map when the element is mounted */
    const map = L.map('map');

    /* add background layer */
    L
      .tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}', {
        accessToken: 'pk.eyJ1IjoiaGF3a2FhIiwiYSI6ImNpZzN3b2xqMzI2dDF1dm0zYnc2dm01ejMifQ.qf4qwnuEb8s5q_xTO6JfUQ',
        id: 'mapbox',
      })
      .addTo(map);

    /* add the geojson */
    this.polygonLayerGroup = L
      .geoJSON(this.polygons)
      .addTo(map);

    /* fit bounds */
    map.fitBounds(this.polygonLayerGroup.getBounds());

    /* set styles */
    this.updateHighlightStyles();

    /* event listeners */
    this.polygonLayerGroup.on('click', this.onPolygonClick);
  },


  methods: {

    getId(layer) {
      return this.polygonLayerGroup.getLayerId(layer);
    },

    onPolygonClick(event) {
      const id = this.getId(event.layer);
      if (this.selected.has(id)) {
        this.selected.delete(id);
      } else {
        this.selected.add(id);
      }
      this.updateHighlightStyles();
    },

    updateHighlightStyles() {
      this.polygonLayerGroup.getLayers().forEach((layer) => {
        if (this.selected.has(this.getId(layer))) {
          layer.setStyle({ fillColor: 'red' });
        } else {
          layer.setStyle({ fillColor: 'blue' });
        }
      });
    },

    union() {
      this.mergeFeatures(union);
    },

    intersect() {
      this.mergeFeatures(intersect);
    },

    mergeFeatures(operation) {
      const [a, b] = this.getFeaturesOrNull();
      if (a !== null && b !== null) {
        /* Not very happy about this part. It actually adds and removes layers to the actual map
            when it should only calculate a new geojson. Consider moving more responsibilities to
            turf? */
        const feature = operation(a, b);
        this.polygonLayerGroup.addLayer(feature);
        this.polygonLayerGroup.removeLayer(a);
        this.polygonLayerGroup.removeLayer(b);
        this.$store.dispatch('polygons', this.polygonLayerGroup.toGeoJSON());
      } else {
        this.dialogAlert = true;
      }
    },

    getFeaturesOrNull() {
      if (this.selected.size === 2) {
        const values = this.selected.values();
        const idA = values.next().value;
        const idB = values.next().value;
        const a = this.polygonLayerGroup.getLayer(idA);
        const b = this.polygonLayerGroup.getLayer(idB);
        return [a, b];
      }
      return [null, null];
    },
  },
};
</script>

<style>

body, .md-app, .md-content {
  height: 100%;
}

#map {
  width: 100%;
  height: 100%;
}

.md-dialog {
  background-color: white;
}

</style>
