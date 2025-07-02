const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, getAdminOrders } = require('../controllers/orderController');
const { authenticateJWT,isAdmin} = require('../middlewares/authmiddleware');

router.post('/place', authenticateJWT, placeOrder);
router.get('/my-orders', authenticateJWT, getUserOrders);
router.get('/admin-orders',authenticateJWT,isAdmin,getAdminOrders)

module.exports = router;
