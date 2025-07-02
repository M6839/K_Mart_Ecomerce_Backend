const cartController=require('../controllers/cartController')
const express=require('express')
const router=express.Router();
const { authenticateJWT} =require('../middlewares/authmiddleware')

router.post('/add', authenticateJWT,cartController.addItemToCart);
router.get('/',authenticateJWT,cartController.getItemByUserId);
router.patch('/update/:productId',authenticateJWT,cartController.IncrementOrDecrementItem)
router.delete('/item/:productId',authenticateJWT,cartController.deleteItem)
router.delete('/:userId/clear',cartController.clearCart)

module.exports=router;