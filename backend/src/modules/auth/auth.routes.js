import express from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import User from '../users/user.model.js';
import jwt from 'jsonwebtoken';
import ApiError from '../../utils/ApiError.js';

import { validate } from '../../middleware/validate.js';
import { loginSchema } from './auth.validation.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password').populate('role');
  
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }
  
  if (!user.isActive) {
    throw new ApiError(401, 'Your account is deactivated');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });

  res.status(200).json(ApiResponse.success('Logged in successfully', {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  }));
}));

router.post('/logout', asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json(ApiResponse.success('Logged out successfully', {}));
}));

import { protect } from '../../middleware/auth.js';

router.get('/me', protect, asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('User profile', req.user));
}));

export default router;
