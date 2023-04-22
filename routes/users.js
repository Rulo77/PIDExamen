const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const BankAccount = require('../conection/accountBankModel');
const User = require('../conection/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {verifyToken, verifyRol} = require("../middlewares/verifyToken");

/* GET users listing. */
router.get('/',verifyToken, function(req, res, next) {
   //res.json({menssaje: "entro"})
  res.render('users',{title:"user"});
});

  router.get('/clientes',verifyToken,verifyRol, async(req, res) => {
    try {
      const clientes = await BankAccount.find();
      //res.json(clientes);
      res.render('admin',{clientes})
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }

   });

   router.get('/cliente/:userName', verifyToken, async (req, res) => {
    const userName = req.params.userName;
    try {
      const cliente = await BankAccount.find({userName});
      res.json(cliente);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
   });

   router.put('/cliente/:operation', async (req, res) => {
    const operation = req.params.operation;
    let {quantity, userName} = req.body;
    console.log(operation)
    try {
      if(operation == "depositar"){
        const user = await BankAccount.findOne({userName});
        quantity = user.quantity + quantity;
      }
      else if(operation == "disponer"){
        const user = await BankAccount.findOne({userName});
        quantity = user.quantity - quantity;
      }
     
      const user = await BankAccount.findOneAndUpdate({userName}, {quantity}, {new: true});
      res.json(user);  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  })


router.post('/register',async (req,res)=>{
  try {
  const body = {
    userName: req.body.userName,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, saltRounds)
  };

 
    const user= await User.findOne({userName:body.userName});
    if(user != null){
      res.json({mensaje:"Este usuario ya existe"});
    }else{
    const newUser = await User.create(body);
    if(body.role == 'cliente'){
      const newAccount = await BankAccount.create({
        userName:body.userName, quantity: 0  });
       console.log(newAccount);
    }
    res.status(200).json(newUser); 
    }
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }

});


router.post('/login', async(req, res) => {
  const {userName, password}= req.body;
  try {
  const user= await User.findOne({userName:userName});
  if(user != null){
    if( !bcrypt.compareSync(password, user.password) ){
      return res.status(400).json({mensaje: 'Usuario o contraseña! inválidos'});
    }

    let token = jwt.sign({
      data: {
        userName: user.userName, 
        role:user.role
      }
    }, 'secret', { expiresIn: 60 * 60 * 24 * 5}) // Expira en 5 días
    
    // // Pasó las validaciones
    // return res.json({
    //   user,
    //   token: token
    // })
    
    if(user.role == "admin"){
     res.setHeader('token',token)
      res.redirect("/users/clientes")
    }else{

      res.redirect("/users")
    }
    //res.json({mensaje:"entro"});
  }else{
    res.json({mensaje:"usuario no registrado"})
  }

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }

 });


module.exports = router;
