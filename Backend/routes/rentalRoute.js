import express from 'express';
import {
  createRental,
  getAllRentals,
  getMyRentals,
  updateRentalStatus,
  deleteRental,
  getAllRentedProduct,
} from '../controller/rentalController.js';
import { verifyAdmin } from "../middleware/adminAuth.js";
import authUser from '../middleware/auth.js'

const rentalRouter = express.Router();

rentalRouter.post('/create-rental', authUser, createRental);
rentalRouter.get('/all-rentals', getAllRentals);
rentalRouter.get('/all-rented-product', verifyAdmin, getAllRentedProduct);
rentalRouter.get('/my-rentals', authUser, getMyRentals);
rentalRouter.put('/:id/status', verifyAdmin, updateRentalStatus);
rentalRouter.delete('/remove-rental/:id', authUser, deleteRental);

export default rentalRouter;
