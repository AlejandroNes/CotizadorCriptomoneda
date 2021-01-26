//variables
const criptomonedaSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

//creando promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

//eventos
addEventListener("DOMContentLoaded", () => {
  consultarCriptomoneda();

  formulario.addEventListener("submit", submitFormulario);

  criptomonedaSelect.addEventListener("change", leerDatos);
  monedaSelect.addEventListener("change", leerDatos);
});

//funciones
function consultarCriptomoneda() {
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
  fetch(url)
    .then((resp) => resp.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

//crando opciones para el select
function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((item) => {
    const { FullName, Name } = item.CoinInfo;

    const opcion = document.createElement("option");
    opcion.value = Name;
    opcion.textContent = FullName;
    criptomonedaSelect.appendChild(opcion);
  });
}
//leer datos
function leerDatos(e) {
  e.preventDefault();
  objBusqueda[e.target.name] = e.target.value;
  console.log(objBusqueda);
}

function submitFormulario(e) {
  e.preventDefault();
  const { moneda, criptomoneda } = objBusqueda;
  if (moneda == "" && criptomoneda == "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }
  //consultrar API
  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const alertaerror = document.querySelector(".error");
  if (!alertaerror) {
    const alerta = document.createElement("div");
    alerta.classList.add("error");
    alerta.textContent = mensaje;
    formulario.appendChild(alerta);
    setTimeout(() => {
      alerta.remove();
    }, 2000);
  }
}
// consultando API
function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      mostrarCotizacion(data.DISPLAY[criptomoneda][moneda]);
    });
}
//funcion mostrar cotizacion
function mostrarCotizacion(cotizacion) {
    //limpiando el HTML
    limpiar();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR } = cotizacion;
  //creando html
  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

  //creando html
  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `El precio mas alto es: ${HIGHDAY}`;
  //creando html
  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `El precio mas bajo es: ${LOWDAY}`;
  //creando html
  const precio24 = document.createElement("p");
  precio24.innerHTML = `Variacion en las ultimas 24 horas: ${CHANGEPCT24HOUR}`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(precio24);
}

// limpiar html
function limpiar(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}