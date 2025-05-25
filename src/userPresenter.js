import ModGasolineras from "./ModGasolineras.js";
import ModUsuarios from "./ModUsuarios.js";
import { setupQueueFunctionality } from "./queueManager.js";
import { calculate_waiting_time, estimate_fuel_load } from "./user_queue.js";
import { reserveTicket, cancelReservation } from "./ReserveTicket.js";


const modGasolineras = new ModGasolineras();
const modUsuarios = new ModUsuarios();

async function initializeApp() {
   
      
    await modGasolineras.ready();
    await modUsuarios.ready();
    

    createQueueButton();
    setupQueueFunctionality(modGasolineras, modUsuarios);
    renderServiceStatioTable();


    async function populateUserSelect() {
        const select = document.getElementById("user_select");
        if (!select) return;
    
        const users = Array.from(modUsuarios.getUsuarios().values());
    
        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user.getPlaca();
            option.textContent = user.getPlaca();
            select.appendChild(option);
        });
    }
    await populateUserSelect();
    setupUserSelection();


}

function createQueueButton() {
    const container = document.querySelector("#service_stations_container");
    if (!container) return;
    
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "queue-button-container";

    const addToQueueButton = document.createElement("button");
    addToQueueButton.id = "add_queue_button";
    addToQueueButton.className = "btn btn-primary";
    addToQueueButton.textContent = "Registrarse en Cola";

    buttonContainer.appendChild(addToQueueButton);
    
    container.insertBefore(buttonContainer, container.firstChild);
}

