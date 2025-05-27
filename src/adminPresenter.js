import Gasolinera from "./Gasolinera";
import ModGasolineras from "./ModGasolineras";
import ModUsuarios from "./ModUsuarios.js";
import { confirmFuelLoad, removeFromQueue, removeTicket} from "./GestionColas.js";


const name_fuel_station = document.querySelector("h1");
const select_gasolinera = document.getElementById("select_gasolinera");
const liter_quantity_input = document.getElementById("liter_quantity_input");
const button_update_liters = document.getElementById("update_liters");
const result_div = document.getElementById("result");
const liter_capacity_input = document.getElementById("liter_capacity_input");
const name_input = document.getElementById("name_input");
const hoses_input = document.getElementById("hoses_input");
const form = document.getElementById("liters_form");
const form_container = document.getElementById("liters_form_container");
let gasolinera = null;
const gasolineras = new ModGasolineras();

const cisterna_liters_input = document.getElementById("cisterna_liters_input");
const register_cistern_button = document.getElementById("register_cistern_button");
const viewQueueBtn = document.getElementById("view_queue_btn");
const queueContainer = document.getElementById("queue_container");
const queueList = document.getElementById("queue_list");

const viewTicketBtn = document.getElementById("view_ticket_btn");
const ticketContainer = document.getElementById("ticket_container");
const ticketList = document.getElementById("ticket_list");

let users = null;

async function initializeElements(){
    viewQueueBtn.classList.add("hidden");
    viewTicketBtn.classList.add("hidden");
    await gasolineras.ready();
    
    populateSelect();
    
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
    
    gasolinera = new Gasolinera(liters, literCapacity, name, Number.parseInt(hoses_input.value));
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
        hoses_input.value = selectedGasolinera.getHosesNumber();
        form_container.classList.remove("hidden");
        gasolinera = selectedGasolinera;
        showInformation();
        queueContainer.classList.add("hidden");
        queueList.innerHTML = "";
        ticketContainer.classList.add("hidden");
        ticketList.innerHTML = "";          
    }
    viewQueueBtn.classList.remove("hidden");
    viewTicketBtn.classList.remove("hidden");
});



    setupEventListeners();

    //
    users = new ModUsuarios();
    await users.ready();
    //

    viewQueueBtn.addEventListener("click", () => {
        if (!gasolinera) {
            alert("Primero selecciona una gasolinera.");
            return;
        }
    
        const stationName = gasolinera.getName();
        const usuarios = Array.from(users.getUsuarios().values());
    
        const placasEnFila = usuarios
            .filter(user => user.getEnFila() === stationName)
            .map(user => user.getPlaca());
    
        queueList.innerHTML = "";
    
        if (placasEnFila.length === 0) {
            queueList.innerHTML = "<li>No hay autos en la fila</li>";
        }  else {
            placasEnFila.forEach(placa => {
              const li = document.createElement("li");
              li.textContent = placa + " ";
              
              const btn = document.createElement("button");
              btn.textContent = "Remover";
              btn.addEventListener("click", async () => {
                await removeFromQueue(placa, stationName, users, gasolineras);
                li.remove();
                alert(`Placa ${placa} removida de la fila`);
                const usuarios = Array.from(users.getUsuarios().values());
                const placasRestantes = usuarios
                    .filter(user => user.getEnFila() === stationName)
                    .map(user => user.getPlaca());

                if (placasRestantes.length === 0) {
                    queueList.innerHTML = "<li>No hay autos en la fila</li>";
                }
              });
                const btnCargar = document.createElement("button");
                btnCargar.textContent = "Confirmar carguío";
                btnCargar.addEventListener("click", async () => {
                
                const usuario = users.getUsuario(placa);
                usuario.setEnFila(null);
                await users.updateUsuario(placa, null, null);

                
                await confirmFuelLoad(placa, stationName, users, gasolineras);
                gasolinera = gasolineras.getGasolinera(stationName);
                liter_quantity_input.value = gasolinera.getFuelLiters();

                li.remove();
                alert(`Combustible cargado para placa ${placa}`);

                const usuarios = Array.from(users.getUsuarios().values());
                const placasRestantes = usuarios
                    .filter(user => user.getEnFila() === stationName)
                    .map(user => user.getPlaca());

                if (placasRestantes.length === 0) {
                    queueList.innerHTML = "<li>No hay autos en la fila</li>";
                }

                showInformation();
                });

                             

              li.appendChild(btnCargar); 
              li.appendChild(btn);
              queueList.appendChild(li);
            });
          }
    
        queueContainer.classList.remove("hidden");
    });
    
    viewTicketBtn.addEventListener("click", () => {
        if (!gasolinera) {
            alert("Primero selecciona una gasolinera.");
            return;
        }

        const stationName = gasolinera.getName();
        const placasConTicket = getPlacasConTicket(stationName);
        
        ticketList.innerHTML = "";

        if (placasConTicket.length === 0) {
            ticketList.innerHTML = "<li>No hay autos con ticket</li>";
        } else {
            placasConTicket.forEach(placa => {
                const li = createTicketListItem(placa, stationName); 
                ticketList.appendChild(li);
            });
        }

        ticketContainer.classList.remove("hidden");
    });

}

