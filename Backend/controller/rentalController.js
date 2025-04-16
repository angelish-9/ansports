import { rentalModel } from '../models/rentalModel.js';
import { productModel } from '../models/productModel.js';

const createRental = async (req, res) => {
  try {

    const { productId, days, totalPrice } = req.body;

    if (!productId || !days || !totalPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const rental = new rentalModel({
      userId: req.user._id,
      productId,
      days,
      totalPrice,
    });

    await rental.save();
    res.status(201).json({ message: 'Rental created', rental });
  } catch (err) {
    console.error('Rental Creation Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllRentals = async (req, res) => {
  try {
    const products = await productModel.find({ canRent: true });  // Fetch products with canRent set to true
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching rental products.' });
  }
};

const getMyRentals = async (req, res) => {
  try {
    const rentals = await rentalModel.find({ userId: req.user._id }).populate('productId', 'name price');

    res.status(200).json({ rentals });
  } catch (err) {
    console.error('User Rentals Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const rental = await rentalModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId productId');

    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    res.status(200).json({ message: 'Status updated', rental });
  } catch (err) {
    console.error('Update Status Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRental = async (req, res) => {
  try {
    const rental = await rentalModel.findByIdAndDelete(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.status(200).json({ message: 'Rental deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete rental', error: err.message });
  }
};


const getAllRentedProduct = async (req, res) => {
  try {
    const rentals = await rentalModel.find().populate('productId').populate("userId", "name email");
    res.status(200).json({ rentals });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rentals', error: err });
  }
};


export {
  createRental,
  getAllRentals,
  getMyRentals,
  updateRentalStatus,
  deleteRental,
  getAllRentedProduct,
};