function renderServiceStatioTable() {
    const container = document.querySelector("#service_stations_container");

    if (!container) return;

    let tableHTML = createTableWithHeader();
    
    const gasolineras = modGasolineras.getGasolineras();
    gasolineras.forEach((gasolinera) => {
        const percent = gasolinera.getFuelPercent().toFixed(2);
        const colorStyle = getColorForPercentage(percent);
        
        let waiting_time = calculate_waiting_time(gasolinera.getQueueCount(), gasolinera.getHosesNumber());
        let possibility = estimate_fuel_load(gasolinera.getFuelLiters(), gasolinera.getQueueCount());
        tableHTML += `
            <tr>
                <td>${gasolinera.getName()}</td>
                <td>${gasolinera.getFuelLiters()} L</td>
                <td>${gasolinera.getTotalCapacity()} L</td>
                <td>
                    <span>${percent}%</span>
                    <span class="fuel-indicator ${colorStyle.ledClass}"></span>
                </td>
                <td>${gasolinera.getQueueCount()}</td>
                <td>${waiting_time}</td>
                <td>${possibility}%</td>
            </tr>`;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    const tableContainer = document.createElement("div");
    tableContainer.className = "table-container";
    tableContainer.innerHTML = tableHTML;
    container.appendChild(tableContainer);
}

function createTableWithHeader(){
    let tableHTML = `
        <table border="1" class="gasolineras-table">
            <thead>
                <tr>
                    <th>Gasolinera</th>
                    <th>Combustible Actual [Lt]</th>
                    <th>Capacidad Total [Lt]</th>
                    <th>Porcentaje de combustible</th>
                    <th>Autos en fila</th>
                    <th>Tiempo de espera [min]</th>
                    <th>Posibilidad de cargar</th>
                </tr>
            </thead>
            <tbody>
    `;
   return tableHTML;
}

function getColorForPercentage(percent) {
    if (percent === 0) {
        return {
            backgroundColor: 'red',
            textColor: 'white',
            ledClass: 'empty'
        };
    } else if (percent <= 20) {
        return {
            backgroundColor: 'yellow',
            textColor: 'black',
            ledClass: 'low'
        };
    } else {
        return {
            backgroundColor: 'green',
            textColor: 'white',
            ledClass: 'good'
        };
    }
}

function setupUserSelection() {
    const userSelect = document.getElementById("user_select");
    const message = document.getElementById("reservation_message");
    const stationContainer = document.getElementById("station_select_container");
    const stationSelect = document.getElementById("station_select");
    const reserveButton = document.getElementById("reserve_button");
    const cancelButton = document.getElementById("cancel_reservation_button");

    if (!userSelect || !message || !stationContainer || !stationSelect || !reserveButton || !cancelButton) return;

    stationContainer.style.display = "none";
    reserveButton.style.display = "none";
    cancelButton.style.display = "none";

    userSelect.addEventListener("change", () => {
        const selectedPlaca = userSelect.value;
        const user = modUsuarios.getUsuario(selectedPlaca);

        stationContainer.style.display = "none";
        reserveButton.style.display = "none";
        cancelButton.style.display = "none";

        if (!user) {
            message.textContent = "Usuario no encontrado.";
            return;
        }

        if (user.getConTicket()) {
            message.textContent = `Ya tienes una reserva activa en la estación ${user.getConTicket()}`;
            cancelButton.style.display = "inline-block";
        } else {
            message.textContent = "No tienes ninguna reserva activa. Puedes seleccionar una estación.";
            populateStationSelect(modGasolineras);
            stationContainer.style.display = "block";

            stationSelect.addEventListener("change", () => {
                if (stationSelect.value) {
                    reserveButton.style.display = "inline-block";
                } else {
                    reserveButton.style.display = "none";
                }
            }, { once: true });

            setupReservationButton();
        }
        
        setupCancelButton(); 
    });
}



function populateStationSelect(modGasolineras) {
    const select = document.getElementById("station_select");
    if (!select) return;

    // Limpiar opciones previas
    select.innerHTML = '<option disabled selected value="">-- Elige una estación --</option>';

    const gasolineras = modGasolineras.getGasolineras();
    gasolineras.forEach(gas => {
        const option = document.createElement("option");
        option.value = gas.getName();
        option.textContent = gas.getName();
        select.appendChild(option);
    });
}

function setupReservationButton() {
    const button = document.getElementById("reserve_button");
    const stationSelect = document.getElementById("station_select");
    const userSelect = document.getElementById("user_select");
    const message = document.getElementById("reservation_message");
    const container = document.getElementById("station_select_container");

    if (!button || !stationSelect || !userSelect || !message || !container) return;

    button.addEventListener("click", async () => {
        const selectedStation = stationSelect.value;
        const selectedPlaca = userSelect.value;

        if (!selectedStation || !selectedPlaca) {
            alert("Selecciona una estación y una placa válida.");
            return;
        }

        await reserveTicket(selectedPlaca, selectedStation, modUsuarios, modGasolineras);

        const updatedUser = modUsuarios.getUsuario(selectedPlaca);
        message.textContent = `¡Reservaste en la estación ${updatedUser.getConTicket()}!`;
        container.style.display = "none";
    });
}

function setupCancelButton() {
    const cancelButton = document.getElementById("cancel_reservation_button");
    const userSelect = document.getElementById("user_select");
    const message = document.getElementById("reservation_message");

    if (!cancelButton || !userSelect || !message) return;

    cancelButton.onclick = async () => {
        const selectedPlaca = userSelect.value;
        const success = await cancelReservation(selectedPlaca, modUsuarios);
      
        if (success) {
          message.textContent = "Tu reserva ha sido cancelada.";
          cancelButton.style.display = "none";
          userSelect.dispatchEvent(new Event("change"));
        }
      };
      
}


document.addEventListener('tableUpdateRequired', async (event) => {
    console.log('Actualizando tabla por:', event.detail);

    const container = document.querySelector("#service_stations_container");
    if (container) {
        const existingTableContainer = container.querySelector(".table-container");
        if (existingTableContainer) {
            existingTableContainer.remove();
        }

        renderServiceStatioTable();
    }
});

document.addEventListener("DOMContentLoaded", initializeApp);