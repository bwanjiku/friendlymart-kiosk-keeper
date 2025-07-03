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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
    { id: '1', date: '2024-01-01', customer: 'John Doe', amount: 120 },
    { id: '2', date: '2024-01-05', customer: 'Jane Smith', amount: 80 },
    { id: '3', date: '2024-01-10', customer: 'Mike Johnson', amount: 220 },
    { id: '4', date: '2024-01-15', customer: 'Sarah Wilson', amount: 150 },
    { id: '5', date: '2024-01-20', customer: 'David Lee', amount: 300 },
    { id: '6', date: '2024-01-25', customer: 'Emily Brown', amount: 180 },
    { id: '7', date: '2024-01-30', customer: 'Kevin Miller', amount: 250 },
    { id: '8', date: '2024-02-03', customer: 'Ashley Davis', amount: 90 },
    { id: '9', date: '2024-02-07', customer: 'Brian White', amount: 160 },
    { id: '10', date: '2024-02-12', customer: 'Jessica Moore', amount: 280 },
    { id: '11', date: '2024-02-18', customer: 'Timothy Green', amount: 110 },
    { id: '12', date: '2024-02-22', customer: 'Lauren Hall', amount: 190 },
    { id: '13', date: '2024-02-27', customer: 'Ryan Turner', amount: 240 },
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

  const chartData = {
    labels: filteredData.map(sale => format(new Date(sale.date), 'MMM dd')),
    datasets: [
      {
        label: 'Sales Amount (KSh)',
        data: filteredData.map(sale => sale.amount),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

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
                  />
                </PopoverContent>
              </Popover>
              <Button onClick={handleGenerateReport}>
                Generate Report <ArrowDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

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

        {/* Sales Chart */}
        {filteredData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Visual representation of sales over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={chartData} options={chartOptions} />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
