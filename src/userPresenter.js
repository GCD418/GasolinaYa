import ModGasolineras from "./ModGasolineras.js";
import { setupQueueFunctionality } from "./queueManager.js";

const modGasolineras = new ModGasolineras();

async function initializeApp() {
    await modGasolineras.ready();
    
    renderServiceStatioTable();
    setupQueueFunctionality(modGasolineras);
}


function renderServiceStatioTable() {
    const container = document.querySelector("#service_stations_container");
    if (!container) return;

    let tableHTML = createTableWithHeader();
    
    const gasolineras = modGasolineras.getGasolineras();
    gasolineras.forEach((gasolinera) => {
        const percent = gasolinera.getFuelPercent().toFixed(2);
        const colorStyle = getColorForPercentage(percent);
        let colorClass = '';
        colorClass = `background-color: ${colorStyle.backgroundColor}; color: ${colorStyle.textColor};`;
        
        tableHTML += `
            <tr>
                <td>${gasolinera.getName()}</td>
                <td>${gasolinera.getFuelLiters()} L</td>
                <td>${gasolinera.getTotalCapacity()} L</td>
                <td style="${colorClass} text-align: right">${percent}%</td>
                <td style="${colorClass} text-align: right">${gasolinera.getQueueCount()}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

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
                </tr>
            </thead>
            <tbody>
    `;
   return tableHTML;
}

document.addEventListener("DOMContentLoaded", initializeApp);