function getPlacasConTicket(stationName) {
    const usuarios = Array.from(users.getUsuarios().values());
    return usuarios
        .filter(user => user.getConTicket() === stationName)
        .map(user => user.getPlaca());
}

function createTicketListItem(placa, stationName) {
    const li = document.createElement("li");
    li.textContent = placa + " ";

    const btnRemoverTicket = createRemoveTicketButton(placa, stationName);
    const btnCargar = createConfirmLoadButton(placa, stationName);

        li.appendChild(btnCargar); 
        li.appendChild(btnRemoverTicket);

    return li;
}

function createRemoveTicketButton(placa, stationName) {
    const btnRemoverTicket = document.createElement("button");
    btnRemoverTicket.textContent = "Remover Ticket";
    btnRemoverTicket.addEventListener("click", async () => {
        await removeTicket(placa, stationName, users, gasolineras);
        
        btnRemoverTicket.parentElement.remove();
        
        alert(`El ticket de la Placa ${placa} fue removido`);
        checkRemainingTickets(stationName);
    });
    return btnRemoverTicket;
}

function createConfirmLoadButton(placa, stationName) {
    const btnCargar = document.createElement("button");
    btnCargar.textContent = "Confirmar carguío";
    btnCargar.addEventListener("click", async () => {
        
        const usuario = users.getUsuario(placa);
        usuario.setConTicket(null);
        await users.updateUsuario(placa, null, null);

        await confirmFuelLoad(placa, stationName, users, gasolineras);
        
        gasolinera = gasolineras.getGasolinera(stationName);
        liter_quantity_input.value = gasolinera.getFuelLiters();

        btnCargar.parentElement.remove();
        alert(`Combustible cargado para placa ${placa}`);
        
        checkRemainingTickets(stationName);
        showInformation();
    });
    return btnCargar;
}

function checkRemainingTickets(stationName) {
    const placasRestantes = getPlacasConTicket(stationName);
    if (placasRestantes.length === 0) {
        ticketList.innerHTML = "<li>No hay autos con ticket</li>";
    }
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
        const hosesInput = Number.parseInt(hoses_input.value);
        
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
        
        gasolinera = new Gasolinera(liters, literCapacity, name, hosesInput);
        //gasolineras.addGasolinera(gasolinera);
        gasolineras.updateGasolinera(gasolinera.getName(), gasolinera.getFuelLiters(), gasolinera.getTotalCapacity());
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
            hoses_input.value = selectedGasolinera.getHosesNumber();
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
    const gasolinerasMap = gasolineras.getGasolineras();
    for (const [key, value] of gasolinerasMap) {
        const option = document.createElement("option");
        option.value = key;
        option.innerHTML = key;
        select_gasolinera.appendChild(option);
    }
}


register_cistern_button.addEventListener("click", async (event) => {
    event.preventDefault();

    const cisternLiters = Number.parseInt(cisterna_liters_input.value);

    if (cisternLiters <= 0) {
        alert("La cantidad de litros debe ser mayor a cero");
        return;
    }

    await gasolineras.ready();

    const gasolineraName = gasolinera.getName();
    const currentFuel = gasolinera.getFuelLiters();
    const capacity = gasolinera.getTotalCapacity();
    const newFuel = currentFuel + cisternLiters;

    if (newFuel > capacity) {
        alert(`No se puede agregar ${cisternLiters} L: se excede la capacidad máxima de ${capacity} L`);
        return;
    }

    gasolinera.addFuel(cisternLiters);

    await gasolineras.updateGasolinera(
        gasolineraName,
        gasolinera.getFuelLiters(),
        gasolinera.getTotalCapacity()
    );

    liter_quantity_input.value = gasolinera.getFuelLiters();
    liter_capacity_input.value = gasolinera.getTotalCapacity();
    name_input.value = gasolinera.getName();

    showInformation();
    cisterna_liters_input.value = "";

    alert("¡Registro de arribo de cisterna exitoso!");
});



document.addEventListener("DOMContentLoaded", () => {
    initializeElements();
});

