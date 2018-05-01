<template>
  <md-app>
    <md-app-toolbar class="md-primary">
      <h1 class="md-title">Aspartam Polygon Editor</h1>
      <div class="md-toolbar-section-end">
        <md-button
          :disabled="buttonsDisabled"
          @click="union">Union</md-button>
        <md-button
          :disabled="buttonsDisabled"
          @click="intersect">Intersect</md-button>
        <md-button @click="reset" >Reset</md-button>
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

      /* layer group */
      layerGroup: null,

    };
  },

  computed: {
    polygons() {
      return this.$store.state.polygons;
    },
    buttonsDisabled() {
      return this.selected.size !== 2;
    },
  },

  watch: {

    /* keep the polygon layer in sync on polygon update. Doesn't work with hot reload,
        unfortunately :( */
    polygons(val) {
      this.layerGroup.clearLayers();
      this.selected = new Set();
      const features = L.geoJSON(val);
      features.getLayers().forEach(layer => this.layerGroup.addLayer(layer));
      this.updateHighlightStyles();
    },
  },

  mounted() {
    /* render the map when the element is mounted, and show the entire world */
    const map = L.map('map', {
      center: [51.5, -0.13],
      zoom: 12,
    });

    /* add background layer */
    L
      .tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}', {
        accessToken: 'pk.eyJ1IjoiaGF3a2FhIiwiYSI6ImNpZzN3b2xqMzI2dDF1dm0zYnc2dm01ejMifQ.qf4qwnuEb8s5q_xTO6JfUQ',
        id: 'mapbox',
      })
      .addTo(map);

    this.layerGroup = L
      .featureGroup()
      .addTo(map);

    /* event listeners */
    this.layerGroup.on('click', this.onPolygonClick);
  },


  methods: {

    getIdForLayer(layer) {
      return this.layerGroup.getLayerId(layer);
    },

    onPolygonClick(event) {
      const id = this.getIdForLayer(event.layer);
      /* let's make set immutable to get vue to understand that the state is actually changing */
      const selected = new Set(this.selected.values());
      if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }
      this.selected = selected;
      this.updateHighlightStyles();
    },

    updateHighlightStyles() {
      this.layerGroup.getLayers().forEach((layer) => {
        if (this.selected.has(this.getIdForLayer(layer))) {
          layer.setStyle({ fillColor: 'red' });
        } else {
          layer.setStyle({ fillColor: 'blue' });
        }
      });
    },

    reset() {
      this.$store.dispatch('resetPolygons');
    },

    union() {
      this.mergeFeatures(union);
    },

    intersect() {
      this.mergeFeatures(intersect);
    },

    mergeFeatures(operation) {
      const [a, b] = this.getFeaturesOrNull();
      /* did I mention I hate null values? Where's my optionals? */
      if (a !== null && b !== null) {
        const newFeature = operation(a, b);

        /* create a temporary layer group with all features except the ones we're removing */
        const tempLayerGroup = L.featureGroup();
        this.layerGroup
          .getLayers()
          .filter(layer => layer !== a && layer !== b)
          .forEach(layer => tempLayerGroup.addLayer(layer));
        tempLayerGroup.addLayer(newFeature);

        /* sync the new geojson with the store */
        this.$store.dispatch('setPolygons', tempLayerGroup.toGeoJSON());
      } else {
        this.dialogAlert = true;
      }
    },

    getFeaturesOrNull() {
      if (this.selected.size === 2) {
        const values = this.selected.values();
        const idA = values.next().value;
        const idB = values.next().value;
        const a = this.layerGroup.getLayer(idA);
        const b = this.layerGroup.getLayer(idB);
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
