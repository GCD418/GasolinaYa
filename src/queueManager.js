import { calculate_waiting_time } from "./user_queue.js";

export function setupQueueFunctionality(modGasolineras, modUsuarios) {
    const addToQueueButton = document.querySelector("#add_queue_button");
    if (!addToQueueButton) return;
    
    addToQueueButton.addEventListener("click", () => {
        showQueuePopup(modUsuarios, modGasolineras);
    }); 
}

function showQueuePopup(modUsuarios, modGasolineras) {
    let existingPopup = document.querySelector("#queue-popup");
    if (existingPopup) {
            existingPopup.remove();
    }

    const popup = createPopup(modUsuarios, modGasolineras);
    const cancelButton = popup.querySelector("#cancel-popup");
    cancelButton.addEventListener("click", () => {
        closePopup();
    });
   
    const confirmPlacaButton = popup.querySelector("#confirm-placa");
    confirmPlacaButton.addEventListener("click", () => {
        confirmPlacaSelection(popup, modUsuarios, modGasolineras);
    });
    
    const confirmQueueButton = popup.querySelector("#confirm-queue");
    confirmQueueButton.addEventListener("click", () => {
        confirmGasolineraSelection(popup, modUsuarios, modGasolineras);
    });
}

function getUsuariosOptions(modUsuarios) {
    const usuarios = Array.from(modUsuarios.getUsuarios().values());
    return usuarios.map(usuario => {
        return `<option value="${usuario.getPlaca()}">${usuario.getPlaca()}</option>`;
    }).join("");
}

function getGasolinerasOptions(modGasolineras) {
    const gasolineras = Array.from(modGasolineras.getGasolineras().values());
    return gasolineras.map(gasolinera => {
        return `<option value="${gasolinera.getName()}">${gasolinera.getName()}</option>`;
    }).join("");
}

function confirmPlacaSelection(popup, modUsuarios, modGasolineras) {
    const selectedPlaca = popup.querySelector("#usuario-selector").value;
    if (!selectedPlaca) {
        alert("Por favor, seleccione una placa.");
        return;
    }
    
    const usuario = modUsuarios.getUsuario(selectedPlaca);
    if (usuario.getEnFila() !== null) {
        alert(`El usuario ${selectedPlaca} ya está en la cola de ${usuario.getEnFila()}`);
        return;
    }

    popup.querySelector("#gasolinera-selection").style.display = "block";
    popup.querySelector("#confirm-placa").style.display = "none";
    popup.querySelector("#confirm-queue").style.display = "block";
}

async function confirmGasolineraSelection(popup, modUsuarios, modGasolineras) {
    const selectedPlaca = popup.querySelector("#usuario-selector").value;
    const selectedGasolinera = popup.querySelector("#gasolinera-selector").value;
    
    if (!selectedGasolinera) {
        alert("Por favor, seleccione una gasolinera.");
        return;
    }
    
    try {
        await addUsuarioToGasolineraQueue(selectedPlaca, selectedGasolinera, modUsuarios, modGasolineras);
        
        closePopup(popup);
        
        const updateEvent = new CustomEvent('tableUpdateRequired', {
            detail: { 
                type: 'queueUpdate',
                placa: selectedPlaca,
                gasolinera: selectedGasolinera
            }
        });
        document.dispatchEvent(updateEvent);

        const container = document.querySelector("#service_stations_container");
        if (container) {
            const event = new CustomEvent('updateGasolineraTable');
            document.dispatchEvent(event);
        }

        updatePlacaLabel(selectedPlaca);

    } catch (error) {
        console.error(`Error al agregar a la cola: ${error}`);
        alert(`Ocurrió un error al registrarse en la cola: ${error.message}`);
    }
}

async function addUsuarioToGasolineraQueue(placa, gasolineraName, modUsuarios, modGasolineras) {
    const usuario = modUsuarios.getUsuario(placa);
    const gasolinera = modGasolineras.getGasolinera(gasolineraName);
    
    if (!usuario) {
        throw new Error(`Usuario ${placa} no encontrado`);
    }
    
    if (!gasolinera) {
        throw new Error(`Gasolinera ${gasolineraName} no encontrada`);
    }

    const queueBefore = gasolinera.getQueueCount();
    await modGasolineras.incrementQueueCount(gasolineraName);
    const aheadOf = queueBefore;

    usuario.setEnFila(gasolineraName);
    await modUsuarios.updateUsuario(placa, gasolineraName, null);
    
    let waiting_time = calculate_waiting_time(aheadOf, gasolinera.getHosesNumber());

    alert(`Te has registrado exitosamente en la cola de ${gasolineraName}. Hay ${aheadOf} persona(s) delante de ti. El tiempo de espera aproximado es ${waiting_time} minutos.`);
    
    return { success: true };
}

function createPopup(modUsuarios, modGasolineras) {

    const overlay = document.createElement("div");
    overlay.id = "popup_overlay";
    overlay.className = "popup-overlay";


    const popup = document.createElement("div");
    popup.id = "queue-popup";
    popup.className = "popup";
    createPopupContent(popup, modUsuarios, modGasolineras);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    return popup;
}

function createPopupContent(popup, modUsuarios, modGasolineras) {
    popup.innerHTML = `
        <h2>Seleccionar Placa de vehículo</h2>
        <select id="usuario-selector">
            <option value="">-- Seleccione una placa --</option>
            ${getUsuariosOptions(modUsuarios)}
        </select>
        <div id="gasolinera-selection" style="display: none;">
            <h2>Seleccionar Gasolinera</h2>
            <select id="gasolinera-selector">
                <option value="">-- Seleccione una gasolinera --</option>
                ${getGasolinerasOptions(modGasolineras)}
            </select>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 15px;">
            <button id="cancel-popup">Cancelar</button>
            <button id="confirm-placa" class="confirm-btn">Continuar</button>
            <button id="confirm-queue" class="confirm-btn" style="display: none;">Confirmar</button>
        </div>`;
   return popup;
}

function closePopup() {
  const overlay = document.getElementById("popup_overlay");
  if (overlay) overlay.remove();
}


function updatePlacaLabel(placa) {
    const buttonContainer = document.querySelector(".queue-button-container");
    if (!buttonContainer) return;
    
    const existingLabel = buttonContainer.querySelector(".placa-label");
    if (existingLabel) {
        existingLabel.remove();
    }

    const placaLabel = document.createElement("div");
    placaLabel.className = "placa-label";
    placaLabel.innerHTML = `<span class="placa-text">${placa} en fila</span>`;
    
    buttonContainer.appendChild(placaLabel);
}
