const cardController = {}
// Libraries
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const moment = require('moment');
// This is actually a post request
cardController.getCard = async (req, res) => {
    // Storage data from the request
    const data = req.body;
    // Tools for puppeteer to know what to do
    const compile = async (templateName, data) => {
        // Concat the file path of the handlebar
        const filePath = path.join(process.cwd(), 'src', 'layouts', `${templateName}.handlebars`);
        // Defining html
        const html = await fs.readFile(filePath, 'utf-8');
        // What to compile
        return hbs.compile(html)(data);
    };
    // For date format
    hbs.registerHelper('dateFormat', (value, format) => {
        console.log('formatting', value, format);
        return moment(value).format(format);
    });

    try {
        // Initialize puppeteer and the page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // NAME OF THE HANDLEBAR FILE AND IT'S DATA
        const content = await compile(data.formato, data);

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

    } catch (error) {
        res.json({
            msg: error
        })
    }
}

module.exports = cardController;