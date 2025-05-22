import { calculate_waiting_time } from "./user_queue.js";


/*
export function setupQueueFunctionality(modGasolineras, modUsuarios) {
    const addToQueueButton = document.querySelector("#add_queue_button");
    if (!addToQueueButton) return;
    
    addToQueueButton.addEventListener("click", () => {
        showUsuarioSelector(modUsuarios, modGasolineras);
        //showGasolineraSelector(modGasolineras);
    });
}


function showUsuarioSelector(modUsuarios, modGasolineras) {
    let existingModal = document.querySelector("#usuario-selection-modal");
    if (existingModal) {
        existingModal.style.display = "block";
        return;
    }

    const modal = createUsuarioModal(modUsuarios, modGasolineras);

    const confirmButton = modal.querySelector("#confirm-selection");
    confirmButton.addEventListener("click", () => confirmUsuarioSelection(modUsuarios, modGasolineras)); 

    const cancelButton = modal.querySelector("#cancel-selection");
    cancelButton.addEventListener("click", () => closeModal(modal));
}

function createUsuarioModal(modUsuarios, modGasolineras) {
    let modal = document.createElement("div");
    modal.id = "usuario-selection-modal";
    modal.className = "modal";
    const modalContent = createUsuarioModalContent(modUsuarios, modGasolineras);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    modal.style.display = "block";
    return modal;
}

function createUsuarioModalContent(modUsuarios, modGasolineras) {
    console.log("Usuarios disponibles:", modUsuarios.getUsuarios().size);
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.innerHTML = `
        <h2>Seleccionar Placa de vehiculo</h2>
        <select id="usuario-selector">
            <option value="">-- Seleccione una placa --</option>
            ${getUsuariosOptions(modUsuarios, modGasolineras)}
        </select>
        <div class="modal-buttons">
            <button id="cancel-selection">Cancelar</button>
            <button id="confirm-selection" class="confirm-btn">Confirmar</button>
        </div>
    `;
    return modalContent;
}

function getUsuariosOptions(modUsuarios, modGasolineras) {
    const usuarios = Array.from(modUsuarios.getUsuarios().values());
    return usuarios.map(usuario => {
        return `<option value="${usuario.getPlaca()}">${usuario.getPlaca()}</option>`;
    }).join("");
}

function confirmUsuarioSelection(modUsuarios, modGasolineras) {
    const selectedUsuario = document.querySelector("#usuario-selector").value;
    if (!selectedUsuario) {
        alert("Por favor, seleccione una placa.");
        return;
    }
            
    const usuario = modUsuarios.getUsuario(selectedUsuario);
    if (!usuario) {     
        alert(`Error: Usuario ${selectedUsuario} no encontrado`);
        return;
    }
       
    if (usuario.getEnFila() !== null) {
        alert(`El usuario ${selectedUsuario} ya está en la cola de ${usuario.getEnFila()}`);
        return;
    }

    closeModal(document.querySelector("#usuario-selection-modal"));
    showGasolineraSelector(modGasolineras, usuario, modUsuarios);
}





function showGasolineraSelector(modGasolineras, usuarioSelected, modUsuarios) {
    let existingModal = document.querySelector("#gasolinera-selection-modal");
    if (existingModal) {
        existingModal.style.display = "block";
        return;
    }

    const modal = createModal(modGasolineras);

    const cancelButton = modal.querySelector("#cancel-selection");
    cancelButton.addEventListener("click", () => closeModal(modal));

    const confirmButton = modal.querySelector("#confirm-selection");
    confirmButton.addEventListener("click", () => confirmGasolineraSelection(modGasolineras, usuarioSelected, modUsuarios));   
}

function createModal(modGasolineras){
    let modal = document.createElement("div");
    modal.id = "gasolinera-selection-modal";
    modal.className = "modal";
    
    const modalContent = createModalContent(modGasolineras);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    modal.style.display = "block";

    return modal;
}

function createModalContent(modGasolineras) {
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.innerHTML = `
        <h2>Seleccionar Gasolinera</h2>
        <select id="gasolinera-selector">
            <option value="">-- Seleccione una gasolinera --</option>
            ${getGasolinerasOptions(modGasolineras)}
        </select>
        <div class="modal-buttons">
            <button id="cancel-selection">Cancelar</button>
            <button id="confirm-selection" class="confirm-btn">Confirmar</button>
        </div>
    `;
    return modalContent;
}

function getGasolinerasOptions(modGasolineras) {
    const gasolineras = Array.from(modGasolineras.getGasolineras().values());
    return gasolineras.map(gasolinera => {
        return `<option value="${gasolinera.getName()}">${gasolinera.getName()}</option>`;
    }).join("");
}

function confirmGasolineraSelection(modGasolineras, usuarioSelected, modUsuarios) {
    const selectedGasolinera = document.querySelector("#gasolinera-selector").value;
    if (selectedGasolinera) {
        addGasolineraQueue(selectedGasolinera, modGasolineras, usuarioSelected);
        addUsuarioQueueGasolinera(usuarioSelected.getPlaca(), selectedGasolinera, modUsuarios);
        closeModal(document.querySelector("#gasolinera-selection-modal"));
    } else {
        alert("Por favor, seleccione una gasolinera.");
    }
}

async function addUsuarioQueueGasolinera(placa, gasolineraName, modUsuarios) {
    try {
        const usuario = modUsuarios.getUsuario(placa);
        if (!usuario) {
            console.error(`Usuario ${placa} no encontrado`);
            alert(`Error: Usuario ${placa} no encontrado`);
            return;
        }
        console.log("Usuario encontrado:", usuario);
        console.log("Gasolinera seleccionada:", gasolineraName);
        usuario.setEnFila(gasolineraName);
        await modUsuarios.updateUsuario(placa, gasolineraName, null);
    }
    catch (error) {
        console.error(`Error al agregar a la cola: ${error}`);
        alert(`Ocurrió un error al registrarse en la cola: ${error.message}`);
    }
}

async function addGasolineraQueue(gasolineraName, modGasolineras, modUsuarios) {
    try {
        const gasolinera = modGasolineras.getGasolinera(gasolineraName);
        if (!gasolinera) {
            console.error(`Gasolinera ${gasolineraName} no encontrada`);
            alert(`Error: Gasolinera ${gasolineraName} no encontrada`);
            return;
        }
        
        const queueBefore = await gasolinera.getQueueCount();
        await modGasolineras.incrementQueueCount(gasolineraName);
        const aheadOf = queueBefore;
        
        
        let waiting_time = calculate_waiting_time(aheadOf);
        alert(`Te has registrado exitosamente en la cola de ${gasolineraName}. Hay ${aheadOf} persona(s) delante de ti. El tiempo de espera aproximado de espera es ${waiting_time} minutos.`);
    } catch (error) {
        console.error(`Error al agregar a la cola: ${error}`);
        alert(`Ocurrió un error al registrarse en la cola: ${error.message}`);
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("Error: No se pudo cerrar el modal");
    }
}

*/

import { calculate_waiting_time } from "./user_queue.js";

let currentPlaca = null;

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
        closePopup(popup);
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

        currentUserPlaca = selectedPlaca;
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
    
    let waiting_time = calculate_waiting_time(aheadOf);

    alert(`Te has registrado exitosamente en la cola de ${gasolineraName}. Hay ${aheadOf} persona(s) delante de ti. El tiempo de espera aproximado es ${waiting_time} minutos.`);
    
    return { success: true };
}

function createPopup(modUsuarios, modGasolineras) {
    const popup = document.createElement("div");
    popup.id = "queue-popup";
    popup.className = "popup";
    createPopupContent(popup, modUsuarios, modGasolineras);
    document.body.appendChild(popup);
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

function closePopup(popup) {
    if (popup) {
       popup.remove();
    }
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

/*
function clearPlacaLabel() {
    const existingLabel = document.querySelector(".placa-label");
    if (existingLabel) {
        existingLabel.remove();
    }
    currentUserPlaca = null;
}*/
