import { useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Phone, Loader2 } from 'lucide-react';
import { useGetProduct, useGetBusinessInfo } from '../hooks/useQueries';
import { Button } from '../components/ui/button';

export default function ProductDetail() {
  const { id } = useParams({ from: '/products/$id' });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(id);
  const { data: businessInfo } = useGetBusinessInfo();

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - BAJARANGI ENTERPRISES`;
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-agricultural-green" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
          <Button onClick={() => navigate({ to: '/products' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/products' })}
          className="mb-6 text-agricultural-green hover:bg-agricultural-green/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <img
              src={product.imageUrl || '/assets/generated/grain-texture.dim_600x400.png'}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/assets/generated/grain-texture.dim_600x400.png';
              }}
            />
          </div>

          <div className="flex flex-col">
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>

            <div className="mb-6">
              <span className="text-3xl font-bold text-agricultural-green">
                ₹{product.price.toFixed(2)}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Description</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{product.fullDescription}</p>
            </div>

            <div className="mt-auto">
              <Button
                size="lg"
                className="w-full bg-agricultural-green text-lg hover:bg-agricultural-green-dark md:w-auto"
                onClick={() => {
                  window.location.href = `tel:${businessInfo?.contactPhone || '+1234567890'}`;
                }}
              >
                <Phone className="mr-2 h-5 w-5" />
                Click to Call & Order
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                Call us at{' '}
                <a
                  href={`tel:${businessInfo?.contactPhone || '+1234567890'}`}
                  className="font-medium text-agricultural-green hover:underline"
                >
                  {businessInfo?.contactPhone || '+1234567890'}
                </a>{' '}
                to place your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
