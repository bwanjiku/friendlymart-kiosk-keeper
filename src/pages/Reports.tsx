
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar, TrendingUp, Users, ShoppingCart, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');

  // Expanded mock data for different report types
  const mockSalesData = [
    { date: '2024-01-01', product: 'Milk 1L', quantity: 50, revenue: 6000, customer: 'John Doe', category: 'Dairy' },
    { date: '2024-01-02', product: 'Bread Loaf', quantity: 30, revenue: 2400, customer: 'Jane Smith', category: 'Bakery' },
    { date: '2024-01-03', product: 'Rice 2kg', quantity: 20, revenue: 5000, customer: 'Mike Johnson', category: 'Grains' },
    { date: '2024-01-04', product: 'Cooking Oil 1L', quantity: 15, revenue: 2700, customer: 'Sarah Wilson', category: 'Cooking' },
    { date: '2024-01-05', product: 'Sugar 1kg', quantity: 25, revenue: 3750, customer: 'David Brown', category: 'Pantry' },
    { date: '2024-01-06', product: 'Eggs (12pcs)', quantity: 40, revenue: 4800, customer: 'Mary Johnson', category: 'Dairy' },
    { date: '2024-01-07', product: 'Chicken 1kg', quantity: 12, revenue: 7200, customer: 'Peter Wilson', category: 'Meat' },
    { date: '2024-01-08', product: 'Tomatoes 1kg', quantity: 35, revenue: 3500, customer: 'Lucy Adams', category: 'Vegetables' },
  ];

  const mockPurchasesData = [
    { date: '2024-01-01', product: 'Milk 1L', quantity: 100, cost: 10000, supplier: 'Dairy Fresh Ltd', category: 'Dairy' },
    { date: '2024-01-02', product: 'Bread Loaf', quantity: 60, cost: 3600, supplier: 'Golden Bakery', category: 'Bakery' },
    { date: '2024-01-03', product: 'Rice 2kg', quantity: 50, cost: 10000, supplier: 'Grain Masters', category: 'Grains' },
    { date: '2024-01-04', product: 'Cooking Oil 1L', quantity: 30, cost: 4500, supplier: 'Oil Pro Kenya', category: 'Cooking' },
    { date: '2024-01-05', product: 'Sugar 1kg', quantity: 80, cost: 9600, supplier: 'Sweet Supplies', category: 'Pantry' },
    { date: '2024-01-06', product: 'Eggs (12pcs)', quantity: 100, cost: 10000, supplier: 'Poultry Farm Co', category: 'Dairy' },
    { date: '2024-01-07', product: 'Chicken 1kg', quantity: 25, cost: 12500, supplier: 'Fresh Meat Ltd', category: 'Meat' },
  ];

  const mockCustomersData = [
    { date: '2024-01-01', name: 'John Doe', purchases: 5, totalSpent: 12500, lastVisit: '2024-01-15', phone: '+254 711 123 456' },
    { date: '2024-01-02', name: 'Jane Smith', purchases: 8, totalSpent: 18900, lastVisit: '2024-01-14', phone: '+254 722 234 567' },
    { date: '2024-01-03', name: 'Mike Johnson', purchases: 12, totalSpent: 23400, lastVisit: '2024-01-13', phone: '+254 733 345 678' },
    { date: '2024-01-04', name: 'Sarah Wilson', purchases: 6, totalSpent: 15600, lastVisit: '2024-01-12', phone: '+254 744 456 789' },
    { date: '2024-01-05', name: 'David Brown', purchases: 9, totalSpent: 21200, lastVisit: '2024-01-11', phone: '+254 755 567 890' },
    { date: '2024-01-06', name: 'Mary Johnson', purchases: 7, totalSpent: 16800, lastVisit: '2024-01-10', phone: '+254 766 678 901' },
    { date: '2024-01-07', name: 'Peter Wilson', purchases: 4, totalSpent: 9800, lastVisit: '2024-01-09', phone: '+254 777 789 012' },
    { date: '2024-01-08', name: 'Lucy Adams', purchases: 11, totalSpent: 25600, lastVisit: '2024-01-08', phone: '+254 788 890 123' },
  ];

  const generateReport = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Error",
        description: "Start date cannot be after end date",
        variant: "destructive",
      });
      return;
    }

    setShowResults(true);
    toast({
      title: "Reports Generated",
      description: `Generated reports for the selected period`,
    });
  };

  const downloadReport = (reportType: string, data: any[]) => {
    if (data.length === 0) {
      toast({
        title: "Error",
        description: "No data to download. Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'sales':
        csvContent = [
          ['Date', 'Product', 'Category', 'Quantity', 'Revenue (KSh)', 'Customer'],
          ...data.map(item => [item.date, item.product, item.category, item.quantity, item.revenue, item.customer])
        ].map(row => row.join(',')).join('\n');
        filename = `sales-report-${startDate}-to-${endDate}.csv`;
        break;
      case 'purchases':
        csvContent = [
          ['Date', 'Product', 'Category', 'Quantity', 'Cost (KSh)', 'Supplier'],
          ...data.map(item => [item.date, item.product, item.category, item.quantity, item.cost, item.supplier])
        ].map(row => row.join(',')).join('\n');
        filename = `purchases-report-${startDate}-to-${endDate}.csv`;
        break;
      case 'customers':
        csvContent = [
          ['Registration Date', 'Customer Name', 'Phone', 'Total Purchases', 'Total Spent (KSh)', 'Last Visit'],
          ...data.map(item => [item.date, item.name, item.phone, item.purchases, item.totalSpent, item.lastVisit])
        ].map(row => row.join(',')).join('\n');
        filename = `customers-report-${startDate}-to-${endDate}.csv`;
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been downloaded`,
    });
  };

  const getFilteredData = (dataType: string) => {
    const data = dataType === 'sales' ? mockSalesData : 
                 dataType === 'purchases' ? mockPurchasesData : mockCustomersData;
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
  };

  const getSummaryStats = (reportType: string) => {
    const data = getFilteredData(reportType);
    
    switch (reportType) {
      case 'sales':
        return {
          total: data.reduce((sum, item) => sum + item.revenue, 0),
          count: data.length,
          items: data.reduce((sum, item) => sum + item.quantity, 0)
        };
      case 'purchases':
        return {
          total: data.reduce((sum, item) => sum + item.cost, 0),
          count: data.length,
          items: data.reduce((sum, item) => sum + item.quantity, 0)
        };
      case 'customers':
        return {
          total: data.reduce((sum, item) => sum + item.totalSpent, 0),
          count: data.length,
          items: data.reduce((sum, item) => sum + item.purchases, 0)
        };
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Reports</h1>
          <p className="text-gray-600">Generate comprehensive reports for sales, purchases, and customers</p>
        </div>

        {/* Report Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <CardDescription>
              Select a date range to generate detailed business reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button onClick={generateReport} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        {showResults && (
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Sales Reports
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Purchases Reports
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customers Reports
              </TabsTrigger>
            </TabsList>

            {/* Sales Reports */}
            <TabsContent value="sales" className="space-y-6">
              {(() => {
                const stats = getSummaryStats('sales');
                const data = getFilteredData('sales');
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">KSh {stats.total.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.items}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.count}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Sales Report</CardTitle>
                            <CardDescription>Detailed sales data for {startDate} to {endDate}</CardDescription>
                          </div>
                          <Button onClick={() => downloadReport('sales', data)} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Revenue (KSh)</TableHead>
                              <TableHead>Customer</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.date}</TableCell>
                                <TableCell className="font-medium">{item.product}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>KSh {item.revenue.toLocaleString()}</TableCell>
                                <TableCell>{item.customer}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </TabsContent>

            {/* Purchases Reports */}
            <TabsContent value="purchases" className="space-y-6">
              {(() => {
                const stats = getSummaryStats('purchases');
                const data = getFilteredData('purchases');
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">KSh {stats.total.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Items Purchased</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.items}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.count}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Purchases Report</CardTitle>
                            <CardDescription>Detailed purchases data for {startDate} to {endDate}</CardDescription>
                          </div>
                          <Button onClick={() => downloadReport('purchases', data)} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Cost (KSh)</TableHead>
                              <TableHead>Supplier</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.date}</TableCell>
                                <TableCell className="font-medium">{item.product}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>KSh {item.cost.toLocaleString()}</TableCell>
                                <TableCell>{item.supplier}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </TabsContent>

            {/* Customers Reports */}
            <TabsContent value="customers" className="space-y-6">
              {(() => {
                const stats = getSummaryStats('customers');
                const data = getFilteredData('customers');
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Total Customer Spending</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">KSh {stats.total.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.items}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.count}</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Customers Report</CardTitle>
                            <CardDescription>Customer activity data for {startDate} to {endDate}</CardDescription>
                          </div>
                          <Button onClick={() => downloadReport('customers', data)} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Registration Date</TableHead>
                              <TableHead>Customer Name</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Total Purchases</TableHead>
                              <TableHead>Total Spent (KSh)</TableHead>
                              <TableHead>Last Visit</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.date}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.phone}</TableCell>
                                <TableCell>{item.purchases}</TableCell>
                                <TableCell>KSh {item.totalSpent.toLocaleString()}</TableCell>
                                <TableCell>{item.lastVisit}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
