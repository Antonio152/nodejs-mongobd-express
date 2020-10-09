const db = require("../models");
const Usuario = db.usuarios;

// Crear la base de datos y guardar los datos
exports.create = (req, res) => {
    // Validamos la respuesta
    if (!req.body.id_Alumno) {
      res.status(400).send({ message: "El contenido no puede estar vacio!" });
      return;
    }
  
    // Creamos la base de datos y comprobamos el estado.
    const usuario = new Usuario({
      id_Alumno: req.body.id_Alumno,
      foto: req.body.foto,
      nombre: req.body.nombre,
      aPaterno: req.body.aPaterno,
      aMaterno: req.body.aMaterno,
      curp: req.body.curp,
      numSos: req.body.numSos,
      sanguineo: req.body.sanguineo,
      calle: req.body.calle,
      direccion: req.body.direccion,
      localidad: req.body.localidad,
      ciudad: req.body.ciudad,
      estado: req.body.estado,
      cp: req.body.cp,
      published: req.body.published ? req.body.published : false
    });
  
    // Guardamos los datos en la base de datos
    usuario
      .save(usuario)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocurrio algun error creando la tabla de la base de datos."
        });
      });
  };

// Recuperar todos los datos de la base de datos.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  
    Usuario.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocurrio un error obteniendo los datos."
        });
      });
  };

// Encontrar un solo dato con un ID
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Usuario.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "No se encontro el dato con el id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error al encontrar el dato con el id=" + id });
      });
  };

// Actualizar los datos de la base de datos.
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Los datos a actualizar no pueden estar vacios!"
      });
    }
  
    const id = req.params.id;
  
    Usuario.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `No se puede actualizar el dato con el id=${id}. Probablemente el dato no fue encontrado!`
          });
        } else res.send({ message: "Datos actualizados satisfactoriamente." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al actualizar el dato con el id=" + id
        });
      });
  };

// Eliminar un dato con un Id especifico
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Usuario.findByIdAndRemove(id)
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
exports.deleteAll = (req, res) => {
    Usuario.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Los datos fueron eliminados correctamente!`
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
exports.findAllPublished = (req, res) => {
    Usuario.find({ published: true })
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

  //Controlador de CRUD - Contiene las funciones del CRUD