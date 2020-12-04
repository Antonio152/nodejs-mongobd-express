const cardController = {}
// Libraries
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const moment = require('moment');
const mongoose = require('mongoose');
// Models
const CardsModel = require('../models/CardsModel');
const User = require('../models/User');

// this sentence heps us to transform string objects to hbs based readable objects
const hbs = allowInsecurePrototypeAccess(handlebars);

// This is actually a post request
cardController.getCard = async (req, res) => {
  // EL QUE SE ENCARGUE DE EDITARLO, BUSQUE LA FORMA DE DIVIDIR TODO ESTE DESMADRE
//----------------------------------------------------------------------------------------------
    var arrIds = [];
    //CONSULTAMOS EL REGISTRO DE LA BD
    const query = req.body.formato.toString();
    // Getting card's data from database
    const content = await CardsModel.findOne({"nombreCredencial": `${query}`})
      .then(data => {
        if (!data) console.log("Data no encontrada");
        else console.log("Exito al obtener la data");
        return data;
      })
      .catch(err => console.log("Error Consulta: "+err));
    // Transforming ids to mongoose readable id objects
    req.body.usuarios.forEach(idUser => 
      arrIds.push(mongoose.Types.ObjectId(idUser))
    );//----------------------------------------------------------------------------------------------
    // find users by id
    const users = await User.find({'_id': { $in: arrIds }});
    // Data from server
    const data = {usuarios: users, formato: req.body.formato};
    // Append the card's data to the user's format data
    data.formato = {nombre: req.body.formato};
    const tamanio= users.length;
    //Ingresamos el contenido dentro de cada usuario
    for (let step = 0; step < tamanio; step++) {
        data.usuarios[step].contenido=content.contenido;
        data.usuarios[step].firmas=content.firmas;
        data.usuarios[step].logos=content.logos;
        data.usuarios[step].contAd=content.contAd;
    }
//----------------------------------------------------------------------------------------------
    //console.log(data.usuarios);
    // Tools for puppeteer to know what to do
    const compile = async (templateName,data) => {
        // Concat the file path of the handlebar
        const filePath = path.join(process.cwd(), 'src', 'layouts', `${templateName}.handlebars`);
        // Defining html
        const html = await fs.readFile(filePath, 'utf-8');
        // What to compile
        return hbs.compile(html)(data,{allowedProtoProperties:{trim:true}});
    };
    // For date format
    hbs.registerHelper('dateFormat', (value, format) => {
        console.log('formatting', value, format);
        return moment(value).format(format);
    });

    hbs.registerHelper('ifIsNthItem', function(options) {
        var index = options.data.index + 1,
            nth = options.hash.nth;
      
        if (index % nth === 0) 
          return options.fn(this);
        else
          return options.inverse(this);
      });

    try {
        // Initialize puppeteer and the page
        const browser = await puppeteer.launch({
                headless:true,
                args: ["--no-sandbox",'--disable-setuid-sandbox']
            });
        const page = await browser.newPage();
        // NAME OF THE HANDLEBAR FILE AND IT'S DATA
        const content = await compile(data.formato.nombre,data);
//----------------------------------------------------------------------------------------------
        await page.setContent(content);
        await page.emulateMediaFeatures('screen'); //For images
        // How does the pdf will be developed
        const pdf = await page.pdf({
            landscape: true,
            format: 'letter',
            printBackground: true
        });
        // Converting to base 64
        base64 = pdf.toString('base64');
        // End puppeteer actions
        await browser.close();
        // Server's response
        res.json({
            pdf: base64
        })
//----------------------------------------------------------------------------------------------
    } catch (error) {
        res.json({
            msg: error.toString()
        })
    }
}

module.exports = cardController;