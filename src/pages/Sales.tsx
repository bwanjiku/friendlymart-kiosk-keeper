
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Receipt } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SaleItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Sale {
  id: string;
  date: string;
  time: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: '1',
      date: '2024-01-15',
      time: '10:30',
      customerName: 'John Doe',
      items: [
        { productName: 'Milk 1L', quantity: 2, price: 120, total: 240 },
        { productName: 'Bread Loaf', quantity: 1, price: 80, total: 80 }
      ],
      subtotal: 320,
      tax: 32,
      total: 352
    }
  ]);

  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<{
    customerName: string;
    items: SaleItem[];
  }>({
    customerName: '',
    items: []
  });

  const [newItem, setNewItem] = useState({
    productName: '',
    quantity: 1,
    price: 0
  });

  const addItemToSale = () => {
    if (!newItem.productName || newItem.quantity <= 0 || newItem.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all item details",
        variant: "destructive",
      });
      return;
    }

    const item: SaleItem = {
      ...newItem,
      total: newItem.quantity * newItem.price
    };

    setCurrentSale({
      ...currentSale,
      items: [...currentSale.items, item]
    });

    setNewItem({ productName: '', quantity: 1, price: 0 });
  };

  const completeSale = () => {
    if (!currentSale.customerName || currentSale.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add customer name and at least one item",
        variant: "destructive",
      });
      return;
    }

    const subtotal = currentSale.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const sale: Sale = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      customerName: currentSale.customerName,
      items: currentSale.items,
      subtotal,
      tax,
      total
    };

    setSales([sale, ...sales]);
    setCurrentSale({ customerName: '', items: [] });
    setIsNewSaleOpen(false);

    toast({
      title: "Sale Completed",
      description: `Sale recorded for KSh ${total.toLocaleString()}`,
    });
  };

  const generateReceipt = (sale: Sale) => {
    const receiptContent = `
SUPERMARKET RECEIPT
==================
Date: ${sale.date} ${sale.time}
Customer: ${sale.customerName}
Sale ID: ${sale.id}

ITEMS:
${sale.items.map(item => 
  `${item.productName} x${item.quantity} @ KSh ${item.price} = KSh ${item.total}`
).join('\n')}

==================
Subtotal: KSh ${sale.subtotal.toLocaleString()}
Tax (10%): KSh ${sale.tax.toLocaleString()}
TOTAL: KSh ${sale.total.toLocaleString()}
==================

Thank you for shopping with us!
    `;

    // Create a blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${sale.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Receipt Generated",
      description: "Receipt has been downloaded",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
            <p className="text-gray-600">Process sales and generate receipts</p>
          </div>
          <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Sale</DialogTitle>
                <DialogDescription>
                  Create a new sale transaction
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={currentSale.customerName}
                    onChange={(e) => setCurrentSale({ ...currentSale, customerName: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Add Items</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={newItem.productName}
                        onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (KSh)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        placeholder="Enter price"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addItemToSale} className="w-full">
                        Add Item
                      </Button>
                    </div>
                  </div>
                </div>

                {currentSale.items.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Items in Sale</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentSale.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>KSh {item.price}</TableCell>
                            <TableCell>KSh {item.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 text-right">
                      <p className="text-lg font-bold">
                        Total: KSh {(currentSale.items.reduce((sum, item) => sum + item.total, 0) * 1.1).toLocaleString()}
                        <span className="text-sm text-gray-500 ml-2">(including 10% tax)</span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewSaleOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={completeSale} className="flex-1">
                    Complete Sale
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sales History */}
        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>
              View and manage all sales transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.date} {sale.time}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.items.length} items</TableCell>
                    <TableCell>KSh {sale.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateReceipt(sale)}
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    </TableCell>
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

export default Sales;
