const formulario = document.querySelector("#formulario");
let resultado = document.querySelector("#resultado");
let ciudad = document.querySelector("#ciudad");
let pais = document.querySelector("#pais");
let loader = document.querySelector(".content-loader");

let key = "4b915534cbe1eaeffa468d6bd42aadfd";

async function obtenerImg() {
  let unsplashApi = `https://api.unsplash.com/collections/893395/photos?client_id=wMKNsr6zMpEJ0d5lyPUUuiBfC8XIHr77MQOnxtHcacs`;
  let response = await fetch(unsplashApi);
  let resultado = await response.json();
  let random = Math.floor(Math.random() * resultado.length + 1);

  let imgUrl = resultado[random].urls.regular;

  return imgUrl;
}

async function ubicacionUser() {
  let img = await obtenerImg();

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}&lang=es`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => createClima(data, img));
    });
  }
}

async function buscarClima(ciudad, pais) {
  let img = await obtenerImg();
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&cnt=10&units=metric&appid=${key}&lang=es`;
  let response = await fetch(url);
  let result = await response.json();

  createClima(result, img);
}

function obtenerClima(e) {
  e.preventDefault();

  ciudad.value.length === 0 || pais.value === ""
    ? createMensaje("error", "Los campos no pueden estar vacios")
    : buscarClima(ciudad.value, pais);
}

function createMensaje(tipo, mensaje) {
  let container = document.querySelector(".container");
  let div = document.createElement("div");
  let p = document.createElement("p");

  if (!container.querySelector(".alerta")) {
    div.className =
      "w-3/6 m-auto text-center shadow bg-gray-100 mt-4 rounded alerta";
    p.className = "font-bold font-2xl";
    p.textContent = mensaje;

    if (tipo === "error")
      div.innerHTML = `<span class="iconify-inline m-auto" data-icon="bx:bxs-error-circle" style="color: #ea1212;" data-width="90" data-height="90"></span>`;

    div.appendChild(p);
    container.appendChild(div);

    setTimeout(() => container.removeChild(div), 2000);
  }
}

function createClima(date, imgUrl) {
  const {
    cod,
    message,
    name,
    weather,
    main: { humidity, feels_like },
    sys: { country },
    clouds: { all },
    wind: { speed },
  } = date;

  if (resultado.querySelector(".clima"))
    resultado.removeChild(resultado.firstElementChild);

  if (cod === "404") return createMensaje("error", message);

  let contenedorResult = document.createElement("div");
  contenedorResult.dataset.name = "contenedorResult";

  let descrip = document.createElement("div");
  descrip.dataset.name = "descrip";

  let descripUbicacion = document.createElement("p");
  let descripClima = document.createElement("p");

  let descrip2 = document.createElement("div");
  descrip2.dataset.name = "descrip2";

  let descrip2Nubosidad = document.createElement("p");
  let descrip2Humedad = document.createElement("p");
  let descrip2Viento = document.createElement("p");

  let clima = document.createElement("div");
  clima.dataset.name = "clima";
  let climaIcon = document.createElement("img");
  let climaGrados = document.createElement("p");

  contenedorResult.className =
    "m-auto text-center shadow mt-4 rounded p-4 clima grid relative";
  contenedorResult.style.background = `url(${imgUrl})#fff no-repeat center/cover`;

  descripUbicacion.className =
    "uppercase font-extrabold text-lg text-gray-900 tracking-widest text-left";
  descripUbicacion.innerHTML = `${name}, ${country} <br>`;

  descripClima.className = "text-xl text-left";
  descripClima.textContent = weather[0].description;

  let iconViento = `<span class="iconify-inline inline" data-icon="uil:wind" data-width="20" data-height="20"></span>`;
  descrip2Viento.innerHTML = `${iconViento} Velocidad de viento: ${speed}m/s`;

  let iconNubosidad = `<span class="iconify-inline inline" data-icon="clarity:cloud-scale-line" data-width="20" data-height="20"></span>`;
  descrip2Nubosidad.innerHTML = `${iconNubosidad} Nubosidad: ${all}%`;

  let iconHumedad = `<span class="iconify-inline inline" data-icon="wi:humidity" data-width="20" data-height="20"></span>`;
  descrip2Humedad.innerHTML = `${iconHumedad} Humedad: ${humidity}%`;

  climaGrados.className = "self-center";
  climaGrados.textContent = `${parseInt(feels_like)}°C`;

  climaIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
  );
  descrip.appendChild(descripUbicacion);
  descrip.appendChild(descripClima);

  descrip2.appendChild(descrip2Viento);
  descrip2.appendChild(descrip2Nubosidad);
  descrip2.appendChild(descrip2Humedad);

  clima.appendChild(climaIcon);
  clima.appendChild(climaGrados);

  contenedorResult.appendChild(descrip);
  contenedorResult.appendChild(descrip2);
  contenedorResult.appendChild(clima);

  resultado.appendChild(contenedorResult);

  loader.style.display = "none";
}

formulario.addEventListener("submit", obtenerClima);
document.addEventListener("DOMContentLoaded", ubicacionUser);
