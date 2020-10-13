const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    SchemaVersion: {
        type:String,
        default:"2.0"
    },
    username: {
        type: String,
        required: true,
        trime: true, // clean the username extra spaces
        unique: true // not repeated data
    },
    password: String,
    foto: String,
    nombre: String,
    aPaterno: String,
    aMaterno: String,
    curp: String,
    numSos: String,
    sanguineo: String,
    contacto: [{
        telefono: String,
        email:String,
        telEmergencia:String
    }],
    direccion: [{
        numero: {
            type: Number
            // min: 1,
            // max: 10
        },
        calle: String,
        localidad: String,
        ciudad: String,
        estado: String,
        cp: String
    }],
    rol: [{
        nombre: String,
        modulos:[]
    }],
    academico: [{
        carrera: String,
        cuatrimestre: {
            type: Number,
            min: 1,
            max: 10
        }
    }],
    published: Boolean
    }, { 
    timestamps: true 
});

module.exports = model('User', userSchema);