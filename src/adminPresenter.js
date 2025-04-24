import Gasolinera from "./Gasolinera";
const liter_quantity_input = document.getElementById("liter_quantity_input");
const button_update_liters = document.getElementById("update_liters");
const result_div = document.getElementById("result");
const form = document.getElementById("liters_form");


form.addEventListener("submit", (event) => {
    event.preventDefault();
    const liters = Number.parseInt(liter_quantity_input.value);
    const gasolinera = new Gasolinera(liters);

    result_div.innerHTML = `
    <p>La cantidad de litros de gasolina es: ${gasolinera.getFuelLiters()}</p>
    `;
});