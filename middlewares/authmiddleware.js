const jwt=require('jsonwebtoken')
const User =require('../models/userRegister')
const dotenv=require('dotenv');
dotenv.config();
//Middleware to authenticate JWT
 const authenticateJWT = async(req, res, next) => {
 const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.whatismyname);
    req.user = await User.findById(decoded._id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Admins only' });
};

module.exports = { authenticateJWT, isAdmin };