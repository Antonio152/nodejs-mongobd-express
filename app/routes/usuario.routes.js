module.exports = app => {
    const usuarios = require("../controllers/usuarios.controller.js");
  
    var router = require("express").Router();
  
    // Crear un nuevo registro
    router.post("/", usuarios.create);
  
    // Encontrar todos los registros
    router.get("/", usuarios.findAll);
  
    // Consultar todos los registros publicados.
    router.get("/published", usuarios.findAllPublished);
  
    // Consultar un dato con un ID
    router.get("/:id", usuarios.findOne);
  
    // Actualizar un dato con su ID
    router.put("/:id", usuarios.update);
  
    // Eliminar un dato con su ID
    router.delete("/:id", usuarios.delete);
  
    // Eliminar todos los datos de la BD
    router.delete("/", usuarios.deleteAll);
    // Ruta que se encarga de llamar todas las funciones
    app.use('/api/usuarios', router);
  };