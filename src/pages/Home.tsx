import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { Search, Clock, TrendingUp } from 'lucide-react';

export default function Home() {
  const { products } = useData();
  const [search, setSearch] = useState('');
  const [activeProducts, setActiveProducts] = useState(products.filter(p => p.status === 'active'));

  useEffect(() => {
    const filtered = products
      .filter(p => p.status === 'active')
      .filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      );
    setActiveProducts(filtered);
  }, [search, products]);

  const formatTime = (endTime: number) => {
    const diff = endTime - Date.now();
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Active Auctions</h1>
          <p className="text-muted-foreground">Discover amazing deals and bid on your favorite items</p>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {activeProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No active auctions at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-muted relative">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-accent">
                      <Clock className="h-3 w-3 mr-1" />
                      {product.endTime && formatTime(product.endTime)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Price</p>
                      <p className="text-2xl font-bold text-primary">${product.currentPrice}</p>
                    </div>
                    {product.buyNowPrice && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Buy Now</p>
                        <p className="text-lg font-semibold text-accent">${product.buyNowPrice}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link to={`/product/${product.id}`} className="w-full">
                    <Button className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
