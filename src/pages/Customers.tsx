import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalPurchases: number;
  lastPurchase: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+254 711 123 456',
      email: 'john@example.com',
      address: 'Nairobi, Kenya',
      totalPurchases: 15420.50,
      lastPurchase: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+254 722 234 567',
      email: 'jane@example.com',
      address: 'Mombasa, Kenya',
      totalPurchases: 8900.25,
      lastPurchase: '2024-01-14'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      phone: '+254 733 345 678',
      email: 'mike@example.com',
      address: 'Kisumu, Kenya',
      totalPurchases: 23400.00,
      lastPurchase: '2024-01-13'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      phone: '+254 744 456 789',
      email: 'sarah@example.com',
      address: 'Nakuru, Kenya',
      totalPurchases: 12750.75,
      lastPurchase: '2024-01-12'
    },
    {
      id: '5',
      name: 'David Brown',
      phone: '+254 755 567 890',
      email: 'david@example.com',
      address: 'Eldoret, Kenya',
      totalPurchases: 18900.00,
      lastPurchase: '2024-01-11'
    },
    {
      id: '6',
      name: 'Mary Johnson',
      phone: '+254 766 678 901',
      email: 'mary@example.com',
      address: 'Thika, Kenya',
      totalPurchases: 9850.25,
      lastPurchase: '2024-01-10'
    },
    {
      id: '7',
      name: 'Peter Wilson',
      phone: '+254 777 789 012',
      email: 'peter@example.com',
      address: 'Machakos, Kenya',
      totalPurchases: 14200.50,
      lastPurchase: '2024-01-09'
    },
    {
      id: '8',
      name: 'Lucy Adams',
      phone: '+254 788 890 123',
      email: 'lucy@example.com',
      address: 'Nyeri, Kenya',
      totalPurchases: 21500.75,
      lastPurchase: '2024-01-08'
    },
    {
      id: '9',
      name: 'James Kiptoo',
      phone: '+254 799 901 234',
      email: 'james@example.com',
      address: 'Kericho, Kenya',
      totalPurchases: 16750.00,
      lastPurchase: '2024-01-07'
    },
    {
      id: '10',
      name: 'Grace Wanjiku',
      phone: '+254 700 012 345',
      email: 'grace@example.com',
      address: 'Kiambu, Kenya',
      totalPurchases: 13450.25,
      lastPurchase: '2024-01-06'
    },
    {
      id: '11',
      name: 'Robert Otieno',
      phone: '+254 701 123 456',
      email: 'robert@example.com',
      address: 'Kisii, Kenya',
      totalPurchases: 19800.50,
      lastPurchase: '2024-01-05'
    },
    {
      id: '12',
      name: 'Elizabeth Muthoni',
      phone: '+254 702 234 567',
      email: 'elizabeth@example.com',
      address: 'Meru, Kenya',
      totalPurchases: 11250.75,
      lastPurchase: '2024-01-04'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Error",
        description: "Please fill in required fields (name and phone)",
        variant: "destructive",
      });
      return;
    }

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      totalPurchases: 0,
      lastPurchase: new Date().toISOString().split('T')[0]
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', phone: '', email: '', address: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Customer added successfully",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600">Manage your customer database and information</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter the details for the new customer
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <Button onClick={handleAddCustomer} className="w-full">
                  Add Customer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
            <CardDescription>
              Manage your customer database and purchase history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Total Purchases</TableHead>
                  <TableHead>Last Purchase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email || 'N/A'}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>KSh {customer.totalPurchases.toLocaleString()}</TableCell>
                    <TableCell>{customer.lastPurchase}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Customers;
