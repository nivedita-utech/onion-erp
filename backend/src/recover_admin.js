import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from './modules/roles/role.model.js';

dotenv.config();

const modules = [
  'dashboard', 'leads', 'customers', 'products', 'inventory', 
  'production', 'purchase', 'sales', 'export', 'accounts', 
  'reports', 'employees', 'notifications', 'settings'
];

const recover = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onion-erp');
    console.log('Connected to MongoDB');

    const superAdmin = await Role.findOne({ name: 'Super Admin' });
    
    if (!superAdmin) {
      console.log('Super Admin role not found. Please run seed script first.');
      process.exit(0);
    }

    const fullPermissions = modules.map(mod => ({
      module: mod,
      create: true,
      read: true,
      update: true,
      delete: true
    }));

    superAdmin.permissions = fullPermissions;
    await superAdmin.save();

    console.log('✅ Super Admin permissions restored successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during recovery:', err);
    process.exit(1);
  }
};

recover();
