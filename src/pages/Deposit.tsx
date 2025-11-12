import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, CreditCard } from 'lucide-react';

export default function Deposit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, orders, updateOrderDeposit } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const product = products.find(p => p.id === id);
  const order = orders.find(o => o.productId === id && o.buyerId === user?.id);

  if (!product || !order) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }

  const depositAmount = Math.max(order.finalPrice * 0.1, 100);

  const handlePayDeposit = () => {
    // Simulate payment
    setTimeout(() => {
      updateOrderDeposit(order.id);
      toast({ title: 'Deposit paid successfully!' });
      navigate('/orders');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Deposit Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Deposit Amount</p>
              <p className="text-4xl font-bold text-primary">${depositAmount.toFixed(2)}</p>
            </div>

            <div className="space-y-2 text-sm">
              <p><strong>Product:</strong> {product.title}</p>
              <p><strong>Final Price:</strong> ${order.finalPrice}</p>
              <p><strong>Remaining:</strong> ${(order.finalPrice - depositAmount).toFixed(2)}</p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> This is a simulated payment. In a real application, this would integrate with a payment gateway.
              </p>
            </div>

            <Button onClick={handlePayDeposit} className="w-full" size="lg">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Pay Deposit (Simulated)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
