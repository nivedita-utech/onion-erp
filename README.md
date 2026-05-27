# Onion Powder Export-Import CRM + ERP

A full-stack enterprise-grade CRM and ERP solution built completely from scratch using the MERN stack (MongoDB, Express.js, React, Node.js). Tailor-made for an Onion Powder Export-Import Business to manage everything from Production to Export Logistics.

## 🚀 Features

- **RBAC Authentication:** Role-based access control (Super Admin, Manager, etc.) protecting both frontend routes and backend APIs.
- **Leads & Customers:** Full CRM pipeline converting promising leads to paying customers.
- **Production & Inventory:** Track raw Onion processing to Powder Granules/Flakes, logging batch expiry details and quantity movements.
- **Purchase & Sales:** Create Supplier POs, manage Customer Quotations to Sales Orders, and issue Invoices.
- **Export Management:** Specialized module tracking Container/BL data, multi-currency invoices, and FOB/CIF arrangements.
- **Docs & Audits:** Attach documents (PDF/Images) directly to specific DB entities. Every change is logged for high compliance.
- **Interactive Reports:** Dynamic analytics dashboard utilizing Recharts.

---

## 🏗️ Folder Structure

```
onion-erp/
│
├── backend/                  # Server / API Logic
│   ├── src/
│   │   ├── config/           # Database, multer configuration
│   │   ├── middleware/       # Auth (JWT), RBAC, Error, Logger, Rate-limiting
│   │   ├── modules/          # Domain-driven backend design (Controllers, Models, Routes)
│   │   ├── utils/            # Helper classes (ApiResponse, ApiError, crudFactory)
│   │   └── seeds/            # Initial DB population script
│   └── .env                  # Backend secrets
│
└── frontend/                 # Client UI
    ├── src/
    │   ├── api/              # Redux RTK Query endpoints
    │   ├── components/       # Reusable UI (Modals, Dropzones, Breadcrumbs, Charts)
    │   ├── hooks/            # useAuth, usePermission
    │   ├── layouts/          # Auth & Dashboard layouts (Sidebar navigation)
    │   ├── pages/            # Feature-specific pages (CRM, Products, Inventory, etc.)
    │   └── store/            # Global Redux state management
    └── tailwind.config.js    # Global styling tokens
```

---

## 🔒 Role Permission Table

| Role | Description | Key Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | System Owner | Full CRUD across every single module. Views Audit Logs and globally alters roles. |
| **Manager** | Operations Lead | Can update orders, track shipments, modify leads but cannot delete core configurations. |
| **Employee** | Daily staff | View-only dashboard rights with task fulfillment. |
| **Accountant** | Finances | Manage Receivables/Payables, Invoices. |
| **Sales Exec** | Frontline CRM | Add/Convert Leads, Create Quotations, View Products. |
| **Purchase Mgr** | Buy-side Ops | Manage robust Supplier relations and Purchase Orders/GRNs. |
| **Warehouse Mgr** | Stocking | Create and track batches, issue inventory adjustments. |
| **Export Mgr** | Shipping | Manage international shipment states, logs, and document packages. |

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Atlas or local MongoDB instance installed and active.

### 1. Installation

Clone or extract the repository, then install dependencies for both sides.

```bash
# In the root folder if you use concurrently, otherwise open two terminals:

# Terminal 1 - Backend
cd backend
npm install

# Terminal 2 - Frontend
cd frontend
npm install
```

### 2. Environment Setup

Create `.env` inside the `/backend` folder:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/onion-erp

# Auth JWT Config
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=7

# Files
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 3. Bootstrap Database

To prepopulate the system with valid super-admin credentials, basic roles, and demo products (Crucial for first login):

```bash
cd backend
npm run seed
```

### 4. Run the Dev Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The app will be accessible at [http://localhost:5173/](http://localhost:5173/)

---

## 📡 API Documentation Overview

The backend uses a standard RESTful architecture. Most resources utilize a generic factory mapped to `GET`, `POST`, `PUT`, `DELETE` operations underneath the `/api` prefix. Responses strictly adhere to an `ApiResponse` wrapper `{ success, message, data, pagination }`.

**Core Endpoints:**
- `POST /api/auth/login` - Generates JWT Cookie + payload.
- `GET /api/inventory/stock/all` - Custom retrieval of all active warehouse batches.
- `PUT /api/leads/:id/convert` - Auto-migrates CRM leads into paying Customers.
- `POST /api/documents` - Centralized Multer sink parsing multipart-forms to associate PDFs with MongoDB IDs.

Enjoy maintaining your enterprise ecosystem! 🚀
