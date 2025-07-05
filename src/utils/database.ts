
// Local database simulation using localStorage
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  supplier: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  purchases: number;
  totalSpent: number;
  lastVisit: string;
}

export interface Sale {
  id: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  customer: string;
  date: string;
}

export interface Purchase {
  id: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  supplier: string;
  total: number;
  date: string;
  invoiceNumber: string;
}

class LocalDatabase {
  private static instance: LocalDatabase;

  private constructor() {
    this.initializeDefaultData();
  }

  static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  private initializeDefaultData() {
    // Initialize default admin user if not exists
    const users = this.getUsers();
    if (users.length === 0) {
      this.createUser({
        id: '1',
        username: 'admin',
        email: 'admin@friendlymartsupermarket.com',
        password: 'admin'
      });
    }

    // Initialize sample products
    const products = this.getProducts();
    if (products.length === 0) {
      const sampleProducts = [
        { id: '1', name: 'Milk 1L', price: 120, stock: 45, category: 'Dairy', supplier: 'Fresh Farms' },
        { id: '2', name: 'Bread Loaf', price: 80, stock: 22, category: 'Bakery', supplier: 'Local Bakery' },
        { id: '3', name: 'Rice 2kg', price: 250, stock: 32, category: 'Grains', supplier: 'Rice Millers Co' },
        { id: '4', name: 'Cooking Oil 1L', price: 180, stock: 15, category: 'Oils', supplier: 'Oil Producers' },
        { id: '5', name: 'Sugar 1kg', price: 150, stock: 40, category: 'Sweeteners', supplier: 'Sugar Works' },
        { id: '6', name: 'Eggs (12pcs)', price: 200, stock: 28, category: 'Dairy', supplier: 'Farm Fresh' },
        { id: '7', name: 'Tomatoes 1kg', price: 100, stock: 35, category: 'Vegetables', supplier: 'Garden Fresh' },
        { id: '8', name: 'Onions 1kg', price: 80, stock: 42, category: 'Vegetables', supplier: 'Garden Fresh' },
      ];
      localStorage.setItem('products', JSON.stringify(sampleProducts));
    }

    // Initialize sample customers with recent dates
    const customers = this.getCustomers();
    if (customers.length === 0) {
      const sampleCustomers = [
        { id: '1', name: 'John Doe', email: 'john@email.com', phone: '123-456-7890', purchases: 15, totalSpent: 299.99, lastVisit: '2025-06-15' },
        { id: '2', name: 'Jane Smith', email: 'jane@email.com', phone: '987-654-3210', purchases: 8, totalSpent: 150.50, lastVisit: '2025-06-20' },
        { id: '3', name: 'Bob Johnson', email: 'bob@email.com', phone: '555-123-4567', purchases: 22, totalSpent: 450.75, lastVisit: '2025-06-25' }
      ];
      localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    }

    // Initialize sample sales with recent dates
    const sales = this.getSales();
    if (sales.length === 0) {
      const sampleSales = [
        {
          id: '1',
          items: [
            { product: 'Milk 1L', quantity: 2, price: 120 },
            { product: 'Bread Loaf', quantity: 1, price: 80 }
          ],
          total: 320,
          customer: 'John Doe',
          date: '2025-06-15'
        },
        {
          id: '2',
          items: [
            { product: 'Rice 2kg', quantity: 1, price: 250 },
            { product: 'Sugar 1kg', quantity: 2, price: 150 }
          ],
          total: 550,
          customer: 'Jane Smith',
          date: '2025-06-20'
        },
        {
          id: '3',
          items: [
            { product: 'Eggs (12pcs)', quantity: 3, price: 200 }
          ],
          total: 600,
          customer: 'Bob Johnson',
          date: '2025-06-25'
        }
      ];
      localStorage.setItem('sales', JSON.stringify(sampleSales));
    }

    // Initialize sample purchases with recent dates
    const purchases = this.getPurchases();
    if (purchases.length === 0) {
      const samplePurchases = [
        {
          id: '1',
          items: [
            { productId: '1', productName: 'Milk 1L', quantity: 50, unitCost: 90, totalCost: 4500 },
            { productId: '2', productName: 'Bread Loaf', quantity: 30, unitCost: 60, totalCost: 1800 }
          ],
          supplier: 'Fresh Farms',
          total: 6300,
          date: '2025-06-15',
          invoiceNumber: 'INV-001'
        },
        {
          id: '2',
          items: [
            { productId: '3', productName: 'Rice 2kg', quantity: 25, unitCost: 200, totalCost: 5000 }
          ],
          supplier: 'Rice Millers Co',
          total: 5000,
          date: '2025-06-20',
          invoiceNumber: 'INV-002'
        }
      ];
      localStorage.setItem('purchases', JSON.stringify(samplePurchases));
    }
  }

