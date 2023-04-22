const jwt = require("jsonwebtoken")

let verifyToken= (req, res, next) => {

    let token = req.get('token');
    console.log(req.headers)
    jwt.verify(token, 'secret', (err, decoded) => {

        if(err) {
          return res.status(401).json({
            mensaje: 'Error de token',
            err
          })
        }
        req.usuario = decoded.data; 
        next();
    })
  
  }
  
let verifyRol = (req, res, next) => {

    let rol = req.usuario.role;
  
    console.log(rol);
    
    if(rol !== 'admin'){
      return res.status(401).json({
        mensaje: 'Rol no autorizado!'
      })
    }
    
    next();
  
  }

  module.exports = {verifyToken, verifyRol};