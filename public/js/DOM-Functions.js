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
            switch (res.success) {
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
            cinemasList.innerHTML = "<option disabled selected>Seleccione un cine</option>";
            res.cinemasList.forEach(cinema => {
                let option = document.createElement("option");
                option.text = `${cinema.cinema_name} - ${cinema.address} - ${cinema.city}`;
                option.setAttribute("data-cinema-id", cinema.ID_Cinema);
                cinemasList.appendChild(option);
            });
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
            moviesList.innerHTML = "<option disabled selected>Seleccione una película</option>";
            res.moviesList.forEach(movie => {
                let option = document.createElement("option");
                option.text = `${movie.movie_name} - ${movie.director}`;
                option.setAttribute('data-movie-id', movie.ID_Movie);
                moviesList.appendChild(option);
            });
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
            choicesList.innerHTML = "<option disabled selected>Seleccione una opción de reserva</option>";
            res.choicesList.forEach(choice => {
                let option = document.createElement("option");
                option.text = `${choice.cinema_name} - ${choice.movie_name} - ${choice.movie_schedule}`;
                option.setAttribute('data-choice-id', choice.ID_Choice);
                choicesList.appendChild(option);
            });
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
        switch (res.success) {
            case "successful":
                createSuccessModal("addNewCinemaModal", "El cine fue creado satisfactoriamente.");
                break;
            case "error":
                createErrorModal("errorAddNewCinemaModal", "Hubo un error al intentar añadir el cine. Inténtelo nuevamente más tarde.");
                break;
        }
    })
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
        switch (res.success) {
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
        ID_Movie: getDatasetOfOption("adminChangesMoviesListID").movieId
    }

    ajax("DELETE", "/deleteMovie", movieToDelete, (res) => {
        res = JSON.parse(res);
        switch (res.success) {
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
        ID_Cinema: getDatasetOfOption("adminChangesChoicesCinemasListID").cinemaId,
        ID_Movie: getDatasetOfOption("adminChangesChoicesMoviesListID").movieId,
        movie_schedule: getValueByID("adminChangesChoicesScheduleID")
    };

    ajax("POST", "/addNewChoice", newChoice, (res) => {
        res = JSON.parse(res);
        switch (res.success) {
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
        ID_Choice: getDatasetOfOption("adminChangesChoicesListID").choiceId
    }

    ajax("DELETE", "/deleteChoice", choiceToDelete, (res) => {
        res = JSON.parse(res);
        switch (res.success) {
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

// Actualizar lista de peliculas por cine en la pantalla de selección
const getMoviesForThisCinema = () => {
    const cinemaChosen = {
        ID_Cinema: getDatasetOfOption("selectCinemaAndMovieCinemasListID").cinemaId
    }

    const moviesList = document.getElementById("selectCinemaAndMovieMoviesListID");
    moviesList.innerHTML = "<option disabled selected>Seleccione una película</option>";
    moviesList.disabled = true;

    const schedulesList = document.getElementById("selectCinemaAndMovieScheduleID");
    schedulesList.innerHTML = "<option disabled selected>Seleccione un horario</option>";
    schedulesList.disabled = true;
    disableButton("selectCinemaAndMovieContinueButtonID");

    ajax("GET", "/getMoviesForThisCinema", cinemaChosen, (res) => {
        if (res) {
            res = JSON.parse(res);
            if (res.moviesList.length) {
                res.moviesList.forEach(movie => {
                    let option = document.createElement("option");
                    option.text = `${movie.movie_name} - ${movie.director} - ${movie.movie_language} - ${movie.duration} minutos`;
                    option.setAttribute('data-movie-id', movie.ID_Movie);
                    moviesList.appendChild(option);
                });
                moviesList.disabled = false;
            } else {
                createErrorModal("errorUpdateCinemaAndMovieCinemasListModal", "No hay películas en este cine.");
            }
        } else {
            createErrorModal("errorUpdateCinemaAndMovieCinemasListModal", "Hubo un error al intentar actualizar la lista de películas de este cine. Inténtelo nuevamente más tarde.");
        }
    });
}

// Actualizar lista de horarios en la pantalla de selección
const getSchedule = () => {
    const object = {
        ID_Cinema: getDatasetOfOption("selectCinemaAndMovieCinemasListID").cinemaId,
        ID_Movie: getDatasetOfOption("selectCinemaAndMovieMoviesListID").movieId
    }

    const schedulesList = document.getElementById("selectCinemaAndMovieScheduleID");
    schedulesList.innerHTML = "<option disabled selected>Seleccione un horario</option>";
    schedulesList.disabled = true;
    disableButton("selectCinemaAndMovieContinueButtonID");

    ajax("GET", "/getSchedule", object, (res) => {
        if (res) {
            res = JSON.parse(res);
            if (res.schedulesList.length) {
                res.schedulesList.forEach(schedule => schedulesList.innerHTML += `<option>${schedule.movie_schedule}</option>`);
                schedulesList.disabled = false;
            } else {
                createErrorModal("errorUpdateCinemaAndMovieSchedulesListModal", "No hay películas en este cine.");
            }
        } else {
            createErrorModal("errorUpdateCinemaAndMovieSchedulesListModal", "Hubo un error al intentar actualizar la lista de horarios de esa película. Inténtelo nuevamente más tarde.");
        }
    });
}

// Continuar a la pantalla de selección de asientos
const continueToSelectSeat = () => {
    const selectedMovieOption = getSelectedOption("selectCinemaAndMovieMoviesListID");
    selectedMovieOption.value = getDatasetOfOption("selectCinemaAndMovieMoviesListID").movieId;
    document.getElementById("continueToSelectSeatFormID").submit();
}

// Clicks de asientos
let chosen_seats;
const MAX_SEATS = 6;
const startEventSeats = () => {
    chosen_seats = 0;
    const allSeats = document.getElementsByClassName("btn-seat");
    for (let seat of allSeats) {
        seat.setAttribute("data-row-number", seat.parentNode.dataset.rowNumber);
        seat.addEventListener("click", () => {
            switch (seat.textContent) {
                case "E":
                    if (chosen_seats < MAX_SEATS) {
                        seat.classList.remove("btn-success");
                        seat.classList.add("btn-primary");
                        seat.textContent = "S";
                        chosen_seats++;
                    } else {
                        createErrorModal("errorTooManySelectedSeatsModal", "Puede elegir un máximo de seis asientos.");
                    }
                    break;
                case "S":
                    seat.classList.remove("btn-primary");
                    seat.classList.add("btn-success");
                    seat.textContent = "E";
                    chosen_seats--;
                    break;
                case "NE":
                    createErrorModal("errorAlreadySelectedModal", "Este asiento ya fue elegido por alguien con anterioridad. Por favor, elija otro.");
            }
            const continueButton = document.getElementById("assignSeatsButtonID");
            (chosen_seats == 0) ? continueButton.disabled = true : continueButton.disabled = false;
        });
    }

    // Si el usuario está modificando, actualizo los asientos que ya están seleccionados
    if (document.getElementById("isModifyingID")) {
        ajax("GET", "/getOldSeats", null, (res) => {
            res = JSON.parse(res);
            res.oldSeats.forEach(selectedSeat => {
                for (let seat of allSeats) {
                    if (selectedSeat.row == seat.dataset.rowNumber && selectedSeat.column == seat.dataset.columnNumber) {
                        seat.classList.remove("btn-danger");
                        seat.classList.add("btn-primary");
                        seat.textContent = "S";
                        chosen_seats++;
                        break;
                    }
                }
            });
        });
    }
}

// Continuar luego de elegir los asientos
const assignSeats = () => {
    const selectedSeats = document.getElementsByClassName("btn-primary btn-seat");
    let seatsIndexArray = [];
    for (let seat of selectedSeats) {
        seatsIndexArray.push({ "row": seat.dataset.rowNumber, "column": seat.dataset.columnNumber })
    }
    ajax("POST", "/assignSeats", seatsIndexArray, (res) => {
        res = JSON.parse(res);
        switch (res.success) {
            case "successful":
                createModal("assignSeatsModal",
                    "¡Felicidades!",
                    "Los asientos fueron asignados a su reserva satisfactoriamente.",
                    "Continuar",
                    () => $("#continueToBookingConfirmationFormID").submit()
                );
                break;
            case "error":
                createErrorModal("errorAssignSeatstModal", "Hubo un error en la creación de su usuario. Intentelo nuevamente más tarde.");
                break;
        }
    });
}

// Aparece el modal respecto de si reservar o pagar
const bookOrPayF = () => {
    const bool = document.getElementById("radioButtonBookID").checked;
    const modalText = (bool) ? "realizar una reserva" : "pagar en este momento";
    createModal(
        "confirmBookingModalID",
        "¡Advertencia!",
        `¿Está seguro de que quiere ${modalText}?`,
        "Confirmar", () => $("#confirmBookingFormID").submit(),
        "Cancelar", () => $(`#confirmBookingModalID`).modal("hide")
    );
}

// Borrar una reserva
const deleteThisBooking = (elem) => {
    const object = { ID_Booking: getIDBookingFromTableRow(getTableRow(elem)) }
    ajax("DELETE", "/deleteBooking", object, (res) => {
        res = JSON.parse(res);
        switch (res.success) {
            case "successful":
                createSuccessModal("deleteBookingModal", "La reserva fue eliminada satisfactoriamente.");
                getTableRow(elem).remove();
                break;
            case "error":
                createErrorModal("errorDeleteBookingModal", "Hubo un error al intentar eliminar la reserva. Inténtelo nuevamente más tarde.");
                break;
        }
    });
}

// Pagar una reserva
const payThisBooking = (elem) => {
    const object = { ID_Booking: getIDBookingFromTableRow(getTableRow(elem)) }
    ajax("PUT", "/payBooking", object, (res) => {
        res = JSON.parse(res);
        switch (res.success) {
            case "successful":
                createSuccessModal("payBookingModal", "La reserva fue pagada satisfactoriamente.");
                changeTableWhenPayingBooking(getTableRow(elem), "paidBookingsTable");
                break;
            case "error":
                createErrorModal("errorPayBookingModal", "Hubo un error al intentar pagar la reserva. Inténtelo nuevamente más tarde.");
                break;
        }
    });
}

// Modificar el cine
const modifications = (elem, option) => {
    const object = {
        ID_Booking: getIDBookingFromTableRow(getTableRowFromDropdown(elem)),
        modifications: option
    }
    ajax("PUT", "/modifications", object, (res) => {
        res = JSON.parse(res);
        switch (res.success) {
            case "successful":
                createModal(
                    "modifyBookingModal",
                    "¡Advertencia!",
                    "¿Está seguro de que quiere realizar esta modificación?",
                    "Confirmar", () => $("#modifyBookingForm").submit(),
                    "Cancelar", () => $(`#modifyBookingModal`).modal("hide")
                );
                break;
            case "error":
                createErrorModal("errorModifyBookingModal", "Hubo un error al intentar modificar la reserva. Inténtelo nuevamente más tarde.");
                break;
        }
    });
}

