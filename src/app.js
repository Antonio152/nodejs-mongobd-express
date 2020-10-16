const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connection = require('./database');

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

// SETTINGS: server config
// It's like a variable 'port': depoyAppPort || 4000
app.set('port', process.env.PORT || 4000); 

// MIDLEWARES: functions excecuted before it enters to the routes
app.use(cors({origin:true,credentials: true})); // thus, you can send and retrieve data from server
app.use(express.json()); // now server can understand JSON files
// analizar solicitudes de tipo de contenido - application / x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

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

module.exports = app;

