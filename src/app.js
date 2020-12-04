const express = require('express');
const exhbs = require('express-handlebars');
const cors = require('cors');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connection = require('./database');
const path = require('path');

const bodyParser = require("body-parser");

// This is for session and authentication
app.use(session({
    // key: 'Una-cadena-que-se-guste',
    secret: 'Otra-cadena-que-se-guste',
    saveUninitialized: false,
    resave: false,
    rolling: true,
    store: new MongoStore({
        mongooseConnection: connection,
        // secret: 'here_goes_a_password',
        ttl: 14 * 24 * 60 * 60 * 1000, // = 14 days. Default
        autoRemove: 'native' // Default
    }),
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
}));
//This makes that images could be accessible by http://localhost:4000/<name_of_the_img>.<format>
app.use(express.static('src/layouts/img'));
// SETTINGS: server config
// It's like a variable 'port': depoyAppPort || 4000
app.set('port', process.env.PORT || 4000); 

// Images or whatever the path and folders your images are in

// MIDLEWARES: functions excecuted before it enters to the routes
app.use(cors({origin:true,credentials: true})); // thus, you can send and retrieve data from server
app.use(express.json({limit: '256mb'})); // now server can understand JSON files

// analizar solicitudes de tipo de contenido - application / x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '256mb', extended: true }));

app.use((req, res, next) => {
    // HEADERS FOR HTTP REQUESTS IF NEEDED
    // voidSessionDestroyer();
    // res.header('Access-Control-Allow-Credentials', true);
    // res.header('Access-Control-Allow-Origin', req.headers.origin);
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    if (req.method === "OPTIONS") { // ONLY IF HTTP CODE STATUS IS CORRECT
        return res.status(200).end();
    } else {
        next();
    }
});

// ROUTES FROM THIS API
app.get("/", (req, res) => {
    res.send("Bienvenido al backend de la aplicación de credenciales")
});
app.use('/api/users', require('./routes/Users'));
app.use('/session', require('./routes/Session'));
app.use('/cards', require('./routes/Cards'));

module.exports = app;

