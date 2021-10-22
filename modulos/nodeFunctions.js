const MySQL = require('./mysql');

const selectAll = async (table) => await MySQL.realizarQuery(`select * from ${table}`);
exports.selectAll = selectAll;

exports.userAlreadyInDatabase = async (newEmail) => {
    const emailsList = await MySQL.realizarQuery("select email from Users");
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
        "isEmpty": true,
        "userOwner": null
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
    await MySQL.realizarQuery(`
        insert into Cinemas (cinema_name, address, city, dim1, dim2) 
        values ('${cinema_name}', '${address}', '${city}', ${dim1}, ${dim2});
    `);
}

exports.selectAllMovies = async () => {
    const movies = await MySQL.realizarQuery(`
        select * from Movies
        order by movie_name, movie_language;
    `);
    return movies;
}

exports.insertMovie = async (movie_name, duration, director, movie_language) => {
    await MySQL.realizarQuery(`
        insert into Movies (movie_name, duration, director, movie_language) values
        ('${movie_name}', ${duration}, '${director}', '${movie_language}');
    `);
}

exports.deleteMovie = async (ID_Movie) => {
    await MySQL.realizarQuery(`
        delete Bookings from Bookings
        inner join Choices on Bookings.ID_Choice = Choices.ID_Choice
        where Choices.ID_Movie = ${ID_Movie};
    `);
    await MySQL.realizarQuery(`delete from Choices where ID_Movie = ${ID_Movie}`);
    await MySQL.realizarQuery(`delete from Movies where ID_Movie = ${ID_Movie}`);
}

exports.selectAllChoices = async () => {
    const choices = await MySQL.realizarQuery(`
        select Choices.ID_Choice, Cinemas.cinema_name, Movies.movie_name, Choices.movie_schedule from Choices
        join Cinemas on (Cinemas.ID_Cinema = Choices.ID_Cinema)
        join Movies on (Movies.ID_Movie = Choices.ID_Movie)
        order by Cinemas.cinema_name, Movies.movie_name, Choices.movie_schedule;
    `);
    return choices;
}

exports.insertChoice = async (ID_Cinema, ID_Movie, movie_schedule) => {
    const cinema = await MySQL.realizarQuery(`select dim1, dim2 from Cinemas where ID_Cinema = ${ID_Cinema}`);
    const { dim1, dim2 } = cinema[0];
    const emptyMatrixOfSeats = JSON.stringify(createEmptyMatrixOfSeats(dim1, dim2));
    await MySQL.realizarQuery(`
        insert into Choices(ID_Cinema, ID_Movie, movie_schedule, matrix_of_seats)
        values (${ID_Cinema}, ${ID_Movie}, '${movie_schedule}', '${emptyMatrixOfSeats}');
    `);
}

exports.deleteChoice = async (ID_Choice) => {
    await MySQL.realizarQuery(`delete from Bookings where ID_Choice = ${ID_Choice};`);
    await MySQL.realizarQuery(`delete from Choices where ID_Choice = ${ID_Choice}`);
}

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

exports.selectToContinuesSelectSeats = async (ID_Cinema, ID_Movie, movie_schedule) => {
    const selectedChoice = await MySQL.realizarQuery(`
        select Cinemas.cinema_name, Cinemas.address, Cinemas.city, 
               Movies.movie_name, Movies.director, Movies.movie_language, Movies.duration,
               Choices.ID_Choice, Choices.movie_schedule, Choices.matrix_of_seats from Choices
        join Cinemas on (Choices.ID_Cinema = Cinemas.ID_Cinema)  
        join Movies on (Movies.ID_Movie = Choices.ID_Movie)     
        where Choices.ID_Cinema = ${ID_Cinema} and Choices.ID_Movie = ${ID_Movie} and Choices.movie_schedule = '${movie_schedule}';
    `);
    return selectedChoice[0];
}

// Obtener matriz de asientos
const selectMatrixOfSeats = async (ID_Choice) => {
    return (await MySQL.realizarQuery(`
        select matrix_of_seats from Choices
        where ID_Choice = ${ID_Choice};
    `))[0].matrix_of_seats;
}

// Actualizar matriz de asientos en la base de datos
const updateMatrixOfSeats = async (ID_Choice, matrixOfSeats) => {
    await MySQL.realizarQuery(`
        update Choices
        set matrix_of_seats = '${JSON.stringify(matrixOfSeats)}'
        where ID_Choice = ${ID_Choice};
    `);
}

// Modificar matriz de asientos
exports.modifyMatrixOfSeats = async (ID_User, ID_Choice, seats) => {
    const matrixOfSeats = await selectMatrixOfSeats(ID_Choice);
    for (let seat of seats) {
        let foundSeat = matrixOfSeats[seat.row][seat.column];
        foundSeat.isEmpty = false;
        foundSeat.user = ID_User;
    }
    await updateMatrixOfSeats(ID_Choice, matrixOfSeats);
}

// Asignar reserva de asientos a la base de datos
exports.createBooking = async (ID_User, ID_Choice, seats, price, was_paid) => {
    // Agregar la reserva
    await MySQL.realizarQuery(`
        insert into Bookings(ID_User, ID_Choice, seats, price, was_paid)
        values (${ID_User}, ${ID_Choice}, '${JSON.stringify(seats)}', ${price}, ${was_paid});
    `);
}

// Obtener todas las reservas de este usuario
exports.selectAllBookings = async (ID_User) => {
    const allBookings = (await MySQL.realizarQuery(`
    select Bookings.ID_Booking, Bookings.seats, Bookings.price, Bookings.was_paid,
           Cinemas.cinema_name, Cinemas.address, Cinemas.city, 
           Movies.movie_name, Movies.director, Movies.movie_language, Movies.duration,
           Choices.movie_schedule from Bookings
    join Choices on (Bookings.ID_Choice = Choices.ID_Choice)
    join Cinemas on (Choices.ID_Cinema = Cinemas.ID_Cinema)
    join Movies on (Movies.ID_Movie = Choices.ID_Movie)
    where Bookings.ID_User = ${ID_User}
    order by Bookings.ID_Booking;
    `));
    return allBookings;
}

exports.deleteBooking = async (ID_Booking, seats) => {
    // Obtengo la opcion de reserva a la cual correspone esta reserva
    const ID_Choice = (await MySQL.realizarQuery(`
        select ID_Choice from Bookings
        where ID_Booking = ${ID_Booking};
    `))[0].ID_Choice;

    // Vuelvo a poner los asientos de la matriz como libres
    const matrixOfSeats = await selectMatrixOfSeats(ID_Choice);
    for (let seat of seats) {
        let foundSeat = matrixOfSeats[seat.row][seat.column];
        foundSeat.isEmpty = true;
        foundSeat.user = null;
    }
    await updateMatrixOfSeats(ID_Choice, matrixOfSeats);

    // Borro la reserva
    await MySQL.realizarQuery(`delete from Bookings where ID_Booking = ${ID_Booking}`);
};

exports.payBooking = async (ID_Booking) => {
    await MySQL.realizarQuery(`
        update Bookings
        set was_paid = true
        where ID_Booking = ${ID_Booking};
    `);  
}
