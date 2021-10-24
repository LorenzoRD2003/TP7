// Para ahorrar en escritura
const getValueByID = (elemID) => $(`#${elemID}`).val();
const getSelectedOption = (selectElemID) => {
    const selectElem = document.getElementById(selectElemID);
    const selectedIndex = selectElem.selectedIndex;
    return selectElem[selectedIndex];
}
const getDatasetOfOption = (selectElemID) => getSelectedOption(selectElemID).dataset;

/**
 * Devuelve si una string tiene longitud entre dos numeros (incluidos)
 * @param {String} str La string
 * @param {Integer} a El valor minimo
 * @param {Integer} b El valor maximo
 * @returns {Boolean} true o false
 */
const between = (str, a, b) => str.length >= a && str.length <= b;

/**
 * Devuelve si una string esta en otra en forma booleana
 * @param {String} str String sobre la que buscar
 * @param {String} substr String a buscar
 * @returns true o false
 */
const isInStr = (str, substr) => str.search(substr) != -1;

// Funciones de validación de usuario
const validateUserName = (name) => name != "";
const validateUserSurname = (surname) => surname != "";
const validateUserDNI = (dni) => between(dni, 7, 8);
const validateUserEmail = (email) => isInStr(email, "@") && isInStr(email, ".");
const validateUserPassword = (password) => between(password, 8, 50);
const fullUserValidation = (name, surname, dni, email, password) => {
    if (!validateUserName(name)) {
        alert('El campo "Nombre" no puede estar vacío.');
        return false;
    }
    if (!validateUserSurname(surname)) {
        alert('El campo "Apellido" no puede estar vacío.');
        return false;
    }
    if (!validateUserDNI(dni)) {
        alert('El DNI debe ser un número de más de 6 y menos de 9 cifras.');
        return false;
    }
    if (!validateUserEmail(email)) {
        alert('El email debe tener una @ (arroba) y un . (punto).');
        return false;
    }
    if (!validateUserPassword(password)) {
        alert('La contraseña debe tener al menos 8 caracteres y como mucho 50.');
        return false;
    }
    return true;
};

/**
 * Crea un modal y lo muestra por pantalla
 * @param {Number} id Id del modal
 * @param {String} title Titulo del modal
 * @param {String} text Texto del modal
 * @param {String} buttonText Texto del botón del modal
 * @param {Function} buttonCallback Función que se ejecuta al tocar el botón
 * @param {String} secondButtonText Opcional. Texto del segundo botón del modal
 * @param {Function} secondButtonCallback Opcional. Función que se ejecuta al tocar el segundo botón
 */
 const createModal = (id, title, text, buttonText, buttonCallback, secondButtonText = undefined, secondButtonCallback = undefined) => {
    const modalContainer = document.getElementById('modalContainer');

    modalContainer.innerHTML = `
    <div class="modal fade" id="${id}" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog">    
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="${id}Label">${title}</h5>
                </div>
                <div class="modal-body">
                    ${text}
                </div>
                <div id="${id}Footer" class="modal-footer">
                    <button id="${id}Button" type="button" class="btn btn-primary" data-bs-dismiss="modal">${buttonText}</button>
                </div>
            </div>
        </div>
    </div>`;

    document.getElementById(`${id}Button`).onclick = buttonCallback;
    if (secondButtonText) {
        document.getElementById(`${id}Footer`).innerHTML += `
        <button id="${id}Button2" type="button" class="btn btn-danger" data-bs-dismiss="modal">${secondButtonText}</button>`;
        document.getElementById(`${id}Button`).onclick = buttonCallback;
        document.getElementById(`${id}Button2`).onclick = secondButtonCallback;
    }

    $(`#${id}`).modal({ backdrop: 'static', keyboard: false });
    $(`#${id}`).modal("show");
};

const createErrorModal = (id, errorMessage) => createModal(id, "¡Alerta!", errorMessage, "Cerrar", () => $(`#${id}`).modal("hide"));
const createSuccessModal = (id, successMessage) => createModal(id, "¡Felicidades!", successMessage, "Cerrar", $(`#${id}`).modal("hide"));

// Activar y desactivar un botón
const enableButton = (buttonID) => document.getElementById(`${buttonID}`).disabled = false;
const disableButton = (buttonID) => document.getElementById(`${buttonID}`).disabled = true;

// Obtener datos de la tabla de reservas del usuario
const getTableRow = (elem) => elem.parentNode.parentNode.parentNode;
const getTableRowFromDropdown = (elem) => elem.parentNode.parentNode.parentNode.parentNode.parentNode;
const getIDBookingFromTableRow = (tableRow) => {
    return parseInt(tableRow.childNodes[1].textContent);
}
const changeTableWhenPayingBooking = (originalTableRow, targetTableID) => {
    const paidBookingsTable = document.getElementById(targetTableID);
    const newRow = paidBookingsTable.insertRow();
    newRow.className = "text-center";
    newRow.innerHTML = originalTableRow.innerHTML;
    paidBookingsTable.childNodes[1].childNodes[13].remove();
    originalTableRow.remove();
}
