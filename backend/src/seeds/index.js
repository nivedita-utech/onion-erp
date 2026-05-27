import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../modules/users/user.model.js';
import Role from '../modules/roles/role.model.js';
import Company from '../modules/settings/company.model.js';
import Product from '../modules/products/product.model.js';
import QualityProfile from '../modules/quality/qualityProfile.model.js';
import ProductionBatch from '../modules/production/productionBatch.model.js';
import bcrypt from 'bcryptjs';
import dns from 'dns';

// Fix for querySrv ECONNREFUSED from local ISP DNS
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.error("DNS Error: ", e);
}

dotenv.config();

const seedDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    // Clean DB
    await User.deleteMany();
    await Role.deleteMany();
    await Company.deleteMany();
    await Product.deleteMany();
    await QualityProfile.deleteMany();
    await ProductionBatch.deleteMany();

    // 1. Roles & Permissions Matrix
    const moduleList = [
      'dashboard', 'products', 'customers', 'leads', 'purchase', 'production', 
      'inventory', 'sales', 'export', 'accounts', 'employees', 'reports', 'notifications', 'settings', 'quality'
    ];

    const roleDefinitions = [
      {
        name: 'Super Admin',
        slug: 'super_admin',
        perms: moduleList.map(m => ({ module: m, create: true, read: true, update: true, delete: true }))
      },
      {
        name: 'Admin',
        slug: 'admin',
        perms: moduleList.map(m => ({ 
          module: m, 
          create: true, 
          read: true, 
          update: true, 
          delete: m === 'accounts' || m === 'employees' ? false : true 
        }))
      },
      {
        name: 'Sales Manager',
        slug: 'sales_manager',
        perms: [
          { module: 'dashboard', read: true },
          { module: 'products', read: true },
          { module: 'customers', create: true, read: true, update: true, delete: true },
          { module: 'leads', create: true, read: true, update: true, delete: true },
          { module: 'inventory', read: true },
          { module: 'sales', create: true, read: true, update: true, delete: true },
          { module: 'export', create: true, read: true, update: true, delete: true },
          { module: 'accounts', read: true },
          { module: 'reports', read: true },
          { module: 'notifications', read: true },
        ]
      },
      {
        name: 'Sales Executive',
        slug: 'sales_executive',
        perms: [
          { module: 'dashboard', read: true },
          { module: 'products', read: true },
          { module: 'customers', create: true, read: true, update: true },
          { module: 'leads', create: true, read: true, update: true, delete: true },
          { module: 'inventory', read: true },
          { module: 'sales', create: true, read: true, update: true },
          { module: 'export', create: true, read: true, update: true },
          { module: 'reports', read: true },
          { module: 'notifications', read: true },
        ]
      },
      {
        name: 'Production Manager',
        slug: 'production_manager',
        perms: [
          { module: 'dashboard', read: true },
          { module: 'products', read: true },
          { module: 'purchase', read: true },
          { module: 'production', create: true, read: true, update: true, delete: true },
          { module: 'inventory', create: true, read: true, update: true },
          { module: 'reports', read: true },
          { module: 'notifications', read: true },
        ]
      },
      {
        name: 'Production Worker',
        slug: 'production_worker',
        perms: [
          { module: 'dashboard', read: true },
          { module: 'products', read: true },
          { module: 'production', read: true, update: true },
          { module: 'inventory', read: true },
          { module: 'notifications', read: true },
        ]
      },
      {
        name: 'Warehouse Manager',
        slug: 'warehouse_manager',
        perms: [
          { module: 'dashboard', read: true },
          { module: 'products', read: true },
          { module: 'purchase', read: true, update: true },
          { module: 'production', read: true },
          { module: 'inventory', create: true, read: true, update: true, delete: true },
          { module: 'sales', read: true },
          { module: 'export', read: true },
          { module: 'reports', read: true },
          { module: 'notifications', read: true },
        ]
      },
      {
        name: 'Accountant',
        slug: 'accountant',
        perms: [
          { module: 'dashboard', read: true },
          { module: 'products', read: true },
          { module: 'customers', read: true },
          { module: 'purchase', read: true },
          { module: 'sales', read: true },
          { module: 'export', read: true },
          { module: 'accounts', create: true, read: true, update: true, delete: true },
          { module: 'reports', create: true, read: true, update: true, delete: true },
          { module: 'notifications', read: true },
        ]
      },
      {
        name: 'HR Manager',
        slug: 'hr_manager',
        perms: [
          { module: 'dashboard', read: true },
          { module: 'accounts', read: true },
          { module: 'employees', create: true, read: true, update: true, delete: true },
          { module: 'reports', read: true },
          { module: 'notifications', read: true },
          { module: 'settings', read: true },
        ]
      },
      {
        name: 'Export Manager',
        slug: 'export_manager',
        perms: [
          { module: 'dashboard', read: true },
          { module: 'products', read: true },
          { module: 'customers', create: true, read: true, update: true },
          { module: 'leads', create: true, read: true, update: true },
          { module: 'inventory', read: true },
          { module: 'sales', read: true },
          { module: 'export', create: true, read: true, update: true, delete: true },
          { module: 'accounts', read: true },
          { module: 'reports', read: true },
          { module: 'notifications', read: true },
        ]
      },
      {
        name: 'Purchase Manager',
        slug: 'purchase_manager',
        perms: [
          { module: 'dashboard', read: true },
          { module: 'products', read: true },
          { module: 'purchase', create: true, read: true, update: true, delete: true },
          { module: 'inventory', create: true, read: true, update: true },
          { module: 'accounts', read: true },
          { module: 'reports', read: true },
          { module: 'notifications', read: true },
        ]
      },
      {
        name: 'Auditor',
        slug: 'viewer',
        perms: moduleList.map(m => ({ module: m, read: true }))
      }
    ];

    const roles = {};
    for (const rd of roleDefinitions) {
      roles[rd.slug] = await Role.create({
        name: rd.slug,
        permissions: rd.perms.map(p => ({
          module: p.module,
          create: p.create || false,
          read: p.read || false,
          update: p.update || false,
          delete: p.delete || false
        }))
      });
    }

    // 2. Company
    const company = await Company.create({
      name: 'Onion Powder Exports Ltd.',
      gstNo: '27AABCU9603R1ZM',
      iecCode: '0310000000',
      address: 'Mumbai, India',
    });

    // 3. Test Users
    const usersToCreate = [
      { name: 'Super Admin', email: '', role: 'super_admin' },
      { name: 'Sales Manager', email: 'sales@onionerp.com', role: 'sales_manager' },
      { name: 'Production Head', email: 'production@onionerp.com', role: 'production_manager' },
      { name: 'Warehouse Lead', email: 'warehouse@onionerp.com', role: 'warehouse_manager' },
      { name: 'Accountant', email: 'accounts@onionerp.com', role: 'accountant' },
      { name: 'HR Head', email: 'hr@onionerp.com', role: 'hr_manager' },
      { name: 'Purchase Head', email: 'purchase@onionerp.com', role: 'purchase_manager' },
      { name: 'Auditor', email: 'viewer@onionerp.com', role: 'viewer' }
    ];

    for (const u of usersToCreate) {
      await User.create({
        ...u,
        password: 'password123',
        role: roles[u.role]._id,
        company: company._id,
        isActive: true
      });
    }

    // 4. Products
    const products = [
      { name: 'Onion Powder Premium', sku: 'OP-PREM-100', category: 'Powder', grade: 'A', unit: 'kg', domesticPrice: 280, exportPrices: [{ currency: 'USD', price: 3.5 }] },
      { name: 'Dehydrated Onion Flakes', sku: 'DO-FLK-100', category: 'Flakes', grade: 'A', unit: 'kg', domesticPrice: 350, exportPrices: [{ currency: 'USD', price: 4.2 }] },
      { name: 'Onion Granules', sku: 'OG-GRN-100', category: 'Granules', grade: 'A', unit: 'kg', domesticPrice: 300, exportPrices: [{ currency: 'USD', price: 3.8 }] }
    ];
    await Product.insertMany(products);

    // 5. Quality Profiles
    const qualityProfiles = [
      {
        name: 'Premium Grade Profile',
        productGrade: 'A',
        isDefault: true,
        parameters: [
          { name: 'Moisture Content', unit: '%', min: 4, max: 6 },
          { name: 'Total Ash', unit: '%', min: 0, max: 5 },
          { name: 'Acid Insoluble Ash', unit: '%', min: 0, max: 0.5 },
          { name: 'Sieve Retention (Mesh 100)', unit: '%', min: 0, max: 1 }
        ],
        microbialSpecs: [
          { name: 'Total Plate Count (TPC)', limit: '< 50,000 cfu/g' },
          { name: 'Yeast & Mold', limit: '< 100 cfu/g' },
          { name: 'Salmonella', limit: 'Absent in 25g' },
          { name: 'E. Coli', limit: 'Absent in 1g' }
        ]
      },
      {
        name: 'Standard Grade Profile',
        productGrade: 'B',
        parameters: [
          { name: 'Moisture Content', unit: '%', min: 6, max: 8 },
          { name: 'Total Ash', unit: '%', min: 0, max: 7 }
        ],
        microbialSpecs: [
          { name: 'Total Plate Count (TPC)', limit: '< 100,000 cfu/g' }
        ]
      }
    ];
    const profiles = await QualityProfile.insertMany(qualityProfiles);
    const premiumProfile = profiles[0];

    // 6. Production Batches
    const prodProducts = await Product.find({ name: 'Onion Powder Premium' });
    const p1 = prodProducts[0];

    const batches = [
      {
        batchId: 'BAT-2024-001',
        product: p1._id,
        rawMaterialProduct: p1._id, // Just for seeding
        rawMaterialQty: 1000,
        outputQty: 950,
        wastage: 5,
        status: 'Completed',
        qualityStatus: 'Pending',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        batchId: 'BAT-2024-002',
        product: p1._id,
        rawMaterialProduct: p1._id,
        rawMaterialQty: 500,
        status: 'Ongoing',
        qualityStatus: 'Pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    await ProductionBatch.insertMany(batches);

    console.log('Database seeded successfully! (Batches & RBAC Enabled)');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
