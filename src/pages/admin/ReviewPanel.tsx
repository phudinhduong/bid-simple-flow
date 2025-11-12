import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useData, Product } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Eye } from 'lucide-react';

export default function ReviewPanel() {
  const { products, updateProductStatus } = useData();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingProducts = products.filter(p => p.status === 'pending');

  const handleApprove = (productId: string) => {
    const startTime = Date.now();
    updateProductStatus(productId, 'active', undefined, startTime);
    toast({ title: 'Product approved!' });
    setSelectedProduct(null);
  };

  const handleReject = (productId: string) => {
    if (!rejectionReason) {
      toast({ title: 'Please provide a rejection reason', variant: 'destructive' });
      return;
    }
    updateProductStatus(productId, 'rejected', rejectionReason);
    toast({ title: 'Product rejected' });
    setSelectedProduct(null);
    setRejectionReason('');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Review Panel</h1>

        {pendingProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No pending products to review
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded mb-3">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Start Price:</strong> ${product.startPrice}</p>
                    <p><strong>Evidence:</strong> {product.evidenceImages.length} images</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.title}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Product Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-full h-32 object-cover rounded" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Evidence Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.evidenceImages.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-full h-32 object-cover rounded" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Description:</strong> {selectedProduct.description}</p>
                  <p><strong>Category:</strong> {selectedProduct.category}</p>
                  <p><strong>Starting Price:</strong> ${selectedProduct.startPrice}</p>
                  <p><strong>Bid Step:</strong> ${selectedProduct.bidStep}</p>
                  {selectedProduct.buyNowPrice && (
                    <p><strong>Buy Now:</strong> ${selectedProduct.buyNowPrice}</p>
                  )}
                  <p><strong>Duration:</strong> {selectedProduct.duration} minutes</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Rejection Reason (if rejecting)</h3>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleApprove(selectedProduct.id)}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedProduct.id)}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
