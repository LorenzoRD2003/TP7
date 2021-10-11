const MySQL = require('./mysql');

const selectAll = async (table) => await MySQL.realizarQuery(`select * from ${table}`);
exports.selectAll = selectAll;

exports.userAlreadyInDatabase = async (newEmail) => {
    const emailsList = await MySQL.realizarQuery("select Users.email from Users");
    for (let object of emailsList) {
        if (newEmail == object.email) {
            return true;
        }
    }
    return false;
}

exports.insertUser = async (name, surname, dni, email, password) => {
    await MySQL.realizarQuery(`
        insert into Users(real_name, surname, dni, email, acc_password) values
        ('${name}', '${surname}', ${dni}, '${email}', '${password}')
    `);
}

exports.loginIntoSystem = async (email, password) => {
    const userList = await selectAll("Users");
    for (let user of userList) {
        if (email == user.email) {
            // Si el email existe en la database, checkeo si la contraseña es la correcta
            return (password == user.acc_password) ? { user: user, success: "access"} : { user: null, success: "wrong-password" };
        }
    }
    return { user: null, success: "non-existent-email" };
};


const deleteBookingByUsingChoice = async (ID_Choice) => await MySQL.realizarQuery(`delete from Bookings where ID_Choice = ${ID_Choice}`);

const createEmptyMatrixOfSeats = (dim1, dim2) => {
    const emptySeat = {
        isEmpty: false,
        userOwner: null
    }
    const matrixOfSeats = Array(dim1).fill().map(() => Array(dim2).fill(emptySeat));
    return matrixOfSeats;
}

exports.insertCinema = async (cinema_name, address, city, dim1, dim2) => {
    await MySQL.realizarQuery(`insert into Cinemas (cinema_name, address, city, dim1, dim2) 
                               values ('${cinema_name}', '${address}', '${city}', ${dim1}, ${dim2});`);
}

exports.deleteCinema = async (ID_Cinema) => {
    // Borro el cine de la tabla cines, borra todas las posibles elecciones y las reservas
    await MySQL.realizarQuery(`delete from Cinemas where ID_Cinema = ${ID_Cinema}`);

    /*
    const choicesWithThisCinemaList = await MySQL.realizarQuery(`select ID_Choice from Choices where ID_Cinema = ${ID_Cinema}`);
    await MySQL.realizarQuery(`delete from Choices where ID_Cinema = ${ID_Cinema}`);

    choicesWithThisCinemaList.forEach(async choice => await deleteBookingByUsingChoice(choice.ID_Choice));
    */
}

exports.insertMovie = async (movie_name, duration, director, movie_language) => {
    await MySQL.realizarQuery(`insert into Movies (movie_name, duration, director, movie_language) values
                              ('${movie_name}', ${duration}, '${director}', '${movie_language}');`);
}

exports.deleteMovie = async (ID_Movie) => {
    // Borro la pelicula de la tabla peliculas, borra todas las posibles elecciones y las reservas
    await MySQL.realizarQuery(`delete from Movies where ID_Movie = ${ID_Movie}`);

    /*
    const choicesWithThisMovieList = await MySQL.realizarQuery(`select ID_Choice from Choices where ID_Movie = ${ID_Movie}`);
    await MySQL.realizarQuery(`delete from Choices where ID_Movie = ${ID_Movie}`);

    choicesWithThisMovieList.forEach(async choice => await deleteBookingByUsingChoice(choice.ID_Choice));
    */
}

exports.selectAllChoices = async () => {
    return await MySQL.realizarQuery(`
        select Cinemas.cinema_name, Movies.movie_name from Choices
        join Cinemas on (Cinemas.ID_Cinema = Choices.ID_Cinema)
        join Movies on (Movies.ID_Movie = Choices.ID_Movie`
    );
}

exports.insertChoice = async () => {
    const emptyMatrixOfSeats = JSON.stringify(createEmptyMatrixOfSeats(dim1, dim2));
    await MySQL.realizarQuery(`insert into Choices ()
                         values ()`);
}

exports.deleteChoice = async (ID_Choice) => {
    /*
    const choicesList = await MySQL.realizarQuery(`select ID_Choice from Choices where ID_Movie = ${ID_Movie}`);
    await MySQL.realizarQuery(`delete from Choices where ID_Choice = ${ID_Choice}`);
    choicesList.forEach(async choice => await deleteBookingByUsingChoice(choice.ID_Choice));
    */
}



