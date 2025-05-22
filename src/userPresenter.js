import ModGasolineras from "./ModGasolineras.js";
import ModUsuarios from "./ModUsuarios.js";
import { setupQueueFunctionality } from "./queueManager.js";
import { calculate_waiting_time, estimate_fuel_load } from "./user_queue.js";

const modGasolineras = new ModGasolineras();
const modUsuarios = new ModUsuarios();

async function initializeApp() {
    await modGasolineras.ready();
    await modUsuarios.ready();

    createQueueButton();
    setupQueueFunctionality(modGasolineras, modUsuarios);
    renderServiceStatioTable();
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
        //let colorClass = '';
        //colorClass = `background-color: ${colorStyle.backgroundColor}; color: ${colorStyle.textColor};`;
        
        let waiting_time = calculate_waiting_time(gasolinera.getQueueCount());
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
                <td>${possibility}</td>
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
/*
function getColorForPercentage(percent) {
    if (percent === 0) {
        return {
            backgroundColor: 'red',
            textColor: 'white'
        };
    } else if (percent <= 20) {
        return {
            backgroundColor: 'yellow',
            textColor: 'black'
        };
    } else {
        return {
            backgroundColor: 'green',
            textColor: 'white'
        };
    }
}
*/
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