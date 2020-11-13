const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    SchemaVersion: {
        type:String,
        default:"1.0"
    },
    nombreCredencial:String,
    contenido: [{
        imagenFront:String,
        imagenBack:String
    }],
    firmas:[{
        firmaDirectivo:String,
        otraFirma:String
    }],
    logos:[{
        institucion:String,
        sep:String
    }],
    contAd:[{
        periodosEscolares:String
    }],
    published: Boolean
    }, { 
    timestamps: true 
});

module.exports = model('CardsModel', userSchema);