import { useEffect } from 'react';
import { useGetBusinessInfo } from '../hooks/useQueries';
import { Leaf, Users, Award, Heart } from 'lucide-react';

export default function About() {
  const { data: businessInfo } = useGetBusinessInfo();

  useEffect(() => {
    document.title = 'About Us - BAJARANGI ENTERPRISES';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Learn more about BAJARANGI ENTERPRISES and our commitment to quality agricultural products'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-agricultural-green py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">About Us</h1>
          <p className="text-lg text-white/90">
            Your trusted partner in agricultural excellence
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <img
              src="/assets/generated/farmer-working.dim_800x600.png"
              alt="Farmer working in agricultural field"
              className="h-full w-full rounded-lg object-cover shadow-lg"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground">
              {businessInfo?.businessName || 'BAJARANGI ENTERPRISES'}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="whitespace-pre-wrap">
                {businessInfo?.aboutText ||
                  'BAJARANGI ENTERPRISES is your trusted source for quality agricultural products. We are committed to providing farmers and agricultural businesses with the best products at competitive prices.\n\nWith years of experience in the agricultural industry, we understand the needs of our customers and strive to deliver excellence in every transaction. Our mission is to support the agricultural community with reliable products and exceptional service.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-earth-light py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Why Choose Us</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-agricultural-green/10">
                <Leaf className="h-8 w-8 text-agricultural-green" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Quality Products</h3>
              <p className="text-muted-foreground">
                Only the finest agricultural products, carefully selected for excellence
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-agricultural-green/10">
                <Users className="h-8 w-8 text-agricultural-green" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Expert Service</h3>
              <p className="text-muted-foreground">
                Knowledgeable team ready to assist with your agricultural needs
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-agricultural-green/10">
                <Award className="h-8 w-8 text-agricultural-green" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Trusted Brand</h3>
              <p className="text-muted-foreground">
                Years of experience serving the agricultural community
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-agricultural-green/10">
                <Heart className="h-8 w-8 text-agricultural-green" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Customer Focus</h3>
              <p className="text-muted-foreground">
                Your satisfaction is our top priority in everything we do
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
