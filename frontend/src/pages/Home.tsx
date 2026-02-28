import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Leaf } from 'lucide-react';
import { useGetBusinessInfo } from '../hooks/useQueries';
import { Button } from '../components/ui/button';

export default function Home() {
  const navigate = useNavigate();
  const { data: businessInfo } = useGetBusinessInfo();

  useEffect(() => {
    document.title = 'Home - BAJARANGI ENTERPRISES';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'BAJARANGI ENTERPRISES - Your trusted source for quality agricultural products'
      );
    }
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] overflow-hidden">
        <img
          src="/assets/generated/hero-agriculture.dim_1920x600.png"
          alt="Agriculture hero showing green crop fields"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl text-white">
            <div className="mb-4 flex items-center gap-2">
              <Leaf className="h-8 w-8 text-agricultural-green" />
              <span className="text-lg font-semibold text-agricultural-green">
                Quality Agricultural Products
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {businessInfo?.businessName || 'BAJARANGI ENTERPRISES'}
            </h1>
            <p className="mb-8 text-lg text-gray-200 md:text-xl">
              {businessInfo?.aboutText ||
                'Your trusted partner for premium agricultural products. Quality you can count on, service you can trust.'}
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/products' })}
              className="bg-agricultural-green text-lg hover:bg-agricultural-green-dark"
            >
              View Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-earth-light py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-agricultural-green/10">
                <Leaf className="h-6 w-6 text-agricultural-green" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Quality Products</h3>
              <p className="text-muted-foreground">
                We offer only the finest agricultural products, carefully selected for quality and freshness.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-agricultural-green/10">
                <Leaf className="h-6 w-6 text-agricultural-green" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Competitive Prices</h3>
              <p className="text-muted-foreground">
                Get the best value for your money with our competitive pricing and regular updates.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-agricultural-green/10">
                <Leaf className="h-6 w-6 text-agricultural-green" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Easy Ordering</h3>
              <p className="text-muted-foreground">
                Simply browse our products and call us to place your order. It's that easy!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
