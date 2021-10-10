// Crear un modal y mostrarlo en la pantalla
const createModal = (id, title, text, buttonText, buttonCallback) => {
    const modalContainer = document.getElementById('modalContainer');

    modalContainer.innerHTML = `
    <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}Label" aria-hidden="true"> <div class="modal-dialog">
        <div class="modal-dialog">    
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="${id}Label">${title}</h5>
                </div>
                <div class="modal-body">
                    ${text}
                </div>
                <div class="modal-footer">
                    <button id="${id}Button" type="button" class="btn btn-primary" data-bs-dismiss="modal">${buttonText}</button>
                </div>
            </div>
        </div>
    </div>`;
    
    document.getElementById(`${id}Button`).onclick = buttonCallback;
    $(`#${id}`).modal("show");
};

const createErrorModal = (id, errorMessage) => createModal(id, "¡Alerta!", errorMessage, "Cerrar", () => $(`#${id}`).modal("hide"));
const createSuccessModal = (id, successMessage) => createModal(id, "¡Felicidades!", successMessage, "Cerrar", $(`#${id}`).modal("hide"));

// Boton de crear cuenta
const createAccount = () => {
    const name = getValueByID("createAccountNameID");
    const surname = getValueByID("createAccountSurnameID");
    const dni = getValueByID("createAccountDNI-ID");
    const email = getValueByID("createAccountEmailID");
    const password = getValueByID("createAccountPasswordID");

    // Si las validaciones salen tal como lo planeado, se hace el request
    if (fullUserValidation(name, surname, dni, email, password)) {
        const newUser = {
            name: name,
            surname: surname,
            dni: parseInt(dni),
            email: email,
            password: password 
        };
    
        // Me muestra un modal al volver
        ajax("POST", "/createAccount", newUser, (res) => {
            res = JSON.parse(res);
            switch(res.success) {
                case "successful":
                    createModal("createAccountModal",
                                "¡Felicidades!",
                                "Su usuario fue creado satisfactoriamente.",
                                "Volver al Inicio",
                                () => $("#returnLoginForm").submit());
                    break;
                case "alreadyExisting":
                    createErrorModal("alreadyExistingAccountModal", "Ya existe una cuenta con este email. Por favor, intente crearla con otro email, o acceda a la cuenta ya creada.");
                    break;
                case "error":
                    createErrorModal("errorCreateAccountModal", "Hubo un error en la creación de su usuario. Intentelo nuevamente más tarde.");
                    break;
            }
        });
    }
}

// Actualizar lista de cines
const updateCinemasList = () => {
    const selectCinemasList = document.getElementById("adminChangesCinemasListID");
    ajax("GET", "/updateCinemasList", null, (res) => {
        if (res) {
            res = JSON.parse(res);
            selectCinemasList.innerHTML = "";
            res.cinemasList.forEach(cinema => selectCinemasList.innerHTML += `<option>(${cinema.ID_Cinema}) ${cinema.cinema_name} - ${cinema.address} - ${cinema.city}</option>`);
        } else {
            createErrorModal("errorUpdateCinemasListModal", "Hubo un error al intentar actualizar la lista de cines.");
        }
    });
}

// Agregar un nuevo cine
const addNewCinema = () => {
    const newCinema = {
        name: getValueByID("adminChangesCinemasNameID"),
        address: getValueByID("adminChangesCinemasAddressID"),
        city: getValueByID("adminChangesCinemasCityID"),
        dim1: getValueByID("adminChangesCinemasHorizontalDimensionID"),
        dim2: getValueByID("adminChangesCinemasVerticalDimensionID")
    };

    ajax("POST", "/addNewCinema", newCinema, (res) => {
        res = JSON.parse(res);
        switch(res.success) {
            case "successful":
                updateCinemasList();
                createSuccessModal("addNewCinemaModal", "El cine fue creado satisfactoriamente.");
                break;
            case "error":
                createErrorModal("errorAddNewCinemaModal", "Hubo un error al intentar añadir el cine. Inténtelo nuevamente más tarde.");
                break;
        }
    })
}

// Borrar un cine
const deleteCinema = () => {
    const cinemaToDelete = {
        ID_Cinema: obtainNumberOfID("adminChangesCinemasListID")
    }
    ajax("DELETE", "/deleteCinema", cinemaToDelete, (res) => {
        res = JSON.parse(res);
        switch(res.success) {
            case "successful":
                updateCinemasList();
                createSuccessModal("deleteCinemaModal", "El cine fue eliminado satisfactoriamente.");
                break;
            case "error":
                createErrorModal("errordeleteCinemaModal", "Hubo un error al intentar eliminar el cine. Inténtelo nuevamente más tarde.");
                break;
        }
    });
}




// Actualizar lista de películas
const updateMoviesList = () => {
    const selectMoviesList = document.getElementById("adminChangesMoviesListID");
    ajax("GET", "/updateMoviesList", null, (res) => {
        if (res) {
            res = JSON.parse(res);
            selectMoviesList.innerHTML = "";
            res.moviesList.forEach(movie => selectMoviesList.innerHTML += `<option>(${movie.ID_Movie}) ${movie.movie_name} - ${movie.director}</option>`);
        } else {
            createErrorModal("errorUpdateMoviesListModal", "Hubo un error al intentar actualizar la lista de películas.");
        }
    });
}

// Agregar una nueva película
const addNewMovie = () => {
    const newMovie = {
        name: getValueByID("adminChangesMoviesNameID"),
        duration: getValueByID("adminChangesMoviesDurationID"),
        director: getValueByID("adminChangesMoviesDirectorID"),
        language: getValueByID("adminChangesMoviesLanguageID")
    };

    ajax("POST", "/addNewMovie", newMovie, (res) => {
        res = JSON.parse(res);
        switch(res.success) {
            case "successful":
                updateMoviesList();
                createSuccessModal("addNewMovieModal", "La película fue creada satisfactoriamente.");
                break;
            case "error":
                createErrorModal("errorAddNewMovieModal", "Hubo un error al intentar añadir la película. Inténtelo nuevamente más tarde.");
                break;
        }
    })
}

// Borrar una película
const deleteMovie = () => {
    const movieToDelete = {
        ID_Movie: obtainNumberOfID("adminChangesMoviesListID")
    }
    ajax("DELETE", "/deleteMovie", movieToDelete, (res) => {
        res = JSON.parse(res);
        switch(res.success) {
            case "successful":
                updateMoviesList();
                createSuccessModal("deleteMovieModal", "La película fue eliminada satisfactoriamente.");
                break;
            case "error":
                createErrorModal("errordeleteMovieModal", "Hubo un error al intentar eliminar la película. Inténtelo nuevamente más tarde.");
                break;
        }
    });
}
