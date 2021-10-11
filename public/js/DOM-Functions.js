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
const updateCinemasList = (cinemasList) => {
    ajax("GET", "/updateCinemasList", null, (res) => {
        if (res) {
            res = JSON.parse(res);
            cinemasList.innerHTML = "";
            res.cinemasList.forEach(cinema => cinemasList.innerHTML += `<option>(${cinema.ID_Cinema}) ${cinema.cinema_name} - ${cinema.address} - ${cinema.city}</option>`);
        } else {
            createErrorModal("errorUpdateCinemasListModal", "Hubo un error al intentar actualizar la lista de cines.");
        }
    });
}

// Actualizar lista de películas
const updateMoviesList = (moviesList) => {
    ajax("GET", "/updateMoviesList", null, (res) => {
        if (res) {
            res = JSON.parse(res);
            moviesList.innerHTML = "";
            res.moviesList.forEach(movie => moviesList.innerHTML += `<option>(${movie.ID_Movie}) ${movie.movie_name} - ${movie.director}</option>`);
        } else {
            createErrorModal("errorUpdateMoviesListModal", "Hubo un error al intentar actualizar la lista de películas.");
        }
    });
}

// Actualizar lista de opciones
const updateChoicesList = (choicesList) => {
    ajax("GET", "/updateChoicesList", null, (res) => {
        if (res) {
            res = JSON.parse(res);
            choicesList.innerHTML = "";
            res.choicesList.forEach(choice => choicesList.innerHTML += `<option>(${choice.ID_Choice}) ${choice.cinema_name} - ${choice.movie_name}</option>`);
        } else {
            createErrorModal("errorUpdateMoviesListModal", "Hubo un error al intentar actualizar la lista de opciones de reservas.");
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
                const selectCinemasList = document.getElementById("adminChangesCinemasListID");
                updateCinemasList(selectCinemasList);
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
                const selectCinemasList = document.getElementById("adminChangesCinemasListID");
                updateCinemasList(selectCinemasList);
                createSuccessModal("deleteCinemaModal", "El cine fue eliminado satisfactoriamente.");
                break;
            case "error":
                createErrorModal("errordeleteCinemaModal", "Hubo un error al intentar eliminar el cine. Inténtelo nuevamente más tarde.");
                break;
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
                const selectMoviesList = document.getElementById("adminChangesMoviesListID");
                updateMoviesList(selectMoviesList);
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
                const selectMoviesList = document.getElementById("adminChangesMoviesListID");
                updateMoviesList(selectMoviesList);
                createSuccessModal("deleteMovieModal", "La película fue eliminada satisfactoriamente.");
                break;
            case "error":
                createErrorModal("errordeleteMovieModal", "Hubo un error al intentar eliminar la película. Inténtelo nuevamente más tarde.");
                break;
        }
    });
}

// Agregar nueva opción de reserva
const addNewChoice = () => {
    const newChoice = {
        ID_Cinema: obtainNumberOfID("adminChangesChoicesCinemasListID"),
        ID_Movie: obtainNumberOfID("adminChangesChoicesMoviesListID"),
        movie_schedule: getValueByID("adminChangesChoicesScheduleID")
    };

    ajax("POST", "/addNewChoice", newChoice, (res) => {
        res = JSON.parse(res);
        switch(res.success) {
            case "successful":
                const selectChoicesList = document.getElementById("adminChangesChoicesListID");
                createSuccessModal("addNewMovieModal", "La opción de reserva fue creada satisfactoriamente.");
                updateChoicesList(selectChoicesList);
                break;
            case "error":
                createErrorModal("errorAddNewChoiceModal", "Hubo un error al intentar añadir la opción de reserva. Inténtelo nuevamente más tarde.");
                break;
        }
    });
}

// Borrar una opcion de reserva
const deleteChoice = () => {
    const choiceToDelete = {
        ID_Choice: obtainNumberOfID("adminChangesChoicesListID")
    }
    ajax("DELETE", "/deleteChoice", choiceToDelete, (res) => {
        res = JSON.parse(res);
        switch(res.success) {
            case "successful":
                const selectChoicesList = document.getElementById("adminChangesChoicesListID");
                updateChoicesList(selectChoicesList);
                createSuccessModal("deleteChoiceModal", "La opción de reserva fue eliminada satisfactoriamente.");
                break;
            case "error":
                createErrorModal("errordeleteMovieModal", "Hubo un error al intentar opción de reserva. Inténtelo nuevamente más tarde.");
                break;
        }
    });
}
