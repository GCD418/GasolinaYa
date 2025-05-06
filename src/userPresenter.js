import ModGasolineras from "./ModGasolineras.js";

const modGasolineras = new ModGasolineras();

async function initializeApp() {
    await modGasolineras.ready();
    
    renderServiceStatioTable();
    AddToQueueButton();
}


function renderServiceStatioTable() {
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

function AddToQueueButton() {
    const addToQueueButton = document.querySelector("#add_queue_button"); 
    addToQueueButton.addEventListener("click", showGasolineraSelector);
}

function showGasolineraSelector() {
    let modal = document.querySelector("#gasolinera-selection-modal");
    
    modal = document.createElement("div");
    modal.id = "gasolinera-selection-modal";
    modal.className = "modal";
        
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
        
    modalContent.innerHTML = `
        <h2>Seleccionar Gasolinera</h2>
        <select id="gasolinera-selector">
        <option value="">-- Seleccione una gasolinera --</option>
        ${getGasolinerasOptions()}
        </select>
        <div class="modal-buttons">
        <button id="cancel-selection">Cancelar</button>
        <button id="confirm-selection" class="confirm-btn">Confirmar</button>
        </div>
    `;
        
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const cancelButton = document.getElementById("cancel-selection");
    cancelButton.addEventListener("click", function() {
        closeModal(modal);
    });

    const confirmButton = document.getElementById("confirm-selection");
    confirmButton.addEventListener("click", function() {
    const selectedGasolinera = document.getElementById("gasolinera-selector").value;
    if (selectedGasolinera) {
        addGasolineraToQueue(selectedGasolinera);
        closeModal(modal);
    } else {
        alert("Por favor, seleccione una gasolinera.");
    }});
  
    modal.style.display = "block";
}
  
function getGasolinerasOptions() {
    const gasolineras = Array.from(modGasolineras.getGasolineras().values());
    return gasolineras.map(gasolinera => {
      return `<option value="${gasolinera.getName()}">${gasolinera.getName()}</option>`;
    }).join("");
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("Error");
    }
}

function addGasolineraToQueue(gasolineraName) {
    alert(`La gasolinera ${gasolineraName} se ha agregado a la cola.`);
}


document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
    const addToQueueButton = document.querySelector("#add_queue_button");
    addToQueueButton.addEventListener("click", () => {
        });
});