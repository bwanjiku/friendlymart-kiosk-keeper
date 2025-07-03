
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
        { id: '1', name: 'Milk', price: 3.50, stock: 50, category: 'Dairy', supplier: 'Fresh Farms' },
        { id: '2', name: 'Bread', price: 2.99, stock: 30, category: 'Bakery', supplier: 'Local Bakery' },
        { id: '3', name: 'Eggs', price: 4.99, stock: 40, category: 'Dairy', supplier: 'Farm Fresh' },
        { id: '4', name: 'Apples', price: 1.99, stock: 60, category: 'Fruits', supplier: 'Orchard Co' },
        { id: '5', name: 'Rice', price: 5.99, stock: 25, category: 'Grains', supplier: 'Rice Mills' }
      ];
      localStorage.setItem('products', JSON.stringify(sampleProducts));
    }

    // Initialize sample customers
    const customers = this.getCustomers();
    if (customers.length === 0) {
      const sampleCustomers = [
        { id: '1', name: 'John Doe', email: 'john@email.com', phone: '123-456-7890', purchases: 15, totalSpent: 299.99, lastVisit: '2024-01-15' },
        { id: '2', name: 'Jane Smith', email: 'jane@email.com', phone: '987-654-3210', purchases: 8, totalSpent: 150.50, lastVisit: '2024-01-10' },
        { id: '3', name: 'Bob Johnson', email: 'bob@email.com', phone: '555-123-4567', purchases: 22, totalSpent: 450.75, lastVisit: '2024-01-20' }
      ];
      localStorage.setItem('customers', JSON.stringify(sampleCustomers));
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

  // Sales management
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
    sales.push(newSale);
    localStorage.setItem('sales', JSON.stringify(sales));
    return newSale;
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
