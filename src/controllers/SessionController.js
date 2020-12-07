const SessionCtrl = {};
const bcrypt = require('bcrypt');
const User = require('../models/User');
const access = require('../services/createToken')
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require('path');

const makeLogin = (req,res,searchedUser) => {
    const datosToken =  access.createToken(searchedUser._id)
    // Save session
    req.session.userId = searchedUser._id;
    req.session.save();
    res.json({
        success: true,
        token:datosToken,
        _id: searchedUser._id,
        username: searchedUser.username,
        foto: searchedUser.foto,
        curp: searchedUser.curp,
        seguroSocial: [{
            numSos: searchedUser.numSos,
            gpoSanguineo: searchedUser.sanguineo
        }],
        direccion: [{
            numero: searchedUser.direccion[0].numero,
            calle: searchedUser.direccion[0].calle,
            localidad: searchedUser.direccion[0].localidad,
            ciudad: searchedUser.direccion[0].ciudad,
            estado: searchedUser.direccion[0].estado,
            cp: searchedUser.direccion[0].cp,
        }],
        nombreCompleto: `${searchedUser.nombre} ${searchedUser.aPaterno} ${searchedUser.aMaterno}`,
        nombre: `${searchedUser.nombre}`,
        apellidoPaterno: `${searchedUser.aPaterno}`,
        apellidoMaterno: `${searchedUser.aMaterno}`,
        role: searchedUser.rol[0].nombre,
        modulos: searchedUser.rol[0].modulos,
        datosAcademicos: [{
            carrera: searchedUser.academico[0].carrera,
            cuatrimestre: searchedUser.academico[0].cuatrimestre,
            estatus: searchedUser.academico[0].estatus,
            matricula: searchedUser.academico[0].matricula
            // ...(searchedUser.rol[0].nombre !== 'Alumno' && searchedUser.rol[0].nombre !== 'Profesor' &&{estatus: searchedUser[0].academico[0].estatus !== undefined ? searchedUser[0].academico[0].estatus : true}),
            // ...(searchedUser.rol[0].nombre !== 'Alumno' && searchedUser.rol[0].nombre !== 'Profesor' &&{ matricula: searchedUser[0].academico[0].matricula !== undefined ? searchedUser[0].academico[0].matricula : ''})
        }],
        contacto: [{
            telefono: searchedUser.contacto[0].telefono,
            email: searchedUser.contacto[0].email,
            telEmergencia: searchedUser.contacto[0].telEmergencia
        }]
    });
    console.log(`El usuario ${req.session.userId} intentó iniciar sesión`);
    return;
}
// POST HTTP REQUESTS

SessionCtrl.codeVerification = async (req,res) => {
    try {
        console.log(req.body);
        const searchedUser = await User.findOne({'contacto.0.email': req.body.email});

        if (req.body.codigo === undefined || req.body.email === undefined){
            res.json({
                success: false,
                msg: 'Sin datos'
            });
            return;
        }
        if (req.body.codigo === searchedUser.reestablecimiento){
            res.json({
                success: true,
                msg: 'Código aceptado',
                id: searchedUser._id
            })
        }
        else {
            res.json({
                success: false,
                msg: 'Código incorrecto'
            })
        }
    } catch (error) {
        console.log(`ERROR: ${error}`);
        res.json({
            success: false,
            msg: `Ha ocurrido un error, por favor intente de nuevo (Error: ${error})`
        });
    }
}

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
        
        if (searchedUser[0].bloqueado){
            res.json({
                success: false,
                msg: 'Usuario bloqueado'
            });
            return;
        }

        // If user exists
        if (Object.keys(searchedUser).length === 1) {
            // Decrypt
            bcrypt.compare(password, searchedUser[0].password, (bcryptErr, verified) => {
                // If decryption works
                if (verified) {
                    makeLogin(req,res,searchedUser[0]);
                    return;
                }
                else {
                    res.json({
                        success: false,
                        msg: 'Contraseña inválida',
                        id: searchedUser[0]._id
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
            //Token para la session actual
            const datosToken =  access.createToken(searchedUser);
            // Sending response
            res.json({
                success: true,
                token: datosToken,
                username: searchedUser[0].username,
                _id: searchedUser[0]._id,
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
                    cuatrimestre: searchedUser[0].academico[0].cuatrimestre,
                    estatus: searchedUser[0].academico[0].estatus,
                    matricula: searchedUser[0].academico[0].matricula
                    // ...(searchedUser.rol[0].nombre !== 'Alumno' && searchedUser.rol[0].nombre !== 'Profesor' &&{estatus: searchedUser[0].academico[0].estatus !== undefined ? searchedUser[0].academico[0].estatus : true}),
                    // ...(searchedUser.rol[0].nombre !== 'Alumno' && searchedUser.rol[0].nombre !== 'Profesor' &&{ matricula: searchedUser[0].academico[0].matricula !== undefined ? searchedUser[0].academico[0].matricula : ''})

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

const makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

SessionCtrl.sendEmail = async (req, res) => {
    const {email} = req.body;
    const code = makeid(6);

    
    const user = await User.findOne({'contacto.0.email': email});
    if (user !== null){
        await User.findOneAndUpdate({'contacto.0.email': email}, {reestablecimiento:code});
        
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'mandatum.service@gmail.com', // generated ethereal user
                pass: 'ZXB#@zSR*rrY', // generated ethereal password
            },
        });
        // Options for hbs files
        const options = {
            viewEngine: {
              partialsDir: path.join(process.cwd(), 'src', 'layouts', 'partials'),
              layoutsDir: path.join(process.cwd(), 'src', 'layouts', 'emails', 'view'),
              extname: ".hbs"
            },
            extName: ".hbs",
            viewPath: path.join(process.cwd(), 'src', 'layouts', 'emails')
        };
        // What to do with hbs files
        transporter.use('compile', hbs(options));
        // Data loaded on hbs file
        const datosHbs = {
            nombre: user.nombre,
            codigo: code
        };
        // Email to send
        const msg = {
            from: '"Mandatum Support Service" mandatum.service@gmail.com', // sender address
            to: `${email}`, // list of receivers
            subject: "Solicitud de cambio de contraseña", // Subject line
            template: 'PswRestore',
            context: datosHbs,
            envelope: {
                from: 'mandatum.service@gmail.com, Mandatum Support Service <mandatum.service@gmail.com>', // used as MAIL FROM: address for SMTP
                to: `${email}` // used as RCPT TO: address for SMTP
            }
        }
    

        // send mail with defined transport object
        await transporter.sendMail(msg, (error, info) => {
            if (error){
                res.json({
                    success: false,
                    msg:'Ha ocurrido un problema',
                    error: error
                });
            }
            else{
                res.json({
                    success: true,
                    msg:'Email enviado'
                });
            }
        });
    }
    else{
        res.json({
            success: false,
            msg:'No existe usuario registrado con dicho email.'
        });
    }
    
}

SessionCtrl.doLockUser = async (req, res) => {
    try {
        await User.findOneAndUpdate({username: req.body.username}, {bloqueado: true});
        res.json({
            success: true,
            msg: `El usuario ha sido bloqueado`
        });
    } catch (error) {
        console.log(`ERROR: ${error}`);
        res.json({
            success: false,
            msg: `Ha ocurrido un error. (Error: ${error})`
        });
    }
}

module.exports = SessionCtrl;