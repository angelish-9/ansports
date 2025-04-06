import express from 'express'
import { placeOrder ,placeOrderStripe, placeOrderRazorpay,allOrders,userOrders,updateStatus,verifyRazorpay } from '../controller/orderController.js'
import { verifyAdmin }  from '../middleware/adminAuth.js'

import  authUser from '../middleware/auth.js'
const orderRouter = express.Router()

//admin features for orders
orderRouter.post('/list',verifyAdmin, allOrders)
orderRouter.post('/status',verifyAdmin, updateStatus)

//Payment features
orderRouter.post('/place', authUser,placeOrder)
orderRouter.post('/stripe', authUser,placeOrderStripe)
orderRouter.post('/razorpay', authUser,placeOrderRazorpay)

//user features
orderRouter.post('/userorders',authUser, userOrders)

//verify razorpay
orderRouter.post('/verifyRazorpay',authUser, verifyRazorpay)
export default orderRouter
