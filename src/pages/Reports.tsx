
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock data for demonstration
  const mockSalesData = [
    { date: '2024-01-01', product: 'Milk 1L', quantity: 50, revenue: 6000, customer: 'John Doe' },
    { date: '2024-01-02', product: 'Bread Loaf', quantity: 30, revenue: 2400, customer: 'Jane Smith' },
    { date: '2024-01-03', product: 'Rice 2kg', quantity: 20, revenue: 5000, customer: 'Mike Johnson' },
    { date: '2024-01-04', product: 'Cooking Oil 1L', quantity: 15, revenue: 2700, customer: 'Sarah Wilson' },
    { date: '2024-01-05', product: 'Sugar 1kg', quantity: 25, revenue: 3750, customer: 'David Brown' },
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

    // Filter mock data based on date range
    const filteredData = mockSalesData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    setReportData(filteredData);
    setShowResults(true);

    toast({
      title: "Report Generated",
      description: `Found ${filteredData.length} records for the selected period`,
    });
  };

  const downloadReport = () => {
    if (reportData.length === 0) {
      toast({
        title: "Error",
        description: "No data to download. Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      ['Date', 'Product', 'Quantity', 'Revenue (KSh)', 'Customer'],
      ...reportData.map(item => [
        item.date,
        item.product,
        item.quantity,
        item.revenue,
        item.customer
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${startDate}-to-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Sales report has been downloaded as CSV file",
    });
  };

  const totalRevenue = reportData.reduce((sum, item) => sum + item.revenue, 0);
  const totalQuantity = reportData.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600">Generate detailed sales reports for any date range</p>
        </div>

        {/* Report Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Sales Report</CardTitle>
            <CardDescription>
              Select a date range to generate detailed sales reports
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
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Summary */}
        {showResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  For period {startDate} to {endDate}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Items Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalQuantity}</div>
                <p className="text-xs text-muted-foreground">
                  Units sold in period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.length}</div>
                <p className="text-xs text-muted-foreground">
                  Sales transactions
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Report Results */}
        {showResults && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sales Report Results</CardTitle>
                  <CardDescription>
                    Detailed sales data for {startDate} to {endDate}
                  </CardDescription>
                </div>
                <Button onClick={downloadReport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reportData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Revenue (KSh)</TableHead>
                      <TableHead>Customer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>KSh {item.revenue.toLocaleString()}</TableCell>
                        <TableCell>{item.customer}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No sales data found for the selected date range.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
