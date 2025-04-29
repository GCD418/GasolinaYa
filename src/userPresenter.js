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
    
    gasolineras.forEach((gasolinera) => {
        const percent = gasolinera.getFuelPercent();
        let colorClass = '';
        
        const colorStyle = getColorForPercentage(percent);
        colorClass = `background-color: ${colorStyle.backgroundColor}; color: ${colorStyle.textColor};`;
        
        tableHTML += `
            <tr>
                <td>${gasolinera.getName()}</td>
                <td>${gasolinera.getFuelLiters()} L</td>
                <td>${gasolinera.getTotalCapacity()} L</td>
                <td style="${colorClass}">${percent.toFixed(2)}%</td>
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

document.addEventListener("DOMContentLoaded", () => {
    renderServiveStatioTable();
});