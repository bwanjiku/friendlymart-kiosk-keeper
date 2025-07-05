
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { db, Purchase, Product } from '@/utils/database';

interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>(db.getPurchases());
  const [products] = useState<Product[]>(db.getProducts());
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<{
    supplier: string;
    invoiceNumber: string;
    items: PurchaseItem[];
  }>({
    supplier: '',
    invoiceNumber: '',
    items: []
  });

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1,
    unitCost: 0
  });

  const addItemToPurchase = () => {
    if (!newItem.productId || newItem.quantity <= 0 || newItem.unitCost <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all item details",
        variant: "destructive",
      });
      return;
    }

    const selectedProduct = products.find(p => p.id === newItem.productId);
    if (!selectedProduct) return;

    const item: PurchaseItem = {
      productId: newItem.productId,
      productName: selectedProduct.name,
      quantity: newItem.quantity,
      unitCost: newItem.unitCost,
      totalCost: newItem.quantity * newItem.unitCost
    };

    setCurrentPurchase({
      ...currentPurchase,
      items: [...currentPurchase.items, item]
    });

    setNewItem({ productId: '', quantity: 1, unitCost: 0 });
  };

  const completePurchase = () => {
    if (!currentPurchase.supplier || !currentPurchase.invoiceNumber || currentPurchase.items.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in supplier, invoice number and add at least one item",
        variant: "destructive",
      });
      return;
    }

    const total = currentPurchase.items.reduce((sum, item) => sum + item.totalCost, 0);

    const purchase = db.createPurchase({
      supplier: currentPurchase.supplier,
      invoiceNumber: currentPurchase.invoiceNumber,
      items: currentPurchase.items,
      total,
      date: new Date().toISOString().split('T')[0]
    });

    setPurchases([purchase, ...purchases]);
    setCurrentPurchase({ supplier: '', invoiceNumber: '', items: [] });
    setIsNewPurchaseOpen(false);

    toast({
      title: "Purchase Recorded",
      description: `Purchase recorded for KSh ${total.toLocaleString()} and stock updated`,
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Management</h1>
              <p className="text-gray-600">Record purchases and manage inventory</p>
            </div>
            <Dialog open={isNewPurchaseOpen} onOpenChange={setIsNewPurchaseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Purchase
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New Purchase</DialogTitle>
                  <DialogDescription>
                    Record a new purchase and update inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplier">Supplier Name</Label>
                      <Input
                        id="supplier"
                        value={currentPurchase.supplier}
                        onChange={(e) => setCurrentPurchase({ ...currentPurchase, supplier: e.target.value })}
                        placeholder="Enter supplier name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <Input
                        id="invoiceNumber"
                        value={currentPurchase.invoiceNumber}
                        onChange={(e) => setCurrentPurchase({ ...currentPurchase, invoiceNumber: e.target.value })}
                        placeholder="Enter invoice number"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Add Items</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product">Product</Label>
                        <Select value={newItem.productId} onValueChange={(value) => setNewItem({ ...newItem, productId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
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
                        <Label htmlFor="unitCost">Unit Cost (KSh)</Label>
                        <Input
                          id="unitCost"
                          type="number"
                          value={newItem.unitCost}
                          onChange={(e) => setNewItem({ ...newItem, unitCost: Number(e.target.value) })}
                          placeholder="Enter unit cost"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={addItemToPurchase} className="w-full">
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </div>

                  {currentPurchase.items.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-3">Items in Purchase</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentPurchase.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>KSh {item.unitCost}</TableCell>
                              <TableCell>KSh {item.totalCost}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4 text-right">
                        <p className="text-lg font-bold">
                          Total: KSh {currentPurchase.items.reduce((sum, item) => sum + item.totalCost, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsNewPurchaseOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={completePurchase} className="flex-1">
                      Complete Purchase
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Purchase History */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Purchase History
              </CardTitle>
              <CardDescription>
                View and manage all purchase transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purchase ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.id}</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>{purchase.invoiceNumber}</TableCell>
                      <TableCell>{purchase.items.length} items</TableCell>
                      <TableCell>KSh {purchase.total.toLocaleString()}</TableCell>
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

export default Purchases;
