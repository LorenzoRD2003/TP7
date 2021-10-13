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
            return (password == user.acc_password) ? { user: user, success: "access" } : { user: null, success: "wrong-password" };
        }
    }
    return { user: null, success: "non-existent-email" };
};



const createEmptyMatrixOfSeats = (dim1, dim2) => {
    const emptySeat = {
        isEmpty: false,
        userOwner: null
    }
    const matrixOfSeats = Array(dim1).fill().map(() => Array(dim2).fill(emptySeat));
    return matrixOfSeats;
}

exports.selectAllCinemas = async () => {
    const cinemas = await MySQL.realizarQuery(`
        select * from Cinemas
        order by cinema_name, address, city;`
    );
    return cinemas;
}

exports.insertCinema = async (cinema_name, address, city, dim1, dim2) => {
    await MySQL.realizarQuery(`insert into Cinemas (cinema_name, address, city, dim1, dim2) 
                               values ('${cinema_name}', '${address}', '${city}', ${dim1}, ${dim2});`);
}

exports.selectAllMovies = async () => {
    const movies = await MySQL.realizarQuery(`
        select * from Movies
        order by movie_name, movie_language;`
    );
    return movies;
}

exports.insertMovie = async (movie_name, duration, director, movie_language) => {
    await MySQL.realizarQuery(`insert into Movies (movie_name, duration, director, movie_language) values
                              ('${movie_name}', ${duration}, '${director}', '${movie_language}');`);
}

exports.deleteMovie = async (ID_Movie) => {
    // Borro la pelicula de la tabla peliculas, borra todas las posibles elecciones y las reservas
    await MySQL.realizarQuery(`delete from Choices where ID_Movie = ${ID_Movie}`);
    await MySQL.realizarQuery(`delete from Movies where ID_Movie = ${ID_Movie}`);
}

exports.selectAllChoices = async () => {
    const choices = await MySQL.realizarQuery(`
        select Choices.ID_Choice, Cinemas.cinema_name, Movies.movie_name, Choices.movie_schedule from Choices
        join Cinemas on (Cinemas.ID_Cinema = Choices.ID_Cinema)
        join Movies on (Movies.ID_Movie = Choices.ID_Movie)
        order by Cinemas.cinema_name, Movies.movie_name, Choices.movie_schedule;`
    );
    return choices;
}

exports.insertChoice = async (ID_Cinema, ID_Movie, movie_schedule) => {
    const cinema = await MySQL.realizarQuery(`select dim1, dim2 from Cinemas where ID_Cinema = ${ID_Cinema}`);
    const { dim1, dim2 } = cinema[0];
    const emptyMatrixOfSeats = JSON.stringify(createEmptyMatrixOfSeats(dim1, dim2));
    await MySQL.realizarQuery(`insert into Choices(ID_Cinema, ID_Movie, movie_schedule, matrix_of_seats)
                               values (${ID_Cinema}, ${ID_Movie}, '${movie_schedule}', '${emptyMatrixOfSeats}');`);
}

exports.deleteChoice = async (ID_Choice) => await MySQL.realizarQuery(`delete from Choices where ID_Choice = ${ID_Choice}`);

exports.selectMoviesByCinema = async (ID_Cinema) => {
    const moviesByCinema = await MySQL.realizarQuery(`
        select distinct Movies.ID_Movie, Movies.movie_name, Movies.director, Movies.movie_language from Choices
        join Movies on (Movies.ID_Movie = Choices.ID_Movie)
        where Choices.ID_Cinema = ${ID_Cinema}
        order by Movies.movie_name, Movies.movie_language asc;
    `);
    return moviesByCinema;
}

exports.selectScheduleOfChoice = async (ID_Cinema, ID_Movie) => {
    const schedules = await MySQL.realizarQuery(`
        select Choices.movie_schedule from Choices
        where Choices.ID_Cinema = ${ID_Cinema} and Choices.ID_Movie = ${ID_Movie}
        order by Choices.movie_schedule asc;
    `);
    return schedules;
}

exports.selectAllOfSelectedChoice = async (ID_Cinema, ID_Movie, movie_schedule) => {
    const selectedChoice = await MySQL.realizarQuery(`
        select * from Choices
        where ID_Cinema = ${ID_Cinema} and ID_Movie = ${ID_Movie} and movie_schedule = '${movie_schedule}';
    `);
    return selectedChoice;
}