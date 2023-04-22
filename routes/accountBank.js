var express = require('express');
var router = express.Router();
const Account = require('../conection/accountBankModel')

/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});

router.post('/newAccount',async (req,res)=>{
  const body = req.body;  
  try {
    const newUser = await User.create(body);
    res.status(200).json(newUser); 
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }

})

module.exports = router;
