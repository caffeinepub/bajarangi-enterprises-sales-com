import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGetBusinessInfo, useUpdateBusinessInfo } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

export default function AdminBusinessInfo() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { data: businessInfo, isLoading } = useGetBusinessInfo();
  const updateBusinessInfo = useUpdateBusinessInfo();

  const [formData, setFormData] = useState({
    businessName: '',
    contactPhone: '',
    contactEmail: '',
    businessAddress: '',
    aboutText: '',
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (businessInfo) {
      setFormData({
        businessName: businessInfo.businessName,
        contactPhone: businessInfo.contactPhone,
        contactEmail: businessInfo.contactEmail,
        businessAddress: businessInfo.businessAddress,
        aboutText: businessInfo.aboutText,
      });
    }
  }, [businessInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessInfo.mutate(formData);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-agricultural-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Business Information</h1>
          <p className="mt-2 text-muted-foreground">
            Update your business contact details and information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="businessAddress">Business Address</Label>
            <Textarea
              id="businessAddress"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              required
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="aboutText">About Text</Label>
            <Textarea
              id="aboutText"
              value={formData.aboutText}
              onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
              required
              rows={6}
              className="mt-1"
            />
            <p className="mt-1 text-sm text-muted-foreground">
              This text will appear on your About page and home page
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={updateBusinessInfo.isPending}
              className="bg-agricultural-green hover:bg-agricultural-green-dark"
            >
              {updateBusinessInfo.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/admin' })}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
