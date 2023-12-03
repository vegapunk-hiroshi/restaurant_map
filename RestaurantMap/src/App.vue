<script setup>
import {initMap, filterRestaurants} from './maps/maps'
const res = initMap();
res.then((e)=> {
  console.log('map read', e);
});

function filter() {
  filterRestaurants();
}

</script>

<template>
  <div id="filter-panel">
    <label for="type-select">Choose a restaurant type:</label>
    <select id="type-select" @change="filter">
        <option value="all">All</option>
        <option value="Italian">Italian</option>
        <option value="Japanese">Japanese</option>
        <option value="Fast Food">Fast Food</option>
    </select>
  </div>

  <div id="map"></div>
</template>

<style scoped>


.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
