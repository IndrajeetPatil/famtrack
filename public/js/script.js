mapboxgl.accessToken = "pk.eyJ1IjoiYmluZ2hhdGNoIiwiYSI6ImNsZTdiYzQzaDAzeWMzc3F4b3piMWEzZHgifQ.k4mj9dujH6ulPhWNTCyuYA";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
