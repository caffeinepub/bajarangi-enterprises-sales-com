import { useNavigate } from '@tanstack/react-router';
import { Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
  businessPhone: string;
}

export default function ProductCard({ product, businessPhone }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div
        className="cursor-pointer overflow-hidden"
        onClick={() => navigate({ to: `/products/${product.id}` })}
      >
        <img
          src={product.imageUrl || '/assets/generated/grain-texture.dim_600x400.png'}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/assets/generated/grain-texture.dim_600x400.png';
          }}
        />
      </div>
      <CardHeader>
        <h3
          className="cursor-pointer text-xl font-bold text-foreground transition-colors hover:text-agricultural-green"
          onClick={() => navigate({ to: `/products/${product.id}` })}
        >
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-agricultural-green">₹{product.price.toFixed(2)}</p>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1 bg-agricultural-green hover:bg-agricultural-green-dark"
          onClick={() => {
            window.location.href = `tel:${businessPhone}`;
          }}
        >
          <Phone className="mr-2 h-4 w-4" />
          Call to Order
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate({ to: `/products/${product.id}` })}
          className="border-agricultural-green text-agricultural-green hover:bg-agricultural-green/10"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
