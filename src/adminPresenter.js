import Gasolinera from "./Gasolinera";
import ModGasolineras from "./ModGasolineras";

const name_fuel_station = document.querySelector("h1");
const select_gasolinera = document.getElementById("select_gasolinera");
const liter_quantity_input = document.getElementById("liter_quantity_input");
const button_update_liters = document.getElementById("update_liters");
const result_div = document.getElementById("result");
const liter_capacity_input = document.getElementById("liter_capacity_input");
const name_input = document.getElementById("name_input");
const form = document.getElementById("liters_form");
const form_container = document.getElementById("liters_form_container");
let gasolinera = null;
const gasolineras = new ModGasolineras();

function initializeElements(){
    populateSelect();

    setupEventListeners();
}

function setupEventListeners(){
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if(!liter_quantity_input.value){
            alert("Por favor ingrese la cantidad de litros");
            return;
        }
        if(!liter_capacity_input.value){
            alert("Por favor ingrese la cantidad de litros");
            return;
        }
        if(!name_input.value){
            alert("Por favor ingrese el nombre de la gasolinera");
            return;
        }
        
        
        const liters = Number.parseInt(liter_quantity_input.value);
        const literCapacity = Number.parseInt(liter_capacity_input.value);
        const name = name_input.value;
        
        if(liters < 0){
            alert("La cantidad de litros no puede ser negativa");
            return;
        }
        if(literCapacity <= 0){
            alert("La capacidad del surtidor no puede ser negativa ni cero");
            return;
        }
        if(liters > literCapacity){
            alert("La cantidad de litros no puede ser mayor a la capacidad del surtidor");
            return;
        }
        
        gasolinera = new Gasolinera(liters, literCapacity, name);
        gasolineras.addGasolinera(gasolinera);
        showInformation();
    });
    
    select_gasolinera.addEventListener("change", (event) => {
        const firstOption = select_gasolinera.options[0];
        if(firstOption && firstOption.disabled){
            select_gasolinera.removeChild(firstOption);
        }
        const gasolineras = new ModGasolineras();
        // const gasolinerasMap = gasolineras.getGasolineras();
        // const selectedGasolinera = gasolinerasMap.get(event.target.value);
        const selectedGasolinera = gasolineras.getGasolinera(event.target.value);
        if(selectedGasolinera){
            liter_quantity_input.value = selectedGasolinera.getFuelLiters();
            liter_capacity_input.value = selectedGasolinera.getTotalCapacity();
            name_input.value = selectedGasolinera.getName();
            form_container.classList.remove("hidden");
            gasolinera = selectedGasolinera;
            showInformation();
        }
    });
}

function showInformation(){
    result_div.innerHTML = `
    <p>La cantidad de litros de gasolina es: ${gasolinera.getFuelLiters()}</p>
    <p>La capacidad del surtidor es: ${gasolinera.getTotalCapacity()}</p>
    <p>El porcentaje restante de combustible es: ${gasolinera.getFuelPercent()}%</p>
    `;
    
    updateColorBasedOnPercentCapacity(gasolinera.getFuelPercent());
    name_fuel_station.innerHTML = `Estación de servicio "${gasolinera.getName()}"`;
}

function updateColorBasedOnPercentCapacity(percent){
    if(percent <= 20){
        name_fuel_station.style.backgroundColor = "yellow";
    }
    else if (percent > 20){
        name_fuel_station.style.backgroundColor = "green";
    }
}

function populateSelect(){
    gasolineras.insertFakeData();
    const gasolinerasMap = gasolineras.getGasolineras();
    for (const [key, value] of gasolinerasMap) {
        const option = document.createElement("option");
        option.value = key;
        option.innerHTML = key;
        select_gasolinera.appendChild(option);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeElements();
});