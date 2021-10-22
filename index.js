
/*  Paquetes instalados: -g nodemon, express, express-handlebars, body-parser, mysql2
    Agregado al archivo "package.json" la línea --> "start": "nodemon index"
    
    Proyecto "Node_base"
    Desarrollo de Aplicaciones Informáticas - 5to Informática
    
    Docentes: Nicolás Facón, Martín Rivas
    
    Revisión 1 - Año 2021
*/
//Cargo librerías instaladas y necesarias
const express = require('express'); //Para el manejo del servidor Web
const exphbs = require('express-handlebars'); //Para el manejo de los HTML
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const nodeFunctions = require('./modulos/nodeFunctions');
const session = require('express-session');


const app = express(); //Inicializo express para el manejo de las peticiones

app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());
app.use(session({ secret: 'erwltkjqwqmnsdflkjnqweradsfjklbnewdsfwrgfsfgvaxcvjbasdkfbawehf', resave: true, saveUninitialized: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' })); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

app.listen(Listen_Port, function () {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

app.get('/', (req, res) => res.render('login', null));

app.get('/gotoCreateAccount', (req, res) => res.render('createAccount', null));

// Crear cuenta
app.post('/createAccount', async (req, res) => {
    try {
        // Guardo true o false respecto de si el usuario ya está en la base
        const boolUserInDB = await nodeFunctions.userAlreadyInDatabase(req.body.email);
        if (boolUserInDB) {
            res.send({ success: "alreadyExisting" });
        }
        else {
            // Inserto el usuario en la base de datos
            await nodeFunctions.insertUser(req.body.name, req.body.surname, req.body.dni, req.body.email, req.body.password);
            res.send({ success: "successful" });
        }
    }
    catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
});

// Iniciar sesión
app.post('/loginIntoSystem', async (req, res) => {
    if (req.body.email == "admin" && req.body.password == "admin") {
        req.session.user = {
            email: req.body.email,
            password: req.body.password
        }
        res.render('homeAdmin', { user: req.session.user });
        return;
    }

    try {
        const { user, success } = await nodeFunctions.loginIntoSystem(req.body.email, req.body.password);
        switch (success) {
            case "access":
                req.session.user = user; // Variable de sesion
                res.render('home', { user: req.session.user });
                break;
            case "wrong-password":
                res.render('login', { error: "La contraseña ingresada es incorrecta." });
                break;
            case "non-existent-email":
                res.render('login', { error: "El email no está registrado." });
                break;
        }
    } catch (err) {
        console.log(err);
        res.render('login', { error: "Ocurrió un error. Inténtelo nuevamente." });
    }
});

// Cerrar sesión
app.post('/logout', async (req, res) => {
    req.session.destroy();
    res.render('login', null);
});

app.get('/adminChangesCinemas', async (req, res) => {
    const cinemas = await nodeFunctions.selectAllCinemas();
    res.render('adminChangesCinemas', { user: req.session.user, cinemas: cinemas });
});

app.get('/adminChangesMovies', async (req, res) => {
    const movies = await nodeFunctions.selectAllMovies();
    res.render('adminChangesMovies', { user: req.session.user, movies: movies });
});

app.get('/adminChangesChoices', async (req, res) => {
    const object = {
        user: req.session.user,
        cinemas: await nodeFunctions.selectAllCinemas(),
        movies: await nodeFunctions.selectAllMovies(),
        choices: await nodeFunctions.selectAllChoices()
    }
    res.render('adminChangesChoices', object);
});

app.get('/returnAdminChangesZone', (req, res) => res.render('homeAdmin', { user: req.session.user }));

// Actualizar select (de HTML) de cines 
app.get('/updateCinemasList', async (req, res) => {
    try {
        const cinemasList = await nodeFunctions.selectAllCinemas();
        res.send({ cinemasList: cinemasList });
    } catch (err) {
        console.log(err);
        res.send(null);
    }
});

// Agregar un cine
app.post('/addNewCinema', async (req, res) => {
    try {
        await nodeFunctions.insertCinema(req.body.name, req.body.address, req.body.city, req.body.dim1, req.body.dim2);
        res.send({ success: "successful" });
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
})

// Borrar un cine
app.delete('/deleteCinema', async (req, res) => {
    try {
        await nodeFunctions.deleteCinema(req.body.ID_Cinema);
        res.send({ success: "successful" });
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
});

// Actualizar select (de HTML) de peliculas
app.get('/updateMoviesList', async (req, res) => {
    try {
        const moviesList = await nodeFunctions.selectAllMovies();
        res.send({ moviesList: moviesList });
    } catch (err) {
        console.log(err);
        res.send(null);
    }
});

// Agregar una pelicula
app.post('/addNewMovie', async (req, res) => {
    try {
        await nodeFunctions.insertMovie(req.body.name, req.body.duration, req.body.director, req.body.language);
        res.send({ success: "successful" });
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
});

// Borrar una pelicula
app.delete('/deleteMovie', async (req, res) => {
    try {
        await nodeFunctions.deleteMovie(req.body.ID_Movie);
        res.send({ success: "successful" });
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
});

// Actualizar select (de HTML) de opciones de reserva
app.get('/updateChoicesList', async (req, res) => {
    try {
        const choicesList = await nodeFunctions.selectAllChoices();
        res.send({ choicesList: choicesList });
    } catch (err) {
        console.log(err);
        res.send(null);
    }
});

// Agregar una opción de reserva
app.post('/addNewChoice', async (req, res) => {
    try {
        await nodeFunctions.insertChoice(req.body.ID_Cinema, req.body.ID_Movie, req.body.movie_schedule);
        res.send({ success: "successful" });
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
});

// Borrar una opción de reserva
app.delete('/deleteChoice', async (req, res) => {
    try {
        await nodeFunctions.deleteChoice(req.body.ID_Choice);
        res.send({ success: "successful" });
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
});

// Ir a la pantalla de seleccion de cine y pelicula
app.get('/selectCinemaAndMovie', async (req, res) => {
    try {
        const cinemas = await nodeFunctions.selectAllCinemas();
        res.render('selectCinemaAndMovie', { user: req.session.user, cinemas: cinemas });
    } catch (err) {
        console.log(err);
        res.render('home', { user: req.session.user, error: "Ocurrió un error. Inténtelo nuevamente." });
    }
});

// Volver a home.handlebars
app.get('/returnHome', (req, res) => res.render('home', { user: req.session.user }));

// Actualizar lista de películas por cine
app.get('/getMoviesForThisCinema', async (req, res) => {
    try {
        const moviesList = await nodeFunctions.selectMoviesByCinema(req.query.ID_Cinema);
        res.send({ moviesList: moviesList });
    } catch (err) {
        console.log(err);
        res.send(null);
    }
});

// Actualizar lista de horarios
app.get('/getSchedule', async (req, res) => {
    try {
        const schedulesList = await nodeFunctions.selectScheduleOfChoice(req.query.ID_Cinema, req.query.ID_Movie);
        res.send({ schedulesList: schedulesList });
    } catch (err) {
        console.log(err);
        res.send(null);
    }
})

// Ir a la pantalla de selección de asientos
app.post('/continueToSelectSeats', async (req, res) => {
    try {
        req.session.selectedChoice = await nodeFunctions.selectToContinuesSelectSeats(req.body.id_cinema, req.body.id_movie, req.body.movie_schedule);
        res.render("selectSeats", { user: req.session.user, selectedChoice: req.session.selectedChoice });
    } catch (err) {
        console.log(err);
        const cinemas = await nodeFunctions.selectAllCinemas();
        res.render('selectCinemaAndMovie', { cinemas: cinemas, error: "Ocurrió un error. Inténtelo nuevamente." });
    }
});

// Asignar asientos
app.post('/assignSeats', async (req, res) => {
    try {
        req.session.seats = { listOfSeats: req.body, price: 100 * req.body.length };
        res.send({ success: "successful" });
    } catch(err) {
        console.log(err);
        res.send({ success: "error" });
    }
});

app.get('/continueToBookingConfirmation', async (req, res) => {
    res.render("bookingConfirmation", {
        user: req.session.user,
        selectedChoice: req.session.selectedChoice, 
        seats: req.session.seats
    });
});

app.post('/confirmBooking', async (req, res) => {
    try {
        const ID_User = req.session.user.ID_User;
        const ID_Choice = req.session.selectedChoice.ID_Choice;
        const seats = req.session.seats.listOfSeats;
        const price = req.session.seats.price;
        const was_paid = (req.body.bookOrPay == "book") ? false : true;
        
        // Por un lado tengo que cambiar la matriz de asientos, y por otro agregar la reserva
        await nodeFunctions.modifyMatrixOfSeats(ID_User, ID_Choice, seats);
        await nodeFunctions.createBooking(ID_User, ID_Choice, seats, price, was_paid);
        delete req.session.selectedChoice, req.session.seats;
        res.render('home', { user: req.session.user });
    } catch (err) {
        console.log(err);
        res.render("bookingConfirmation", {
            user: req.session.user,
            selectedChoice: req.session.selectedChoice,
            seats: req.session.seats,
            error: "Ocurrió un error. Inténtelo nuevamente."
        });
    }
});

app.get('/modifyBookings', async (req, res) => {
    try {
        const allBookings = await nodeFunctions.selectAllBookings(req.session.user.ID_User);
        // Tengo que dividirlas en pagadas y no pagadas
        const paidBookings = [], notPaidBookings = [];
        allBookings.forEach(booking => (booking.was_paid) ? paidBookings.push(booking) : notPaidBookings.push(booking));
        res.render('modifyBookings', {
            user: req.session.user,
            paidBookings: paidBookings,
            notPaidBookings: notPaidBookings
        });
    } catch (err) {
        console.log(err);
        res.render('home', { user: req.session.user, error: "Ocurrió un error. Inténtelo nuevamente." });
    }
});

app.delete('/deleteBooking', async (req, res) => {
    try {
        await nodeFunctions.deleteBooking(req.body.ID_Booking, req.body.seats);
        res.send({ success: "successful" });
    } catch(err) {
        console.log(err);
        res.send({ success: "error" });
    }
});

app.put('/payBooking', async (req, res) => {
    try {
        await nodeFunctions.payBooking(req.body.ID_Booking);
        res.send({ success: "successful" });
    } catch(err) {
        console.log(err);
        res.send({ success: "error" });
    }
});
