const dbConfig = require("../config/db.config.js"); //  Adquirimos la cadena de conexion de la base de datos.

const mongoose = require("mongoose");   //  Utilizamos Mongoose de node js para la conexión.
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.usuarios = require("./usuario.model.js")(mongoose);

module.exports = db;
