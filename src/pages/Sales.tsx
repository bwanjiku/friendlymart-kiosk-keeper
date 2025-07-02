import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Receipt, Printer } from 'lucide-react';
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

  const printReceipt = (sale: Sale) => {
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${sale.id}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            max-width: 300px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .store-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .store-info {
            font-size: 12px;
            margin-bottom: 2px;
          }
          .receipt-info {
            margin: 15px 0;
            font-size: 12px;
          }
          .items {
            margin: 15px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            padding: 10px 0;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
          }
          .item-details {
            display: flex;
            justify-content: space-between;
            width: 100%;
          }
          .totals {
            margin-top: 15px;
            font-size: 12px;
          }
          .total-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
          }
          .grand-total {
            font-weight: bold;
            font-size: 14px;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
            border-top: 1px dashed #000;
            padding-top: 10px;
          }
          @media print {
            body { margin: 0; padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="store-name">FRIENDLYMART SUPERMARKET</div>
          <div class="store-info">Your Friendly Neighborhood Store</div>
          <div class="store-info">Tel: +254 700 123 456</div>
          <div class="store-info">Email: info@friendlymart.co.ke</div>
        </div>
        
        <div class="receipt-info">
          <div>Receipt #: ${sale.id}</div>
          <div>Date: ${sale.date} ${sale.time}</div>
          <div>Customer: ${sale.customerName}</div>
          <div>Cashier: Admin</div>
        </div>
        
        <div class="items">
          ${sale.items.map(item => `
            <div class="item">
              <div class="item-details">
                <div>${item.productName}</div>
                <div>KSh ${item.total.toLocaleString()}</div>
              </div>
            </div>
            <div class="item" style="font-size: 10px; color: #666; margin-bottom: 8px;">
              <div>${item.quantity} x KSh ${item.price.toLocaleString()}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="totals">
          <div class="total-line">
            <span>Subtotal:</span>
            <span>KSh ${sale.subtotal.toLocaleString()}</span>
          </div>
          <div class="total-line">
            <span>Tax (10%):</span>
            <span>KSh ${sale.tax.toLocaleString()}</span>
          </div>
          <div class="total-line grand-total">
            <span>TOTAL:</span>
            <span>KSh ${sale.total.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="footer">
          <div>Thank you for shopping with us!</div>
          <div>Have a great day!</div>
          <div style="margin-top: 10px;">*** CUSTOMER COPY ***</div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      printWindow.focus();
      
      // Auto print after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
      toast({
        title: "Receipt Ready",
        description: "Receipt is ready for printing",
      });
    }
  };

  const generateReceipt = (sale: Sale) => {
    const receiptContent = `
==========================================
         FRIENDLYMART SUPERMARKET
         Your Friendly Neighborhood Store
         Tel: +254 700 123 456
         Email: info@friendlymart.co.ke
==========================================

Receipt #: ${sale.id}
Date: ${sale.date} ${sale.time}
Customer: ${sale.customerName}
Cashier: Admin

------------------------------------------
ITEMS PURCHASED:
------------------------------------------
${sale.items.map(item => 
  `${item.productName}\n${item.quantity} x KSh ${item.price.toLocaleString()} = KSh ${item.total.toLocaleString()}\n`
).join('\n')}
------------------------------------------
Subtotal:        KSh ${sale.subtotal.toLocaleString()}
Tax (10%):       KSh ${sale.tax.toLocaleString()}
==========================================
TOTAL:           KSh ${sale.total.toLocaleString()}
==========================================

Thank you for shopping with us!
Have a great day!

*** CUSTOMER COPY ***
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
      title: "Receipt Downloaded",
      description: "Receipt has been downloaded as text file",
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
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => printReceipt(sale)}
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateReceipt(sale)}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
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
