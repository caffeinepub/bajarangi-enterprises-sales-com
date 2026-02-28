import { useEffect } from 'react';
import { useGetAllProducts, useGetBusinessInfo } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

export default function Products() {
  const { data: products, isLoading } = useGetAllProducts();
  const { data: businessInfo } = useGetBusinessInfo();

  useEffect(() => {
    document.title = 'Our Products - BAJARANGI ENTERPRISES';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Browse our wide selection of quality agricultural products at competitive prices'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[300px] overflow-hidden">
        <img
          src="/assets/generated/products-showcase.dim_1200x800.png"
          alt="Agricultural products showcase"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Products</h1>
            <p className="text-lg text-gray-200">
              Discover our range of quality agricultural products
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-agricultural-green" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                businessPhone={businessInfo?.contactPhone || '+1234567890'}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <img
              src="/assets/generated/grain-texture.dim_600x400.png"
              alt="No products"
              className="mb-6 h-48 w-48 opacity-50"
            />
            <h2 className="mb-2 text-2xl font-bold text-foreground">No Products Available</h2>
            <p className="text-muted-foreground">
              Check back soon for our latest agricultural products.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
