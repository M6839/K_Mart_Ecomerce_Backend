const productController=require('../controllers/productController');
const { authenticateJWT, isAdmin } = require('../middlewares/authmiddleware');
const express=require('express')
const router=express.Router()

router.post('/add-product',authenticateJWT,isAdmin,productController.addProduct);

router.get('/uploads/:imageName',authenticateJWT,isAdmin, (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.get('/all-products',authenticateJWT,isAdmin,productController.getProductByUser)
router.delete('/delete/:id',authenticateJWT,isAdmin,productController.deleteProduct)
router.get('/',productController.getAllProducts)
module.exports=router