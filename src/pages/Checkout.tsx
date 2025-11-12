import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as 'bid' | 'buynow';
  
  const { products, addOrder, bids } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const [shippingAddress, setShippingAddress] = useState('');

  const product = products.find(p => p.id === id);
  const isWinningBidder = type === 'bid' && bids
    .filter(b => b.productId === id)
    .sort((a, b) => b.amount - a.amount)[0]?.buyerId === user?.id;

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  const finalPrice = type === 'buynow' ? (product.buyNowPrice || product.currentPrice) : product.currentPrice;
  const depositAmount = Math.max(finalPrice * 0.1, 100);

  const handleCheckout = () => {
    if (!user) return;

    if (type === 'bid' && !isWinningBidder) {
      toast({ title: 'You are not the winning bidder', variant: 'destructive' });
      return;
    }

    if (!shippingAddress.trim()) {
      toast({ title: 'Please enter shipping address', variant: 'destructive' });
      return;
    }

    // Get seller info (in real app, would fetch from database)
    const sellerName = 'Seller Name'; // Placeholder

    addOrder({
      productId: product.id,
      buyerId: user.id,
      sellerName,
      productTitle: product.title,
      productImage: product.images[0] || '',
      finalPrice,
      shippingAddress,
      depositPaid: false,
      type,
    });

    navigate(`/deposit/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 p-4 bg-muted rounded">
              <div className="w-24 h-24 bg-background rounded">
                {product.images[0] ? (
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                <p className="text-xl font-bold text-primary">${finalPrice}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="shipping">Shipping Address</Label>
              <Textarea
                id="shipping"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your full shipping address..."
                rows={4}
              />
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Product Price</span>
                  <span className="font-semibold">${finalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Deposit Required (10% or min $100)</span>
                  <span>${depositAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full" size="lg">
              Proceed to Deposit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
