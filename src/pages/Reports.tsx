
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { toast } from '@/hooks/use-toast';

interface Sale {
  id: string;
  date: string;
  customer: string;
  amount: number;
}

const Reports = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [salesData, setSalesData] = useState<Sale[]>([
    { id: '1', date: '2025-05-01', customer: 'John Doe', amount: 120 },
    { id: '2', date: '2025-05-05', customer: 'Jane Smith', amount: 80 },
    { id: '3', date: '2025-05-10', customer: 'Mike Johnson', amount: 220 },
    { id: '4', date: '2025-05-15', customer: 'Sarah Wilson', amount: 150 },
    { id: '5', date: '2025-05-20', customer: 'David Lee', amount: 300 },
    { id: '6', date: '2025-05-25', customer: 'Emily Brown', amount: 180 },
    { id: '7', date: '2025-05-30', customer: 'Kevin Miller', amount: 250 },
    { id: '8', date: '2025-06-03', customer: 'Ashley Davis', amount: 90 },
    { id: '9', date: '2025-06-07', customer: 'Brian White', amount: 160 },
    { id: '10', date: '2025-06-12', customer: 'Jessica Moore', amount: 280 },
    { id: '11', date: '2025-06-18', customer: 'Timothy Green', amount: 110 },
    { id: '12', date: '2025-06-22', customer: 'Lauren Hall', amount: 190 },
    { id: '13', date: '2025-06-27', customer: 'Ryan Turner', amount: 240 },
    { id: '14', date: '2025-07-01', customer: 'Maria Garcia', amount: 320 },
    { id: '15', date: '2025-07-04', customer: 'James Wilson', amount: 175 },
  ]);
  const [filteredData, setFilteredData] = useState<Sale[]>([]);

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
    
    const filtered = salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= fromDate && saleDate <= toDate;
    });

    setFilteredData(filtered);
    
    toast({
      title: "Success",
      description: `Report generated for ${filtered.length} transactions`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const totalAmount = filteredData.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="print:hidden">
          <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600">Generate sales reports and analyze trends</p>
        </div>

        {/* Date Range Picker */}
        <Card className="print:hidden">
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
              <Button onClick={handleGenerateReport} className="flex-1">
                Generate Report
              </Button>
              {filteredData.length > 0 && (
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Print Header - Only visible when printing */}
        <div className="hidden print:block text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">FriendlyMart Supermarket</h1>
          <h2 className="text-xl font-semibold text-gray-800 mt-2">Sales Report</h2>
          {fromDate && toDate && (
            <p className="text-gray-600 mt-1">
              Period: {format(fromDate, "MMM dd, yyyy")} - {format(toDate, "MMM dd, yyyy")}
            </p>
          )}
          <p className="text-gray-600">Generated on: {format(new Date(), "MMM dd, yyyy 'at' HH:mm")}</p>
        </div>

        {/* Sales Summary */}
        {filteredData.length > 0 && (
          <Card className="print:shadow-none print:border-0">
            <CardHeader className="print:pb-2">
              <CardTitle className="print:text-lg">Report Summary</CardTitle>
              <CardDescription className="print:hidden">
                Summary for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
                <div className="text-center p-4 bg-blue-50 rounded-lg print:bg-gray-50 print:p-2">
                  <div className="text-2xl font-bold text-blue-600 print:text-lg print:text-gray-800">{filteredData.length}</div>
                  <div className="text-sm text-gray-600">Total Transactions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg print:bg-gray-50 print:p-2">
                  <div className="text-2xl font-bold text-green-600 print:text-lg print:text-gray-800">KSh {totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg print:bg-gray-50 print:p-2">
                  <div className="text-2xl font-bold text-purple-600 print:text-lg print:text-gray-800">KSh {Math.round(totalAmount / filteredData.length).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Average Sale</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sales Report Table */}
        {filteredData.length > 0 && (
          <Card className="print:shadow-none print:border-0">
            <CardHeader className="print:pb-2">
              <CardTitle className="print:text-lg">Sales Transactions</CardTitle>
              <CardDescription className="print:hidden">
                Detailed sales transactions for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="print:border-black">
                    <TableHead className="print:font-bold print:text-black">Date</TableHead>
                    <TableHead className="print:font-bold print:text-black">Customer</TableHead>
                    <TableHead className="print:font-bold print:text-black">Amount (KSh)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((sale) => (
                    <TableRow key={sale.id} className="print:border-black">
                      <TableCell className="print:text-black">{format(new Date(sale.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="print:text-black">{sale.customer}</TableCell>
                      <TableCell className="print:text-black">KSh {sale.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
    </Layout>
  );
};

export default Reports;
