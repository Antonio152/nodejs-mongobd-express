const SessionCtrl = {};
const bcrypt = require('bcrypt');
const User = require('../models/User');


// POST HTTP REQUESTS
// This method saves a cookie session into the client by res argument
// It also saves the session into the db because of the MongoStore OBJ 
SessionCtrl.login = async (req, res) => {
    try {
        console.log(req.body); // Prints sent data from client
        let username = req.body.username;
        let password = req.body.password;
        // username = username.toLowerCase(); // Transforming user to low case
        
        // Validation for data lenght
        if (username.lenght > 12 || password.lenght > 32) {
            res.json({
                success: false,
                msg: 'An error occured, please try again'
            })
        }

        // Query
        const searchedUser = await User.find({
            username: username
        });
        
        // If user exists
        if (Object.keys(searchedUser).length === 1) {
            // Decrypt
            bcrypt.compare(password, searchedUser[0].password, (bcryptErr, verified) => {
                // If decryption works
                if (verified) {
                    // Save session
                    req.session.userId = searchedUser[0]._id;
                    req.session.save();
                    res.json({
                        success: true,
                        username: searchedUser[0].username,
                        foto: searchedUser[0].foto,
                        curp: searchedUser[0].curp,
                        seguroSocial: [{
                            numSos: searchedUser[0].numSos,
                            gpoSanguineo: searchedUser[0].sanguineo
                        }],
                        direccion: [{
                            numero: searchedUser[0].direccion[0].numero,
                            calle: searchedUser[0].direccion[0].calle,
                            localidad: searchedUser[0].direccion[0].localidad,
                            ciudad: searchedUser[0].direccion[0].ciudad,
                            estado: searchedUser[0].direccion[0].estado,
                            cp: searchedUser[0].direccion[0].cp,
                        }],
                        nombreCompleto: `${searchedUser[0].nombre} ${searchedUser[0].aPaterno} ${searchedUser[0].aMaterno}`,
                        nombre: `${searchedUser[0].nombre}`,
                        apellidoPaterno: `${searchedUser[0].aPaterno}`,
                        apellidoMaterno: `${searchedUser[0].aMaterno}`,
                        role: searchedUser[0].rol[0].nombre,
                        modulos: searchedUser[0].rol[0].modulos,
                        datosAcademicos: [{
                            carrera: searchedUser[0].academico[0].carrera,
                            cuatrimestre: searchedUser[0].academico[0].cuatrimestre
                        }],
                        contacto: [{
                            telefono: searchedUser[0].contacto[0].telefono,
                            email: searchedUser[0].contacto[0].email,
                            telEmergencia: searchedUser[0].contacto[0].telEmergencia
                        }]
                    });
                    console.log(`El usuario ${req.session.userId} intentó iniciar sesión`);
                    return;
                }
                else {
                    res.json({
                        success: false,
                        msg: 'Contraseña inválida'
                    })
                }
            });
        }
        else{
            res.json({
                success: false,
                msg: `El usuario: ${req.body.username} no está registrado`
            })
        }
    } catch (error) {
        console.log(`ERROR: ${error}`);
        res.json({
            success: false,
            msg: `Ha ocurrido un error, por favor intente de nuevo (Error: ${error})`
        });
        
    }
    
};


// POST HTTP REQUESTS
// This method logout a user and desroy the cookie into the client
// It also destroys the session into the db because of the MongoStore OBJ 
SessionCtrl.logout = async (req, res) => {
    try{
        // If the session assigned to that user exists
        if (req.session.userId) {
            // Destroying session
            console.log(`El usuario ${req.session.userId} salió de su cuenta`);
            req.session.destroy();
            res.json({
                success: true
            });
            return true;
        }
        else {
            res.json({
                success: false,
                msg: `UserID: ${req.session.userId}`
            });
            return false;
        }
    } catch (error) {
        console.log(`ERROR: ${error}`);
        res.json({
            success: false,
            msg: `Ha ocurrido un error, por favor intente de nuevo (Error: ${error})`
        });
    }
};


// POST HTTP REQUESTS
// This method allows the client to know if session of a client exists by a cookie
SessionCtrl.isLoggedIn = async (req, res) => {
    // If the session assigned to that user exists
    if (req.session.userId) {
        const searchedUser = await User.find({
            _id: req.session.userId
        });

        // If user exists
        if (Object.keys(searchedUser).length === 1) {
            // Sending response
            res.json({
                success: true,
                username: searchedUser[0].username,
                foto: searchedUser[0].foto,
                curp: searchedUser[0].curp,
                seguroSocial: [{
                    numSos: searchedUser[0].numSos,
                    gpoSanguineo: searchedUser[0].sanguineo
                }],
                direccion: [{
                    numero: searchedUser[0].direccion[0].numero,
                    calle: searchedUser[0].direccion[0].calle,
                    localidad: searchedUser[0].direccion[0].localidad,
                    ciudad: searchedUser[0].direccion[0].ciudad,
                    estado: searchedUser[0].direccion[0].estado,
                    cp: searchedUser[0].direccion[0].cp,
                }],
                nombreCompleto: `${searchedUser[0].nombre} ${searchedUser[0].aPaterno} ${searchedUser[0].aMaterno}`,
                nombre: `${searchedUser[0].nombre}`,
                apellidoPaterno: `${searchedUser[0].aPaterno}`,
                apellidoMaterno: `${searchedUser[0].aMaterno}`,
                role: searchedUser[0].rol[0].nombre,
                modulos: searchedUser[0].rol[0].modulos,
                datosAcademicos: [{
                    carrera: searchedUser[0].academico[0].carrera,
                    cuatrimestre: searchedUser[0].academico[0].cuatrimestre
                }],
                contacto: [{
                    telefono: searchedUser[0].contacto[0].telefono,
                    email: searchedUser[0].contacto[0].email,
                    telEmergencia: searchedUser[0].contacto[0].telEmergencia
                }]
            });
            console.log(`El usuario ${req.session.userId} ingresó a través de una sesión ya existente`);
            return true;
        }
        else{
            res.json({
                success: false,
                msg: 'No existe usuario'
            })
        }
    }
    res.json({
        success: false,
        msg: 'No hay usuario asociado a la sesión'
    })
};

module.exports = SessionCtrl;