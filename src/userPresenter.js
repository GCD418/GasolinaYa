import ModGasolineras from "./ModGasolineras.js";
import ModUsuarios from "./ModUsuarios.js";
import { setupQueueFunctionality } from "./queueManager.js";
import { calculate_waiting_time, estimate_fuel_load } from "./user_queue.js";
import { getAvailableStations, reserveTicket, getReservationMessage, canReserve, cancelTicket } from "./ReserveTicket.js";

const modGasolineras = new ModGasolineras();
const modUsuarios = new ModUsuarios();
const stationContainer = document.getElementById("station_container");
const messageDiv = document.getElementById("ticket_message");




async function initializeApp() {
    await modGasolineras.ready();
    await modUsuarios.ready();

    createQueueButton();
    setupQueueFunctionality(modGasolineras, modUsuarios);
    renderServiceStatioTable();
    const userPlate = "TST999";
const stations = Array.from(modGasolineras.getGasolineras().keys());
let user = modUsuarios.getUsuario(userPlate);

console.log("Gasolineras cargadas:", stations);
console.log("Usuario obtenido:", user);

if (!user) {
  user = { plate: userPlate, ticket: null };
  modUsuarios.getUsuarios().set(userPlate, user);
  await modUsuarios.updateUsuario(userPlate, null, null);
  console.log("Usuario creado:", user);
}

// Mostrar mensaje si ya tiene ticket
if (!canReserve(user)) {
  const msg = getReservationMessage(user);
  messageDiv.innerText = msg;

  const cancelBtn = document.createElement("button");
  cancelBtn.innerText = "Cancelar ticket";
  cancelBtn.addEventListener("click", async () => {
    await cancelTicket(user);
    await modUsuarios.updateUsuario(user.plate, null, null);
    location.reload();
  });

  messageDiv.appendChild(cancelBtn);
  return;
}

// Mostrar botones de reserva
const availableStations = getAvailableStations(user, stations);
console.log("Estaciones disponibles para reservar:", availableStations);

availableStations.forEach(station => {
  const btn = document.createElement("button");
  btn.innerText = `Reservar en ${station}`;
  btn.className = "btn btn-secondary";
  btn.addEventListener("click", async () => {
    const getHour = () => new Date().toTimeString().substring(0, 5);
    const ticket = await reserveTicket(user, station, getHour);
    await modUsuarios.updateUsuario(user.plate, ticket, null);
    alert(`¡Ticket reservado para ${station} a las ${ticket.hour}!`);
    location.reload();
  });
  stationContainer.appendChild(btn);
});

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