
/*  Paquetes instalados: -g nodemon, express, express-handlebars, body-parser, mysql2
    Agregado al archivo "package.json" la línea --> "start": "nodemon index"
    
    Proyecto "Node_base"
    Desarrollo de Aplicaciones Informáticas - 5to Informática
    
    Docentes: Nicolás Facón, Martín Rivas
    
    Revisión 1 - Año 2021
*/
//Cargo librerías instaladas y necesarias
const express = require('express'); //Para el manejo del servidor Web
const exphbs  = require('express-handlebars'); //Para el manejo de los HTML
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos
const nodeFunctions = require('./modulos/nodeFunctions');

const app = express(); //Inicializo express para el manejo de las peticiones

app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

app.listen(Listen_Port, function() {
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
            res.send({ success: "successful"});
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
        res.render('homeAdmin', null);
        return;
    }

    try {
        const { user, success } = await nodeFunctions.loginIntoSystem(req.body.email, req.body.password);
        switch(success) {
            case "access":
                res.render('home', user);
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

app.get('/adminChangesSelector', async (req, res) => {
    // En cada caso, primero hago llamada a la base de datos para los datos que necesite.
    try {
        switch(req.query.adminChangesSelectorName) {
            case "Cinemas":
                const cinemas = await nodeFunctions.selectAll("Cinemas");
                console.log(cinemas);
                res.render('homeAdmin', { cinemas: cinemas });
                break;
            case "Movies":
                const movies = await nodeFunctions.selectAll("Movies");
                res.render('homeAdmin', { movies: movies });
                break;
            case "Times":
                const times = await nodeFunctions.selectAll("Times");
                res.render('homeAdmin', { times: times });
                break;
        }
    } catch (err) {
        console.log(err);
        res.render('homeAdmin', { error: "Ocurrió un error. Inténtelo nuevamente." });
    }
});

app.get('/updateCinemasList', async (req, res) => {
    try {
        const cinemasList = await nodeFunctions.selectAll("Cinemas");
        res.send({ cinemasList: cinemasList });
    } catch (err) {
        console.log(err);
        res.send(null);
    }
});

app.post('/addNewCinema', async (req, res) => {
    try {
        await nodeFunctions.insertCinema(req.body.name, req.body.address, req.body.city, req.body.dim1, req.body.dim2);
        res.send({ success: "successful" });
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
})

app.delete('/deleteCinema', async (req, res) => {
    try {
        await nodeFunctions.deleteCinema(req.body.ID_Cinema);
        res.send({ success: "successful"});
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
});


app.get('/updateMoviesList', async (req, res) => {
    try {
        const moviesList = await nodeFunctions.selectAll("Movies");
        res.send({ moviesList: moviesList });
    } catch (err) {
        console.log(err);
        res.send(null);
    }
});

app.post('/addNewMovie', async (req, res) => {
    try {
        await nodeFunctions.insertMovie(req.body.name, req.body.duration, req.body.director, req.body.language);
        res.send({ success: "successful" });
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
})

app.delete('/deleteMovie', async (req, res) => {
    try {
        await nodeFunctions.deleteMovie(req.body.ID_Movie);
        res.send({ success: "successful"});
    } catch (err) {
        console.log(err);
        res.send({ success: "error" });
    }
});