  // User management
  getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  createUser(user: Omit<User, 'id'> & { id?: string }): User {
    const users = this.getUsers();
    const newUser: User = {
      id: user.id || Date.now().toString(),
      ...user
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  getUserByUsername(username: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.username === username) || null;
  }

  updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      return users[userIndex];
    }
    return null;
  }

  // Product management with stock updates
  updateProductStock(productId: string, quantityChange: number): Product | null {
    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      products[productIndex].stock += quantityChange;
      localStorage.setItem('products', JSON.stringify(products));
      return products[productIndex];
    }
    return null;
  }

  // Product management
  getProducts(): Product[] {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
  }

  createProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      id: Date.now().toString(),
      ...product
    };
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    return newProduct;
  }

  // Customer management
  getCustomers(): Customer[] {
    const customers = localStorage.getItem('customers');
    return customers ? JSON.parse(customers) : [];
  }

  createCustomer(customer: Omit<Customer, 'id'>): Customer {
    const customers = this.getCustomers();
    const newCustomer: Customer = {
      id: Date.now().toString(),
      ...customer
    };
    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));
    return newCustomer;
  }

  // Sales management with automatic stock deduction
  getSales(): Sale[] {
    const sales = localStorage.getItem('sales');
    return sales ? JSON.parse(sales) : [];
  }

  createSale(sale: Omit<Sale, 'id'>): Sale {
    const sales = this.getSales();
    const newSale: Sale = {
      id: Date.now().toString(),
      ...sale
    };
    
    // Automatically deduct stock for each item
    sale.items.forEach(item => {
      const product = this.getProducts().find(p => p.name === item.product);
      if (product) {
        this.updateProductStock(product.id, -item.quantity);
      }
    });
    
    sales.push(newSale);
    localStorage.setItem('sales', JSON.stringify(sales));
    return newSale;
  }

  // Purchase management
  getPurchases(): Purchase[] {
    const purchases = localStorage.getItem('purchases');
    return purchases ? JSON.parse(purchases) : [];
  }

  createPurchase(purchase: Omit<Purchase, 'id'>): Purchase {
    const purchases = this.getPurchases();
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      ...purchase
    };
    
    // Automatically add stock for each purchased item
    purchase.items.forEach(item => {
      this.updateProductStock(item.productId, item.quantity);
    });
    
    purchases.push(newPurchase);
    localStorage.setItem('purchases', JSON.stringify(purchases));
    return newPurchase;
  }

  // Report filtering methods
  getSalesByDateRange(fromDate: Date, toDate: Date): Sale[] {
    const sales = this.getSales();
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= fromDate && saleDate <= toDate;
    });
  }

  getPurchasesByDateRange(fromDate: Date, toDate: Date): Purchase[] {
    const purchases = this.getPurchases();
    return purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate >= fromDate && purchaseDate <= toDate;
    });
  }

  getCustomersByDateRange(fromDate: Date, toDate: Date): Customer[] {
    const customers = this.getCustomers();
    return customers.filter(customer => {
      const lastVisitDate = new Date(customer.lastVisit);
      return lastVisitDate >= fromDate && lastVisitDate <= toDate;
    });
  }

  // Password reset functionality
  generateResetToken(email: string): string | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = Date.now() + (60 * 60 * 1000); // 1 hour from now

    this.updateUser(user.id, { resetToken, resetTokenExpiry });
    return resetToken;
  }

  resetPassword(token: string, newPassword: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > Date.now());
    
    if (user) {
      this.updateUser(user.id, { 
        password: newPassword, 
        resetToken: undefined, 
        resetTokenExpiry: undefined 
      });
      return true;
    }
    return false;
  }
}

export const db = LocalDatabase.getInstance();
