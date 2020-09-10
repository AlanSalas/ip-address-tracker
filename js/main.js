document.addEventListener('DOMContentLoaded', () => {
    renderMap()
})

const renderMap = () => {
    const leafletMap = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 15,
        minZoom: 12,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
    }).addTo(leafletMap);

    const iconLocation = L.icon({
        iconUrl: '../images/icon-location.svg',
        iconSize:     [50, 60], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([51.5, -0.09], {icon: iconLocation}).addTo(leafletMap);
}