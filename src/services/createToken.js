'use strict'

const jwt = require('jwt-simple')//Liberia para codificar y decodificar el token
const moment= require('moment')
const secret= '2a32**cB183<<bA1//2D3';

function createToken (user) {
    const payload={
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }
    return jwt.encode(payload,secret)
}; 

module.exports = {
    "createToken": createToken
};
