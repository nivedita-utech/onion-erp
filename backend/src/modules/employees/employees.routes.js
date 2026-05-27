import express from 'express';
import { getOne, updateOne, deleteOne } from '../../utils/crudFactory.js';
import Employee from './employee.model.js';
import User from '../users/user.model.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import mongoose from 'mongoose';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

// List all employees with user population
router.get('/', protect, checkPermission('employees', 'read'), asyncHandler(async (req, res) => {
  const docs = await Employee.find({ isDeleted: false }).populate('user');
  res.status(200).json(ApiResponse.success('Retrieved all successfully', docs));
}));

// Get single employee
router.get('/:id', protect, checkPermission('employees', 'read'), getOne(Employee, { path: 'user' }));

// Custom creation: Create User then Employee
router.post('/', protect, checkPermission('employees', 'create'), asyncHandler(async (req, res) => {
  const { 
    name, email, password, role, 
    employeeId, designation, department, salary, joiningDate,
    phone, address 
  } = req.body;

  // 1. Validate required fields
  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'Name, email, password, and role are required for the user account');
  }

  // 2. Start session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Create User
    const user = await User.create([{
      name,
      email,
      password,
      role
    }], { session });

    // 4. Create Employee referencing User
    const employee = await Employee.create([{
      user: user[0]._id,
      employeeId,
      designation,
      department,
      joiningDate,
      personalInfo: {
        phone,
        address
      },
      salary
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // 5. Return populated employee
    const populated = await Employee.findById(employee[0]._id).populate('user');
    res.status(201).json(ApiResponse.success('Employee and User account created successfully', populated));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}));

// Standard CRUD
router.put('/:id', updateOne(Employee));
router.delete('/:id', deleteOne(Employee));

// Additional Features
router.post('/:id/attendance', asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id, 
    { $push: { attendanceLog: { date: new Date(), status: req.body.status } } },
    { new: true }
  );
  res.status(200).json(ApiResponse.success('Attendance marked', employee));
}));

router.get('/:id/salary', asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.status(200).json(ApiResponse.success('Salary history', { salary: employee.salary }));
}));

export default router;
