// routes/orderRoutes.js
import express from 'express';
import { 
    createCustomer,
    createOrder,
    updateOrderStatus,
    getAllOrders, } from '../controllers/InventoryControl/OrderController.js';

import { isAuthenticated } from '../middlewares/authMiddelware.js';

const router = express.Router();

router.post('/customers', isAuthenticated, createCustomer);
router.post('', isAuthenticated, createOrder);
router.put('/:id/status', isAuthenticated, updateOrderStatus);
router.get('', isAuthenticated, getAllOrders);

export default router;
