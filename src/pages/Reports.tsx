
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Printer, TrendingUp, Users, Package } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { toast } from '@/hooks/use-toast';
import { db, Sale, Purchase, Customer } from '@/utils/database';

const Reports = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [purchasesData, setPurchasesData] = useState<Purchase[]>([]);
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState('sales');

  const handleGenerateReport = () => {
    if (!fromDate) {
      toast({
        title: "Error",
        description: "Please select a 'From' date",
        variant: "destructive",
      });
      return;
    }

    if (!toDate) {
      toast({
        title: "Error",
        description: "Please select a 'To' date",
        variant: "destructive",
      });
      return;
    }

    if (fromDate > toDate) {
      toast({
        title: "Error",
        description: "'From' date cannot be later than 'To' date",
        variant: "destructive",
      });
      return;
    }
    
    const filteredSales = db.getSalesByDateRange(fromDate, toDate);
    const filteredPurchases = db.getPurchasesByDateRange(fromDate, toDate);
    const filteredCustomers = db.getCustomersByDateRange(fromDate, toDate);

    setSalesData(filteredSales);
    setPurchasesData(filteredPurchases);
    setCustomersData(filteredCustomers);
    
    toast({
      title: "Success",
      description: `Reports generated for selected period`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getSummaryData = () => {
    const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0);
    const totalPurchases = purchasesData.reduce((sum, purchase) => sum + purchase.total, 0);
    const profit = totalSales - totalPurchases;
    
    return {
      totalSales,
      totalPurchases,
      profit,
      salesCount: salesData.length,
      purchasesCount: purchasesData.length,
      customersCount: customersData.length
    };
  };

  const summary = getSummaryData();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="space-y-6 p-6">
          <div className="print:hidden">
            <h1 className="text-3xl font-bold text-gray-900">Business Reports</h1>
            <p className="text-gray-600">Generate comprehensive business reports and analyze trends</p>
          </div>

          {/* Date Range Picker */}
          <Card className="print:hidden shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Select Date Range</CardTitle>
              <CardDescription>Choose the start and end dates for the report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "MMM dd, yyyy") : <span>Pick start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        disabled={(date) => date < new Date('2025-05-01') || date > new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* To Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "MMM dd, yyyy") : <span>Pick end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        disabled={(date) => date < new Date('2025-05-01') || date > new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleGenerateReport} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600">
                  Generate Report
                </Button>
                {(salesData.length > 0 || purchasesData.length > 0 || customersData.length > 0) && (
                  <Button onClick={handlePrint} variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Print Header */}
          <div className="hidden print:block text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">FriendlyMart Supermarket</h1>
            <h2 className="text-xl font-semibold text-gray-800 mt-2">Business Report</h2>
            {fromDate && toDate && (
              <p className="text-gray-600 mt-1">
                Period: {format(fromDate, "MMM dd, yyyy")} - {format(toDate, "MMM dd, yyyy")}
              </p>
            )}
            <p className="text-gray-600">Generated on: {format(new Date(), "MMM dd, yyyy 'at' HH:mm")}</p>
          </div>

          {/* Summary Cards */}
          {(salesData.length > 0 || purchasesData.length > 0 || customersData.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:gap-2">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-100 to-green-200 print:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600 print:text-gray-800" />
                    <div>
                      <p className="text-sm text-green-700 print:text-gray-600">Total Sales</p>
                      <p className="text-xl font-bold text-green-800 print:text-gray-800">KSh {summary.totalSales.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-100 to-blue-200 print:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600 print:text-gray-800" />
                    <div>
                      <p className="text-sm text-blue-700 print:text-gray-600">Total Purchases</p>
                      <p className="text-xl font-bold text-blue-800 print:text-gray-800">KSh {summary.totalPurchases.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-100 to-purple-200 print:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600 print:text-gray-800" />
                    <div>
                      <p className="text-sm text-purple-700 print:text-gray-600">Profit/Loss</p>
                      <p className={`text-xl font-bold print:text-gray-800 ${summary.profit >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                        KSh {summary.profit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Report Tabs */}
          {(salesData.length > 0 || purchasesData.length > 0 || customersData.length > 0) && (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm print:shadow-none print:border-0">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sales">Sales Report</TabsTrigger>
                    <TabsTrigger value="purchases">Purchases Report</TabsTrigger>
                    <TabsTrigger value="customers">Customers Report</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sales" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Sales Transactions ({salesData.length})</h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="print:border-black">
                          <TableHead className="print:font-bold print:text-black">Date</TableHead>
                          <TableHead className="print:font-bold print:text-black">Customer</TableHead>
                          <TableHead className="print:font-bold print:text-black">Items</TableHead>
                          <TableHead className="print:font-bold print:text-black">Total (KSh)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salesData.map((sale) => (
                          <TableRow key={sale.id} className="print:border-black">
                            <TableCell className="print:text-black">{format(new Date(sale.date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="print:text-black">{sale.customer}</TableCell>
                            <TableCell className="print:text-black">{sale.items.length} items</TableCell>
                            <TableCell className="print:text-black">KSh {sale.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="purchases" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Purchase Transactions ({purchasesData.length})</h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="print:border-black">
                          <TableHead className="print:font-bold print:text-black">Date</TableHead>
                          <TableHead className="print:font-bold print:text-black">Supplier</TableHead>
                          <TableHead className="print:font-bold print:text-black">Invoice #</TableHead>
                          <TableHead className="print:font-bold print:text-black">Items</TableHead>
                          <TableHead className="print:font-bold print:text-black">Total (KSh)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchasesData.map((purchase) => (
                          <TableRow key={purchase.id} className="print:border-black">
                            <TableCell className="print:text-black">{format(new Date(purchase.date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="print:text-black">{purchase.supplier}</TableCell>
                            <TableCell className="print:text-black">{purchase.invoiceNumber}</TableCell>
                            <TableCell className="print:text-black">{purchase.items.length} items</TableCell>
                            <TableCell className="print:text-black">KSh {purchase.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="customers" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Customer Activity ({customersData.length})</h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="print:border-black">
                          <TableHead className="print:font-bold print:text-black">Name</TableHead>
                          <TableHead className="print:font-bold print:text-black">Email</TableHead>
                          <TableHead className="print:font-bold print:text-black">Purchases</TableHead>
                          <TableHead className="print:font-bold print:text-black">Total Spent (KSh)</TableHead>
                          <TableHead className="print:font-bold print:text-black">Last Visit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customersData.map((customer) => (
                          <TableRow key={customer.id} className="print:border-black">
                            <TableCell className="print:text-black">{customer.name}</TableCell>
                            <TableCell className="print:text-black">{customer.email}</TableCell>
                            <TableCell className="print:text-black">{customer.purchases}</TableCell>
                            <TableCell className="print:text-black">KSh {customer.totalSpent.toLocaleString()}</TableCell>
                            <TableCell className="print:text-black">{format(new Date(customer.lastVisit), 'MMM dd, yyyy')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>

                {/* Print View - Show all reports */}
                <div className="hidden print:block space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Sales Report ({salesData.length} transactions)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-black">
                          <TableHead className="font-bold text-black">Date</TableHead>
                          <TableHead className="font-bold text-black">Customer</TableHead>
                          <TableHead className="font-bold text-black">Items</TableHead>
                          <TableHead className="font-bold text-black">Total (KSh)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salesData.map((sale) => (
                          <TableRow key={sale.id} className="border-black">
                            <TableCell className="text-black">{format(new Date(sale.date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="text-black">{sale.customer}</TableCell>
                            <TableCell className="text-black">{sale.items.length} items</TableCell>
                            <TableCell className="text-black">KSh {sale.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Purchases Report ({purchasesData.length} transactions)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-black">
                          <TableHead className="font-bold text-black">Date</TableHead>
                          <TableHead className="font-bold text-black">Supplier</TableHead>
                          <TableHead className="font-bold text-black">Invoice #</TableHead>
                          <TableHead className="font-bold text-black">Items</TableHead>
                          <TableHead className="font-bold text-black">Total (KSh)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchasesData.map((purchase) => (
                          <TableRow key={purchase.id} className="border-black">
                            <TableCell className="text-black">{format(new Date(purchase.date), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="text-black">{purchase.supplier}</TableCell>
                            <TableCell className="text-black">{purchase.invoiceNumber}</TableCell>
                            <TableCell className="text-black">{purchase.items.length} items</TableCell>
                            <TableCell className="text-black">KSh {purchase.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customers Report ({customersData.length} customers)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-black">
                          <TableHead className="font-bold text-black">Name</TableHead>
                          <TableHead className="font-bold text-black">Email</TableHead>
                          <TableHead className="font-bold text-black">Purchases</TableHead>
                          <TableHead className="font-bold text-black">Total Spent (KSh)</TableHead>
                          <TableHead className="font-bold text-black">Last Visit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customersData.map((customer) => (
                          <TableRow key={customer.id} className="border-black">
                            <TableCell className="text-black">{customer.name}</TableCell>
                            <TableCell className="text-black">{customer.email}</TableCell>
                            <TableCell className="text-black">{customer.purchases}</TableCell>
                            <TableCell className="text-black">KSh {customer.totalSpent.toLocaleString()}</TableCell>
                            <TableCell className="text-black">{format(new Date(customer.lastVisit), 'MMM dd, yyyy')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Print Footer */}
          <div className="hidden print:block text-center mt-8 pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              This report was generated by FriendlyMart Supermarket Management System
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
