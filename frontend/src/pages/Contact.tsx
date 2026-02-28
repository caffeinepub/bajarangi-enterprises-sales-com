import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useGetBusinessInfo } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function Contact() {
  const { data: businessInfo } = useGetBusinessInfo();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    document.title = 'Contact Us - BAJARANGI ENTERPRISES';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Get in touch with BAJARANGI ENTERPRISES for all your agricultural product needs'
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your message! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[300px] overflow-hidden">
        <img
          src="/assets/generated/contact-background.dim_1600x900.png"
          alt="Contact us background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
            <p className="text-lg text-gray-200">We'd love to hear from you</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Get In Touch</h2>
            <p className="mb-8 text-muted-foreground">
              Have questions about our products? Want to place an order? Contact us using the
              information below or fill out the form.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-agricultural-green/10">
                  <Phone className="h-6 w-6 text-agricultural-green" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">Phone</h3>
                  <a
                    href={`tel:${businessInfo?.contactPhone || '+1234567890'}`}
                    className="text-agricultural-green hover:underline"
                  >
                    {businessInfo?.contactPhone || '+1234567890'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-agricultural-green/10">
                  <Mail className="h-6 w-6 text-agricultural-green" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">Email</h3>
                  <a
                    href={`mailto:${businessInfo?.contactEmail || 'contact@bajarangi.com'}`}
                    className="text-agricultural-green hover:underline"
                  >
                    {businessInfo?.contactEmail || 'contact@bajarangi.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-agricultural-green/10">
                  <MapPin className="h-6 w-6 text-agricultural-green" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">Address</h3>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {businessInfo?.businessAddress || 'Business Address'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-agricultural-green hover:bg-agricultural-green-dark"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
