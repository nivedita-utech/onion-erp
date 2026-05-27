import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employeeId: { type: String, unique: true, sparse: true },
  designation: { type: String },
  personalInfo: {
    phone: String,
    address: String,
    dob: Date,
  },
  department: { type: String },
  salary: { type: Number },
  attendanceLog: [{
    date: Date,
    status: { type: String, enum: ['Present', 'Absent', 'Half-Day'] }
  }],
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
