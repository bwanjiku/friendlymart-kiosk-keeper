
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, ArrowDown } from 'lucide-react';
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
  const [dateRange, setDateRange] = useState<{ from: Date | null, to?: Date | null }>({
    from: null,
    to: null,
  });
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
    if (!dateRange?.from) {
      toast({
        title: "Error",
        description: "Please select a start date",
        variant: "destructive",
      });
      return;
    }

    // Handle optional 'to' date
    const endDate = dateRange.to || dateRange.from;
    
    const filtered = salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= dateRange.from! && saleDate <= endDate;
    });

    setFilteredData(filtered);
    
    toast({
      title: "Success",
      description: `Report generated for ${filtered.length} transactions`,
    });
  };

  const totalAmount = filteredData.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600">Generate sales reports and analyze trends</p>
        </div>

        {/* Date Range Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date Range</CardTitle>
            <CardDescription>Choose the start and end dates for the report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                      ) : (
                        format(dateRange.from, "MMM dd, yyyy")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date('2025-05-01') || date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              <Button onClick={handleGenerateReport}>
                Generate Report <ArrowDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Summary */}
        {filteredData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
              <CardDescription>
                Summary for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
                  <div className="text-sm text-gray-600">Total Transactions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">KSh {totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">KSh {Math.round(totalAmount / filteredData.length).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Average Sale</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sales Report Table */}
        {filteredData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sales Report</CardTitle>
              <CardDescription>
                Detailed sales transactions for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount (KSh)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{format(new Date(sale.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>KSh {sale.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
