import { calculate_waiting_time, can_abandon_queue } from "./user_queue.js";

export function setupQueueFunctionality(modGasolineras) {
    const addToQueueButton = document.querySelector("#add_queue_button");
    if (!addToQueueButton) return;
    
    addToQueueButton.addEventListener("click", () => {
        showGasolineraSelector(modGasolineras);
    });

    const abandonQueueButton = document.querySelector("#queue_button1");
    if (abandonQueueButton) {
        abandonQueueButton.addEventListener("click", () => {
            handleAbandonQueue(modGasolineras);
        });
    }
}

function showGasolineraSelector(modGasolineras) {
    let existingModal = document.querySelector("#gasolinera-selection-modal");
    if (existingModal) {
        existingModal.style.display = "block";
        return;
    }
    
    const modal = createModal(modGasolineras);

    const cancelButton = modal.querySelector("#cancel-selection");
    cancelButton.addEventListener("click", () => closeModal(modal));

    const confirmButton = modal.querySelector("#confirm-selection");
    confirmButton.addEventListener("click", () => confirmGasolineraSelection(modGasolineras));   
}


function getGasolinerasOptions(modGasolineras) {
    const gasolineras = Array.from(modGasolineras.getGasolineras().values());
    return gasolineras.map(gasolinera => {
        return `<option value="${gasolinera.getName()}">${gasolinera.getName()}</option>`;
    }).join("");
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


function closeModal(modal) {
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("Error: No se pudo cerrar el modal");
    }
}

function confirmGasolineraSelection(modGasolineras) {
    const selectedGasolinera = document.querySelector("#gasolinera-selector").value;
    if (selectedGasolinera) {
        addGasolineraQueue(selectedGasolinera, modGasolineras);
    } else {
        alert("Por favor, seleccione una gasolinera.");
    }
}


async function addGasolineraQueue(gasolineraName, modGasolineras) {
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

function handleAbandonQueue(modGasolineras) {
    const isInQueue = modGasolineras.isUserInQueue();
    const isSelectorVisible = document.querySelector("#gasolinera-selection-modal")?.style.display === "block";

    if (!can_abandon_queue({ isInQueue, isSelectorVisible })) {
        alert("No puedes abandonar la fila ahora. Verifica que estás en una fila y que el selector no esté abierto.");
        return;
    }

    showConfirmAbandonModal(modGasolineras);
}

function showConfirmAbandonModal(modGasolineras) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <p>¿Estás seguro que deseas abandonar la fila?</p>
            <div class="modal-buttons">
                <button id="cancel-abandon">Cancelar</button>
                <button id="confirm-abandon">Sí, abandonar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("cancel-abandon").onclick = () => modal.remove();

    document.getElementById("confirm-abandon").onclick = async () => {
        const userGasolinera = modGasolineras.getUserGasolinera();
        if (!userGasolinera) {
            alert("No estás registrado en ninguna fila.");
            modal.remove();
            return;
        }

        await modGasolineras.unregisterUserFromQueue();
        modal.remove();
        alert(`Has abandonado la fila de ${userGasolinera}.`);
    };
}