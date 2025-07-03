
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, ShoppingCart, DollarSign, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [salesDateRange, setSalesDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [purchaseDateRange, setPurchaseDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [customerDateRange, setCustomerDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  // Format currency in KSH
  const formatKSH = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  // Sample data for different report types
  const allSalesData: SalesData[] = [
    { date: '2024-01-01', product: 'Milk', quantity: 15, revenue: 52.50, customer: 'John Doe', category: 'Dairy' },
    { date: '2024-01-02', product: 'Bread', quantity: 25, revenue: 74.75, customer: 'Jane Smith', category: 'Bakery' },
    { date: '2024-01-03', product: 'Eggs', quantity: 20, revenue: 99.80, customer: 'Bob Johnson', category: 'Dairy' },
    { date: '2024-01-04', product: 'Apples', quantity: 30, revenue: 59.70, customer: 'Alice Brown', category: 'Fruits' },
    { date: '2024-01-05', product: 'Rice', quantity: 10, revenue: 59.90, customer: 'Charlie Wilson', category: 'Grains' },
    { date: '2024-02-01', product: 'Milk', quantity: 20, revenue: 70.00, customer: 'David Lee', category: 'Dairy' },
    { date: '2024-02-15', product: 'Bread', quantity: 30, revenue: 89.70, customer: 'Emma Davis', category: 'Bakery' },
  ];

  const allPurchaseData: PurchaseData[] = [
    { date: '2024-01-01', product: 'Milk', quantity: 50, cost: 125.00, supplier: 'Fresh Farms', category: 'Dairy' },
    { date: '2024-01-02', product: 'Bread', quantity: 40, cost: 80.00, supplier: 'Local Bakery', category: 'Bakery' },
    { date: '2024-01-03', product: 'Eggs', quantity: 60, cost: 180.00, supplier: 'Farm Fresh', category: 'Dairy' },
    { date: '2024-01-04', product: 'Apples', quantity: 80, cost: 120.00, supplier: 'Orchard Co', category: 'Fruits' },
    { date: '2024-01-05', product: 'Rice', quantity: 30, cost: 150.00, supplier: 'Rice Mills', category: 'Grains' },
    { date: '2024-02-01', product: 'Milk', quantity: 60, cost: 150.00, supplier: 'Fresh Farms', category: 'Dairy' },
    { date: '2024-02-10', product: 'Bread', quantity: 50, cost: 100.00, supplier: 'Local Bakery', category: 'Bakery' },
  ];

  const allCustomerData: CustomerData[] = [
    { date: '2024-01-15', name: 'John Doe', purchases: 15, totalSpent: 299.99, lastVisit: '2024-01-15', phone: '123-456-7890' },
    { date: '2024-01-10', name: 'Jane Smith', purchases: 8, totalSpent: 150.50, lastVisit: '2024-01-10', phone: '987-654-3210' },
    { date: '2024-01-20', name: 'Bob Johnson', purchases: 22, totalSpent: 450.75, lastVisit: '2024-01-20', phone: '555-123-4567' },
    { date: '2024-01-18', name: 'Alice Brown', purchases: 12, totalSpent: 275.25, lastVisit: '2024-01-18', phone: '111-222-3333' },
    { date: '2024-01-22', name: 'Charlie Wilson', purchases: 18, totalSpent: 380.90, lastVisit: '2024-01-22', phone: '444-555-6666' },
    { date: '2024-02-05', name: 'David Lee', purchases: 25, totalSpent: 520.00, lastVisit: '2024-02-05', phone: '777-888-9999' },
    { date: '2024-02-12', name: 'Emma Davis', purchases: 14, totalSpent: 310.25, lastVisit: '2024-02-12', phone: '666-777-8888' },
  ];

  // Filter data based on date ranges
  const filterDataByDate = (data: any[], dateRange: DateRange) => {
    if (!dateRange.from && !dateRange.to) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      const fromDate = dateRange.from;
      const toDate = dateRange.to;
      
      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      return true;
    });
  };

  const salesData = filterDataByDate(allSalesData, salesDateRange);
  const purchaseData = filterDataByDate(allPurchaseData, purchaseDateRange);
  const customerData = filterDataByDate(allCustomerData, customerDateRange);

  // Calculate metrics for each data type
  const salesMetrics = {
    totalRevenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
    totalQuantity: salesData.reduce((sum, item) => sum + item.quantity, 0),
    avgOrderValue: salesData.length > 0 ? salesData.reduce((sum, item) => sum + item.revenue, 0) / salesData.length : 0,
    topProduct: salesData.length > 0 ? salesData.reduce((max, item) => item.revenue > max.revenue ? item : max, salesData[0])?.product || 'N/A' : 'N/A'
  };

  const purchaseMetrics = {
    totalCost: purchaseData.reduce((sum, item) => sum + item.cost, 0),
    totalQuantity: purchaseData.reduce((sum, item) => sum + item.quantity, 0),
    avgCostPerItem: purchaseData.reduce((sum, item) => sum + item.quantity, 0) > 0 ? 
      purchaseData.reduce((sum, item) => sum + item.cost, 0) / purchaseData.reduce((sum, item) => sum + item.quantity, 0) : 0,
    topSupplier: purchaseData.reduce((acc, item) => {
      acc[item.supplier] = (acc[item.supplier] || 0) + item.cost;
      return acc;
    }, {} as Record<string, number>)
  };

  const customerMetrics = {
    totalCustomers: customerData.length,
    totalSpent: customerData.reduce((sum, item) => sum + item.totalSpent, 0),
    avgSpentPerCustomer: customerData.length > 0 ? customerData.reduce((sum, item) => sum + item.totalSpent, 0) / customerData.length : 0,
    topCustomer: customerData.length > 0 ? customerData.reduce((max, item) => item.totalSpent > max.totalSpent ? item : max, customerData[0])?.name || 'N/A' : 'N/A'
  };

  const downloadCSV = (data: any[], filename: string, type: 'sales' | 'purchases' | 'customers') => {
    let headers: string[];
    let csvContent: string;

    switch (type) {
      case 'sales':
        headers = ['Date', 'Product', 'Category', 'Quantity', 'Revenue (KSH)', 'Customer'];
        csvContent = headers.join(',') + '\n' + 
          (data as SalesData[]).map(row => 
            `${row.date},${row.product},${row.category},${row.quantity},${formatKSH(row.revenue)},${row.customer}`
          ).join('\n');
        break;
      case 'purchases':
        headers = ['Date', 'Product', 'Category', 'Quantity', 'Cost (KSH)', 'Supplier'];
        csvContent = headers.join(',') + '\n' + 
          (data as PurchaseData[]).map(row => 
            `${row.date},${row.product},${row.category},${row.quantity},${formatKSH(row.cost)},${row.supplier}`
          ).join('\n');
        break;
      case 'customers':
        headers = ['Name', 'Phone', 'Purchases', 'Total Spent (KSH)', 'Last Visit'];
        csvContent = headers.join(',') + '\n' + 
          (data as CustomerData[]).map(row => 
            `${row.name},${row.phone},${row.purchases},${formatKSH(row.totalSpent)},${row.lastVisit}`
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

  const DateRangePicker = ({ dateRange, setDateRange, label }: { 
    dateRange: DateRange; 
    setDateRange: (range: DateRange) => void; 
    label: string; 
  }) => (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{label}:</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
            numberOfMonths={2}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
      {(dateRange.from || dateRange.to) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDateRange({ from: undefined, to: undefined })}
        >
          Clear
        </Button>
      )}
    </div>
  );

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
            {/* Date Range Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Sales Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <DateRangePicker 
                  dateRange={salesDateRange} 
                  setDateRange={setSalesDateRange} 
                  label="Date Range" 
                />
              </CardContent>
            </Card>

            {/* Sales Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatKSH(salesMetrics.totalRevenue)}</div>
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
                  <div className="text-2xl font-bold">{formatKSH(salesMetrics.avgOrderValue)}</div>
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
                  <p className="text-xs text-muted-foreground">Best seller this period</p>
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
                      <YAxis tickFormatter={(value) => `KSH ${value}`} />
                      <Tooltip formatter={(value) => [formatKSH(Number(value)), 'Revenue']} />
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
                      <Tooltip formatter={(value) => [formatKSH(Number(value)), 'Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            {/* Date Range Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Purchase Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <DateRangePicker 
                  dateRange={purchaseDateRange} 
                  setDateRange={setPurchaseDateRange} 
                  label="Date Range" 
                />
              </CardContent>
            </Card>

            {/* Purchase Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Purchase Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatKSH(purchaseMetrics.totalCost)}</div>
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
                  <div className="text-2xl font-bold">{formatKSH(purchaseMetrics.avgCostPerItem)}</div>
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
                  <p className="text-xs text-muted-foreground">Suppliers this period</p>
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
                      <YAxis tickFormatter={(value) => `KSH ${value}`} />
                      <Tooltip formatter={(value) => [formatKSH(Number(value)), 'Cost']} />
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
            {/* Date Range Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Customer Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <DateRangePicker 
                  dateRange={customerDateRange} 
                  setDateRange={setCustomerDateRange} 
                  label="Date Range" 
                />
              </CardContent>
            </Card>

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
                  <div className="text-2xl font-bold">{formatKSH(customerMetrics.totalSpent)}</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Spend Per Customer</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatKSH(customerMetrics.avgSpentPerCustomer)}</div>
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
                      <YAxis tickFormatter={(value) => `KSH ${value}`} />
                      <Tooltip formatter={(value) => [formatKSH(Number(value)), 'Total Spent']} />
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
