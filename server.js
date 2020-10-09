const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// analizar solicitudes de tipo de contenido - application / json
app.use(bodyParser.json());

// analizar solicitudes de tipo de contenido - application / x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a credenciales aplicación." });
});

//const app = express();
//app.use(...);
//Conexion de la base de datos.
const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
  
// Ruta que se encarga de llamar todas las funciones
require("./app/routes/usuario.routes")(app);

// establecer puerto, escuchar solicitudes
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});