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

// Activar y desactivar un botón
const enableButton = (buttonID) => document.getElementById(`${buttonID}`).disabled = false;
const disableButton = (buttonID) => document.getElementById(`${buttonID}`).disabled = true;

