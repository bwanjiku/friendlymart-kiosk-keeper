import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Receipt, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { db, Product } from '@/utils/database';

interface SaleItem {
  product: string;
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  customer: string;
  date: string;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>(db.getSales());
  const [products] = useState<Product[]>(db.getProducts());
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<{
    customerName: string;
    items: Array<{
      productName: string;
      quantity: number;
      price: number;
      total: number;
    }>;
  }>({
    customerName: '',
    items: []
  });

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1,
    price: 0
  });

  const addItemToSale = () => {
    if (!newItem.productId || newItem.quantity <= 0 || newItem.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all item details",
        variant: "destructive",
      });
      return;
    }

    const selectedProduct = products.find(p => p.id === newItem.productId);
    if (!selectedProduct) return;

    if (selectedProduct.stock < newItem.quantity) {
      toast({
        title: "Error",
        description: `Not enough stock. Available: ${selectedProduct.stock}`,
        variant: "destructive",
      });
      return;
    }

    const item = {
      productName: selectedProduct.name,
      quantity: newItem.quantity,
      price: newItem.price,
      total: newItem.quantity * newItem.price
    };

    setCurrentSale({
      ...currentSale,
      items: [...currentSale.items, item]
    });

    setNewItem({ productId: '', quantity: 1, price: 0 });
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

    const total = currentSale.items.reduce((sum, item) => sum + item.total, 0);

    const saleItems: SaleItem[] = currentSale.items.map(item => ({
      product: item.productName,
      quantity: item.quantity,
      price: item.price
    }));

    const sale = db.createSale({
      items: saleItems,
      total,
      customer: currentSale.customerName,
      date: new Date().toISOString().split('T')[0]
    });

    setSales([sale, ...sales]);
    setCurrentSale({ customerName: '', items: [] });
    setIsNewSaleOpen(false);

    toast({
      title: "Sale Completed",
      description: `Sale recorded for KSh ${total.toLocaleString()} and stock updated`,
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
          <div>Date: ${sale.date}</div>
          <div>Customer: ${sale.customer}</div>
          <div>Cashier: Admin</div>
        </div>
        
        <div class="items">
          ${sale.items.map(item => `
            <div class="item">
              <div class="item-details">
                <div>${item.product}</div>
                <div>KSh ${item.price.toLocaleString()}</div>
              </div>
              <div>${item.quantity}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="totals">
          <div>Subtotal: KSh ${sale.total.toLocaleString()}</div>
          <div>Tax (10%): KSh ${(sale.total * 0.1).toLocaleString()}</div>
          <div class="grand-total">TOTAL: KSh ${(sale.total * 1.1).toLocaleString()}</div>
        </div>
        
        <div class="footer">
          <div>Thank you for shopping with us!</div>
          <div>Have a great day!</div>
          <div>*** CUSTOMER COPY ***</div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
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
Date: ${sale.date}
Customer: ${sale.customer}
Cashier: Admin

------------------------------------------
ITEMS PURCHASED:
------------------------------------------
${sale.items.map(item => 
  `${item.product} - ${item.quantity} x KSh ${item.price.toLocaleString()} = KSh ${(item.quantity * item.price).toLocaleString()}\n`
).join('\n')}
------------------------------------------
Subtotal:        KSh ${sale.total.toLocaleString()}
Tax (10%):       KSh ${(sale.total * 0.1).toLocaleString()}
==========================================
TOTAL:           KSh ${(sale.total * 1.1).toLocaleString()}
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
              <p className="text-gray-600">Process sales and generate receipts</p>
            </div>
            <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
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
                        <Label htmlFor="product">Product</Label>
                        <Select value={newItem.productId} onValueChange={(value) => {
                          setNewItem({ ...newItem, productId: value });
                          const selectedProduct = products.find(p => p.id === value);
                          if (selectedProduct) {
                            setNewItem(prev => ({ ...prev, productId: value, price: selectedProduct.price }));
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} (Stock: {product.stock})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          Total: KSh {currentSale.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
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
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
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
                    <TableHead>Date</TableHead>
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
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
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
      </div>
    </Layout>
  );
};

export default Sales;
