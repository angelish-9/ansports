import express from 'express'
import { addToCart, getCart, removeFromCart, updateCart } from '../controller/cartController.js'
const cartRouter = express.Router()
import authUser from '../middleware/auth.js'

cartRouter.post('/get',authUser,getCart)
cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/remove', authUser, removeFromCart)
cartRouter.post('/update',authUser,updateCart)

export default cartRouter