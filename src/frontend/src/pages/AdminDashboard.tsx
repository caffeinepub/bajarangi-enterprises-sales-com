import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Package, Settings, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGetBusinessInfo } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { data: businessInfo } = useGetBusinessInfo();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Admin Access</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back! Manage {businessInfo?.businessName || 'BAJARANGI ENTERPRISES'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-agricultural-green/10">
                <Package className="h-6 w-6 text-agricultural-green" />
              </div>
              <CardTitle>Manage Products</CardTitle>
              <CardDescription>
                Add, edit, or remove products from your catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate({ to: '/admin/products' })}
                className="w-full bg-agricultural-green hover:bg-agricultural-green-dark"
              >
                Go to Products
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-agricultural-green/10">
                <Settings className="h-6 w-6 text-agricultural-green" />
              </div>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update contact details and business information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate({ to: '/admin/business-info' })}
                className="w-full bg-agricultural-green hover:bg-agricultural-green-dark"
              >
                Edit Information
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
