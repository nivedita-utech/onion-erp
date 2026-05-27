import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/logger.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import roleRoutes from './modules/roles/roles.routes.js';
import employeeRoutes from './modules/employees/employees.routes.js';
import leadRoutes from './modules/leads/leads.routes.js';
import customerRoutes from './modules/customers/customers.routes.js';
import productRoutes from './modules/products/products.routes.js';
import inventoryRoutes from './modules/inventory/inventory.routes.js';
import productionRoutes from './modules/production/production.routes.js';
import purchaseRoutes from './modules/purchase/purchase.routes.js';
import salesRoutes from './modules/sales/sales.routes.js';
import exportRoutes from './modules/export/export.routes.js';
import accountRoutes from './modules/accounts/accounts.routes.js';
import reportRoutes from './modules/reports/reports.routes.js';
import notificationRoutes from './modules/notifications/notifications.routes.js';
import documentRoutes from './modules/documents/documents.routes.js';
import auditRoutes from './modules/audit/audit.routes.js';
import qualityRoutes from './modules/quality/quality.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Security Middleware ──────────────────────────
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : false)
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// ─── Body Parsers ──────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// ─── Logging ───────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(requestLogger);

// ─── Rate Limiting ─────────────────────────────────
app.use('/api', apiLimiter);

// ─── Static Files ──────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── API Routes ────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/quality', qualityRoutes);

// ─── Health Check ──────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Onion ERP API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── 404 Handler ───────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ─── Error Handler ─────────────────────────────────
app.use(errorHandler);

export default app;
