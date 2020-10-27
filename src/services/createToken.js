'use strict'

const jwt = require('jwt-simple')//Liberia para codificar y decodificar el token
const moment= require('moment')
const secret= '2a--{32**cB1>>**[83]<<bA}1//2D3';

function createToken (user) {
    const payload={
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    }
    return jwt.encode(payload,secret)
}; 

module.exports = {
    "createToken": createToken
};
