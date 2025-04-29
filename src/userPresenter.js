import ModGasolineras from "./ModGasolineras.js";

const modGasolineras = new ModGasolineras();
modGasolineras.insertFakeData();


function renderServiveStatioTable() {
    const container = document.querySelector("#service_stations_container");
    if (!container) return;

    const gasolineras = modGasolineras.getGasolineras();
    
    let tableHTML = `
        <table border="1" class="gasolineras-table">
            <thead>
                <tr>
                    <th>Gasolinera</th>
                    <th>Combustible Actual [Lt]</th>
                    <th>Capacidad Total [Lt]</th>
                    <th>Porcentaje de combustible</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    gasolineras.forEach((gasolinera, name) => {
        tableHTML += `
            <tr>
                <td>${gasolinera.getName()}</td>
                <td>${gasolinera.getFuelLiters()} L</td>
                <td>${gasolinera.getTotalCapacity()} L</td>
                <td>${gasolinera.getFuelPercent().toFixed(2)}%</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    renderServiveStatioTable();
});