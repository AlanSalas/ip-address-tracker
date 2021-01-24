document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setLoader();
  setTimeout(() => {
    renderInfo();
    removeLoader();
  }, 2000);

  searchData();

  switchDarkMode();
});

// Config
const API_KEY = "at_rV2kSWS3tAIVOp7bGWDwO0vD8M2dQ";
const ENDPOINT_IPIFY = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}`;
const REGEX_IP = /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/gi;
const REGEX_DOMAIN = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/g;
// Dom Elements
const $inputIp = document.getElementById("input-ip");
const $ip = document.getElementById("ip");
const $location = document.getElementById("location");
const $timezone = document.getElementById("timezone");
const $isp = document.getElementById("isp");
const switchTheme = document.querySelector(".actions__theme");
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
  $ip.innerText = data.ip;
  $location.innerText = data.location.city;
  $timezone.innerText = data.location.timezone;
  $isp.innerText = data.isp;
  renderMap(data.location.lat, data.location.lng);
};

const searchData = async () => {
  const $form = document.getElementById("form");

  $form.addEventListener("submit", e => {
    e.preventDefault();
    const result = validData();
    if (result) {
      setLoader();
      setTimeout(() => {
        renderInfo(result.type, result.value);
        removeLoader();
      }, 1500);
      $inputIp.value = "";
    }
  });
};

const validData = () => {
  const data = {};
  if (REGEX_IP.test($inputIp.value)) {
    data.value = $inputIp.value;
    data.type = "ipAddress";
    return data;
  } else if (REGEX_DOMAIN.test($inputIp.value)) {
    data.value = $inputIp.value;
    data.type = "domain";
    return data;
  } else {
    $inputIp.value = "";
    $inputIp.placeholder = "Invalid Ip or Domain";
  }
};

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

const setLoader = () => {
  $ip.innerText = "";
  $location.innerText = "";
  $timezone.innerText = "";
  $isp.innerHTML = "";
  $ip.classList.add("info-ip__loading");
  $location.classList.add("info-ip__loading");
  $timezone.classList.add("info-ip__loading");
  $isp.classList.add("info-ip__loading");
};

const removeLoader = () => {
  $ip.classList.toggle("info-ip__loading");
  $location.classList.toggle("info-ip__loading");
  $timezone.classList.toggle("info-ip__loading");
  $isp.classList.toggle("info-ip__loading");
};

const initTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    switchTheme.innerText = "🌝";
  } else {
    document.body.classList.remove("dark");
    switchTheme.innerText = "🌚";
  }
};

const switchDarkMode = () => {
  switchTheme.addEventListener("click", () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      switchTheme.innerText = "🌚";
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      switchTheme.innerText = "🌝";
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  });
};
