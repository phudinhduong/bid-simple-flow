import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Package, CheckCircle2, Clock } from 'lucide-react';

export default function MyOrders() {
  const { orders } = useData();
  const { user } = useAuth();

  const myOrders = orders.filter(o => o.buyerId === user?.id);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {myOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No orders yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{order.productTitle}</CardTitle>
                    {order.depositPaid ? (
                      <Badge className="bg-success">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Deposit Paid
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Payment
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded">
                      {order.productImage ? (
                        <img src={order.productImage} alt="" className="w-full h-full object-cover rounded" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div>
                          <span className="text-muted-foreground">Seller:</span>
                          <span className="ml-2 font-medium">{order.sellerName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <span className="ml-2 font-medium capitalize">{order.type === 'buynow' ? 'Buy Now' : 'Auction'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Final Price:</span>
                          <span className="ml-2 font-bold text-primary">${order.finalPrice}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deposit:</span>
                          <span className="ml-2 font-medium">${Math.max(order.finalPrice * 0.1, 100).toFixed(2)}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Shipping:</span>
                        <p className="text-sm mt-1">{order.shippingAddress}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
