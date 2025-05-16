import calculate_waiting_time from "./user_queue.js";

export function setupQueueFunctionality(modGasolineras) {
    const addToQueueButton = document.querySelector("#add_queue_button");
    if (!addToQueueButton) return;
    
    addToQueueButton.addEventListener("click", () => {
        showGasolineraSelector(modGasolineras);
    });
}



function showGasolineraSelector(modGasolineras) {
    let existingModal = document.querySelector("#gasolinera-selection-modal");
    if (existingModal) {
        existingModal.style.display = "block";
        return;
    }
    
    const modalContent = `
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
    
    const modal = showModal("gasolinera-selection-modal", modalContent);
    
    const cancelButton = document.getElementById("cancel-selection");
    cancelButton.addEventListener("click", () => closeModal(modal));
    
    const confirmButton = document.getElementById("confirm-selection");
    confirmButton.addEventListener("click", () => {
        const selectedGasolinera = document.getElementById("gasolinera-selector").value;
        if (selectedGasolinera) {
            addGasolineraQueue(selectedGasolinera, modGasolineras);
            closeModal(modal);
        } else {
            alert("Por favor, seleccione una gasolinera.");
        }
    });
}


function getGasolinerasOptions(modGasolineras) {
    const gasolineras = Array.from(modGasolineras.getGasolineras().values());
    return gasolineras.map(gasolinera => {
        return `<option value="${gasolinera.getName()}">${gasolinera.getName()}</option>`;
    }).join("");
}


function showModal(id, content) {
    let modal = document.createElement("div");
    modal.id = id;
    modal.className = "modal";
    
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.innerHTML = content;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    modal.style.display = "block";
    
    return modal;
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("Error: No se pudo cerrar el modal");
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