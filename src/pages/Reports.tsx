
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
import Layout from '@/components/Layout';

// Define proper types for different data structures
interface SalesData {
  date: string;
  product: string;
  quantity: number;
  revenue: number;
  customer: string;
  category: string;
}

interface PurchaseData {
  date: string;
  product: string;
  quantity: number;
  cost: number;
  supplier: string;
  category: string;
}

interface CustomerData {
  date: string;
  name: string;
  purchases: number;
  totalSpent: number;
  lastVisit: string;
  phone: string;
}

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');

  // Sample data for different report types
  const salesData: SalesData[] = [
    { date: '2024-01-01', product: 'Milk', quantity: 15, revenue: 52.50, customer: 'John Doe', category: 'Dairy' },
    { date: '2024-01-02', product: 'Bread', quantity: 25, revenue: 74.75, customer: 'Jane Smith', category: 'Bakery' },
    { date: '2024-01-03', product: 'Eggs', quantity: 20, revenue: 99.80, customer: 'Bob Johnson', category: 'Dairy' },
    { date: '2024-01-04', product: 'Apples', quantity: 30, revenue: 59.70, customer: 'Alice Brown', category: 'Fruits' },
    { date: '2024-01-05', product: 'Rice', quantity: 10, revenue: 59.90, customer: 'Charlie Wilson', category: 'Grains' },
  ];

  const purchaseData: PurchaseData[] = [
    { date: '2024-01-01', product: 'Milk', quantity: 50, cost: 125.00, supplier: 'Fresh Farms', category: 'Dairy' },
    { date: '2024-01-02', product: 'Bread', quantity: 40, cost: 80.00, supplier: 'Local Bakery', category: 'Bakery' },
    { date: '2024-01-03', product: 'Eggs', quantity: 60, cost: 180.00, supplier: 'Farm Fresh', category: 'Dairy' },
    { date: '2024-01-04', product: 'Apples', quantity: 80, cost: 120.00, supplier: 'Orchard Co', category: 'Fruits' },
    { date: '2024-01-05', product: 'Rice', quantity: 30, cost: 150.00, supplier: 'Rice Mills', category: 'Grains' },
  ];

  const customerData: CustomerData[] = [
    { date: '2024-01-15', name: 'John Doe', purchases: 15, totalSpent: 299.99, lastVisit: '2024-01-15', phone: '123-456-7890' },
    { date: '2024-01-10', name: 'Jane Smith', purchases: 8, totalSpent: 150.50, lastVisit: '2024-01-10', phone: '987-654-3210' },
    { date: '2024-01-20', name: 'Bob Johnson', purchases: 22, totalSpent: 450.75, lastVisit: '2024-01-20', phone: '555-123-4567' },
    { date: '2024-01-18', name: 'Alice Brown', purchases: 12, totalSpent: 275.25, lastVisit: '2024-01-18', phone: '111-222-3333' },
    { date: '2024-01-22', name: 'Charlie Wilson', purchases: 18, totalSpent: 380.90, lastVisit: '2024-01-22', phone: '444-555-6666' },
  ];

  // Calculate metrics for each data type
  const salesMetrics = {
    totalRevenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
    totalQuantity: salesData.reduce((sum, item) => sum + item.quantity, 0),
    avgOrderValue: salesData.reduce((sum, item) => sum + item.revenue, 0) / salesData.length,
    topProduct: salesData.reduce((max, item) => item.revenue > max.revenue ? item : max, salesData[0])?.product || 'N/A'
  };

  const purchaseMetrics = {
    totalCost: purchaseData.reduce((sum, item) => sum + item.cost, 0),
    totalQuantity: purchaseData.reduce((sum, item) => sum + item.quantity, 0),
    avgCostPerItem: purchaseData.reduce((sum, item) => sum + item.cost, 0) / purchaseData.reduce((sum, item) => sum + item.quantity, 0),
    topSupplier: purchaseData.reduce((acc, item) => {
      acc[item.supplier] = (acc[item.supplier] || 0) + item.cost;
      return acc;
    }, {} as Record<string, number>)
  };

  const customerMetrics = {
    totalCustomers: customerData.length,
    totalSpent: customerData.reduce((sum, item) => sum + item.totalSpent, 0),
    avgSpentPerCustomer: customerData.reduce((sum, item) => sum + item.totalSpent, 0) / customerData.length,
    topCustomer: customerData.reduce((max, item) => item.totalSpent > max.totalSpent ? item : max, customerData[0])?.name || 'N/A'
  };

  const downloadCSV = (data: any[], filename: string, type: 'sales' | 'purchases' | 'customers') => {
    let headers: string[];
    let csvContent: string;

    switch (type) {
      case 'sales':
        headers = ['Date', 'Product', 'Category', 'Quantity', 'Revenue', 'Customer'];
        csvContent = headers.join(',') + '\n' + 
          (data as SalesData[]).map(row => 
            `${row.date},${row.product},${row.category},${row.quantity},$${row.revenue.toFixed(2)},${row.customer}`
          ).join('\n');
        break;
      case 'purchases':
        headers = ['Date', 'Product', 'Category', 'Quantity', 'Cost', 'Supplier'];
        csvContent = headers.join(',') + '\n' + 
          (data as PurchaseData[]).map(row => 
            `${row.date},${row.product},${row.category},${row.quantity},$${row.cost.toFixed(2)},${row.supplier}`
          ).join('\n');
        break;
      case 'customers':
        headers = ['Name', 'Phone', 'Purchases', 'Total Spent', 'Last Visit'];
        csvContent = headers.join(',') + '\n' + 
          (data as CustomerData[]).map(row => 
            `${row.name},${row.phone},${row.purchases},$${row.totalSpent.toFixed(2)},${row.lastVisit}`
          ).join('\n');
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Sales Reports</TabsTrigger>
            <TabsTrigger value="purchases">Purchase Reports</TabsTrigger>
            <TabsTrigger value="customers">Customer Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            {/* Sales Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${salesMetrics.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesMetrics.totalQuantity}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${salesMetrics.avgOrderValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Product</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesMetrics.topProduct}</div>
                  <p className="text-xs text-muted-foreground">Best seller this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Sales Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Daily Sales Revenue</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadCSV(salesData, 'sales-report.csv', 'sales')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={salesData.reduce((acc, item) => {
                          const existing = acc.find(x => x.category === item.category);
                          if (existing) {
                            existing.value += item.revenue;
                          } else {
                            acc.push({ category: item.category, value: item.revenue });
                          }
                          return acc;
                        }, [] as { category: string; value: number }[])}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {salesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            {/* Purchase Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Purchase Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${purchaseMetrics.totalCost.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+10% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Items Purchased</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{purchaseMetrics.totalQuantity}</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Cost Per Item</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${purchaseMetrics.avgCostPerItem.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">-2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Object.keys(purchaseMetrics.topSupplier).length}</div>
                  <p className="text-xs text-muted-foreground">5 suppliers this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Purchase Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Purchase Costs Over Time</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadCSV(purchaseData, 'purchase-report.csv', 'purchases')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={purchaseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cost" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Purchase Quantity by Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={purchaseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="product" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantity" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            {/* Customer Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customerMetrics.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">+20% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customer Spending</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${customerMetrics.totalSpent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Spend Per Customer</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${customerMetrics.avgSpentPerCustomer.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+7% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Customer</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customerMetrics.topCustomer}</div>
                  <p className="text-xs text-muted-foreground">Highest spender</p>
                </CardContent>
              </Card>
            </div>

            {/* Customer Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Customer Spending Analysis</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadCSV(customerData, 'customer-report.csv', 'customers')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={customerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalSpent" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Purchase Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={customerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="purchases" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
