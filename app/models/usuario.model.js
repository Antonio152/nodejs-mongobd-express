module.exports = mongoose => {  //Modelo de la base de datos 
  var schema = mongoose.Schema(
    {
      id_Alumno: String,
      foto: String,
      nombre: String,
      aPaterno: String,
      aMaterno: String,
      curp: String,
      numSos: String,
      sanguineo: String,
      calle: String,
      direccion: String,
      localidad: String,
      ciudad: String,
      estado: String,
      cp: String,
      published: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Usuario = mongoose.model("usuario", schema);
  return Usuario;
};