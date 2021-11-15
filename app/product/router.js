const router = require('express').Router();
const multer = require('multer');
const {cekUser} = require('../auth/middleware');

// (2) import product controller 
const productController = require('./controller'); 

router.get('/',productController.index)
router.post('/', multer().none(),cekUser(), productController.store);
router.put('/:id', multer().none(), productController.update);
router.delete('/:id', productController.destroy);

// (4) export router 
module.exports = router;