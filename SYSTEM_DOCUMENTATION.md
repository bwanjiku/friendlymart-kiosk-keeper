
# FriendlyMart Supermarket Management System

## Table of Contents
1. [System Overview](#system-overview)
2. [Features](#features)
3. [Installation & Setup](#installation--setup)
4. [User Guide](#user-guide)
5. [Technical Documentation](#technical-documentation)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Troubleshooting](#troubleshooting)

## System Overview

FriendlyMart is a comprehensive supermarket management system built with React, TypeScript, and modern web technologies. It provides complete functionality for managing inventory, suppliers, customers, sales, and generating detailed reports.

### Key Technologies
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Context API, TanStack React Query
- **Routing**: React Router DOM
- **Data Storage**: Local Storage (can be extended to Supabase)
- **Icons**: Lucide React
- **Charts**: Recharts

## Features

### 🔐 Authentication System
- Secure login/logout functionality
- Password reset via email simulation
- Protected routes for authenticated users
- Default admin credentials: `admin` / `admin`

### 📊 Dashboard
- Real-time statistics overview
- Low stock alerts
- Recent sales transactions
- Key performance indicators (KPIs)

### 📦 Inventory Management
- Add, view, and manage products
- Stock level monitoring
- Low stock alerts with visual badges
- Product categorization
- Supplier tracking per product

### 👥 Supplier Management
- Supplier contact information
- Product-supplier relationships
- Search and filter capabilities
- Add new suppliers

### 👤 Customer Management
- Customer database
- Purchase history tracking
- Customer analytics

### 💰 Sales Management
- Point of sale functionality
- Transaction recording
- Sales history

### 📈 Reports & Analytics
- Date range filtering
- Sales reports in KSH currency
- Export capabilities
- Visual charts and graphs

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Quick Start
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd friendlymart-system

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
No additional environment variables are required for local development. The system uses localStorage for data persistence.

## User Guide

### Getting Started
1. Open the application in your browser
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin`
3. You'll be redirected to the dashboard

### Managing Inventory
1. Navigate to **Inventory** from the sidebar
2. Click **Add Product** to add new items
3. Fill in product details:
   - Product name
   - Category
   - Price (in KSH)
   - Current stock
   - Minimum stock level
   - Supplier

### Managing Suppliers
1. Go to **Suppliers** section
2. Click **Add Supplier** to register new suppliers
3. Provide supplier information:
   - Company name
   - Contact number
   - Email address
   - Physical address
   - Products supplied

### Generating Reports
1. Visit the **Reports** section
2. Select date range using the calendar picker
3. Click **Generate Report** to filter data
4. View sales analytics and charts
5. All currency is displayed in KSH

### Password Recovery
1. Click **Forgot Password** on login page
2. Enter your email address
3. Check console for simulated email (in production, real emails would be sent)
4. Use the reset link to create a new password

## Technical Documentation

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Layout.tsx      # Main layout wrapper
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Inventory.tsx
│   ├── Suppliers.tsx
│   ├── Customers.tsx
│   ├── Sales.tsx
│   ├── Reports.tsx
│   ├── Login.tsx
│   ├── ForgotPassword.tsx
│   └── ResetPassword.tsx
├── utils/              # Utility functions
│   ├── database.ts     # Local database operations
│   └── emailService.ts # Email simulation
├── hooks/              # Custom React hooks
└── lib/                # Library configurations
```

### State Management
The application uses React Context for global state management:
- **AuthContext**: Manages user authentication state
- **Local Storage**: Persists data between sessions

### Component Architecture
- **Layout**: Provides consistent navigation and header
- **Protected Routes**: Ensures authentication before accessing pages
- **Responsive Design**: Mobile-first approach using Tailwind CSS

## Database Schema

### Local Storage Structure

#### Users Collection
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In production, this should be hashed
}
```

#### Products Collection
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
}
```

#### Suppliers Collection
```typescript
interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  products: string[];
}
```

#### Sales Collection
```typescript
interface Sale {
  id: string;
  date: string;
  customer: string;
  amount: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}
```

## API Documentation

### Authentication APIs

#### Login
```typescript
login(username: string, password: string): Promise<boolean>
```

#### Logout
```typescript
logout(): void
```

### Database Operations

#### Products
```typescript
// Get all products
db.getProducts(): Product[]

// Add new product
db.addProduct(product: Product): void

// Update product
db.updateProduct(id: string, product: Partial<Product>): void
```

#### Suppliers
```typescript
// Get all suppliers
db.getSuppliers(): Supplier[]

// Add new supplier
db.addSupplier(supplier: Supplier): void
```

## Troubleshooting

### Common Issues

#### Login Problems
- **Issue**: Cannot login with credentials
- **Solution**: Use default credentials `admin`/`admin` or check localStorage for user data

#### Data Not Persisting
- **Issue**: Data disappears after refresh
- **Solution**: Check browser's localStorage permissions and ensure localStorage is enabled

#### Build Errors
- **Issue**: TypeScript compilation errors
- **Solution**: Run `npm install` to ensure all dependencies are installed

#### Styling Issues
- **Issue**: UI components not displaying correctly
- **Solution**: Ensure Tailwind CSS is properly configured and all shadcn/ui components are installed

### Performance Optimization
- The system stores data in localStorage for quick access
- Consider implementing pagination for large datasets
- Use React.memo for expensive component renders
- Implement virtual scrolling for large tables

### Security Considerations
- Passwords are stored in plain text (development only)
- For production, implement proper password hashing
- Add input validation and sanitization
- Implement proper session management
- Use HTTPS in production

### Future Enhancements
- Integration with Supabase for real backend
- Real email service integration
- Barcode scanning functionality
- Multi-location support
- Advanced reporting features
- Mobile app version

## Support

For technical support or questions about the system, please refer to the codebase documentation or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2025-07-03  
**Developed with**: React, TypeScript, Tailwind CSS
