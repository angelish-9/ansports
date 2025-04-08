import express from 'express'
import upload from '../middleware/multer.js';
import { addProduct, listProduct, removeProduct, singleProduct, categoryProduct } from '../controller/productController.js';
import { verifyAdmin } from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post('/add', verifyAdmin, upload.single('image'), addProduct);
productRouter.post('/remove',verifyAdmin,removeProduct);
productRouter.get('/single/:productId', singleProduct);
productRouter.get('/list',listProduct);
productRouter.get('/list/:category',categoryProduct);

export default productRouter