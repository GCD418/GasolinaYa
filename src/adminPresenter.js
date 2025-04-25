import Gasolinera from "./Gasolinera";
const name_fuel_station = document.querySelector("h1");
const liter_quantity_input = document.getElementById("liter_quantity_input");
const button_update_liters = document.getElementById("update_liters");
const result_div = document.getElementById("result");
const liter_capacity_input = document.getElementById("liter_capacity_input");
const name_input = document.getElementById("name_input");
const form = document.getElementById("liters_form");



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
    const gasolinera = new Gasolinera(liters, literCapacity, name);
    
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
    result_div.innerHTML = `
    <p>La cantidad de litros de gasolina es: ${gasolinera.getFuelLiters()}</p>
    <p>La capacidad del surtidor es: ${gasolinera.getTotalCapacity()}</p>
    <p>El porcentaje restante de combustible es: ${gasolinera.getFuelPercent()}%</p>
    <p>El nombre de la gasolinera es: ${gasolinera.getName()}</p>
    `;

    updateColorBasenOnPercentCapacity(gasolinera.getFuelPercent());
});

updateColorBasenOnPercentCapacity = (percent) => {
    if(percent <= 20){
        name_fuel_station.style.backgroundColor = "yellow";
    }
    else if (percent > 20){
        name_fuel_station.style.backgroundColor = "green";
    }
}
