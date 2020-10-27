const jwt = require('jwt-simple')
const moment= require('moment')
const secret= '2a--{32**cB1>>**[83]<<bA}1//2D3';


function isAuth (req,res,next) {
    if(!req.headers.authorization){
        return res.status(403).send({ message: "No tienes autorizacion para realizar esta operación"})
    }
    const token = req.headers.authorization.split(' ')[1]
    console.log('[*]Token aut:'+token)
    const payload = jwt.decode(token,secret)
    try {
        if(payload.exp < moment().unix()){
            return res.status(401).send({ message: 'Token expiro'})
        }    
    } catch (err) {
        return res.status(500).send({ message: 'Token invalido'})
    }
    
    req.user = payload.sub
    next()
}
module.exports = {
    "isAuth": isAuth
}