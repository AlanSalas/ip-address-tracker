document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    renderInfo();
  }, 1000);
  searchData();
});

// Config
const API_KEY = "at_rV2kSWS3tAIVOp7bGWDwO0vD8M2dQ";
const ENDPOINT_IPIFY = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}`;
const REGEX_IP = /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/ig;
const REGEX_DOMAIN = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/g;
// Dom Elements
const $inputIp = document.getElementById("input-ip");
const $ip = document.getElementById("ip");
const $location = document.getElementById("location");
const $timezone = document.getElementById("timezone");
const $isp = document.getElementById("isp");
// Initialize leafletMap
const leafletMap = L.map("map", { zoomControl: false, zoom: 13 });

const fetchIp = async (type, value) => {

  const url = type ? `${ENDPOINT_IPIFY}&${type}=${value}` : ENDPOINT_IPIFY;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const renderInfo = async (type, value) => {
  const data = await fetchIp(type, value);
  $ip.innerText = data.ip
  $location.innerText = data.location.city
  $timezone.innerText = data.location.timezone
  $isp.innerText = data.isp
  renderMap(data.location.lat, data.location.lng);
};

const searchData = async (e) => {
  const $form = document.getElementById("form");

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = validData();
    if (result) {
      $ip.innerText = "Loading...";
      $location.innerText = "Loading...";
      $timezone.innerText = "Loading...";
      $isp.innerText = "Loading...";
      renderInfo(result.type, result.value);
    }
  });
};

const validData = () => {
  const data = {};
  if (REGEX_IP.test($inputIp.value)) {
    data.value = $inputIp.value;
    data.type = "ipAddress"
    return data;
  } else if (REGEX_DOMAIN.test($inputIp.value)) {
    data.value = $inputIp.value;
    data.type = "domain"
    return data;
  } else {
    $inputIp.value = "";
    $inputIp.placeholder = "Invalid Ip or Domain";
  }
}

const renderMap = (lat, lng) => {
  leafletMap.setView([lat, lng]);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 15,
      minZoom: 5,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(leafletMap);

  const iconLocation = L.icon({
    iconUrl: "../images/icon-location.svg",
    iconSize: [20, 25],
  });

  L.marker([lat, lng], { icon: iconLocation }).addTo(leafletMap);
};
