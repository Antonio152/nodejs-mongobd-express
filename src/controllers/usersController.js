const userCtrl = {};

const User = require('../models/User');
const bcrypt = require('bcrypt');
// GET
userCtrl.findAll = async (req, res) => {
    const title = req.query.title;
    var condition = title ? {  
        title: { $regex: new RegExp(title), $options: "i" } 
    } : {};

    await User.find(condition)
        .then(data => {
            res.send(data);
    })
    .catch(err => {
        res.status(500).json({
            message:
            err.message || "Ocurrio un error obteniendo los datos."
        });
    });
};

userCtrl.findOne = async (req, res) => {
    const id = req.params.id;
  
    User.findById(id)
      .then(data => {
        if (!data)
          res.status(404).json({ message: "No se encontro el dato con el id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Error al encontrar el dato con el id=" + id });
      });
  };

// POST
userCtrl.createUser = async (req, res) => {
    // Validamos la respuesta
    if (!req.body.username) {
        res.status(400).json({ message: "El contenido no puede estar vacio!" });
        return;
    }
    // Creamos la base de datos y comprobamos el estado.
    const usuario = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 9),
        foto: req.body.foto,
        nombre: req.body.nombre,
        aPaterno: req.body.aPaterno,
        aMaterno: req.body.aMaterno,
        curp: req.body.curp,
        numSos: req.body.numSos,
        sanguineo: req.body.sanguineo,
        contacto: req.body.contacto,
        telEmergencia:req.body.contacto.telEmergencia,
        direccion: req.body.direccion,
        rol: req.body.rol,
        academico: req.body.academico,
        published: req.body.published ? req.body.published : false
    });
    // Guardamos los datos en la base de datos
    await usuario
        .save(usuario)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).json({
                message:
                err.message || "Ocurrio algun error creando la tabla de la base de datos."
            });
        });
};

userCtrl.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Los datos a actualizar no pueden estar vacios!"
        });
    }
  
    const id = req.params.id;
  
    await User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
            res.status(404).json({
                message: `No se puede actualizar el dato con el id=${id}. Probablemente el dato no fue encontrado!`
            });
            } else res.json({ message: "Datos actualizados satisfactoriamente." });
        })
        .catch(err => {
            res.status(500).json({
            message: "Error al actualizar el dato con el id=" + id
            });
        });
  };

// DELETE
userCtrl.deleteUser = async (req, res) => {
    const id = req.params.id;
  
    await User.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
            res.status(404).send({
                message: `No se puede actualizar el dato con el id=${id}. Probablemente el dato no fue encontrado!`
            });
            } else {
            res.send({
                message: "El dato fue eliminado correctamente!"
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "No se puede elminar el dato con el id=" + id
            });
        });
};

// Eliminar todos los datos de la base de datos.
userCtrl.deleteAll = async (req, res) => {
        await User.deleteMany({})
        .then(data => {
            res.send({
            message: `Se han eliminado ${data.deletedCount} datos correctamente!`
            });
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Ocurrio un error eliminando los datos."
            });
        });
};

// Encontrar todos los datos publicados.
userCtrl.findAllPublished = async (req, res) => {
    await User.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Ocurrio un error consultando los datos."
            });
        });
};
module.exports = userCtrl;