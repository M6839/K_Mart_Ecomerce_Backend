const Product=require('../models/Product');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const addProduct = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;
    const image = req.file ? req.file.filename : '';

    const product = await Product.create({
      title,
      price,
      description,
      category,
      image,
      user: req.user._id,
    });

    res.status(200).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const Allproducts = await Product.find();

    if (!Allproducts || Allproducts.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({Allproducts});
  } catch (err) {
    console.error('Error in fetching products:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getProductByUser = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products added' });
    }

    res.status(200).json({ products });
  } catch (err) {
    console.error('Error in fetching products:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};


module.exports = {
  addProduct: [upload.single('image'), addProduct],
  getProductByUser,
  deleteProduct,
  getAllProducts
};
