import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus, Edit, Trash2, Loader2, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGetAllProducts, useDeleteProduct } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Product } from '../backend';

export default function AdminProducts() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { data: products, isLoading } = useGetAllProducts();
  const deleteProduct = useDeleteProduct();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; productId: string | null }>({
    open: false,
    productId: null,
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (productId: string) => {
    setDeleteConfirm({ open: true, productId });
  };

  const confirmDelete = () => {
    if (deleteConfirm.productId) {
      deleteProduct.mutate(deleteConfirm.productId);
    }
    setDeleteConfirm({ open: false, productId: null });
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Products</h1>
            <p className="mt-2 text-muted-foreground">Add, edit, or remove products from your catalog</p>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-agricultural-green hover:bg-agricultural-green-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-agricultural-green" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="rounded-lg border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Short Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.imageUrl || '/assets/generated/grain-texture.dim_600x400.png'}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/generated/grain-texture.dim_600x400.png';
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.shortDescription}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="text-agricultural-green hover:bg-agricultural-green/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border bg-white p-12 text-center">
            <Package className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-bold text-foreground">No Products Yet</h2>
            <p className="mb-6 text-muted-foreground">Get started by adding your first product</p>
            <Button
              onClick={handleAddNew}
              className="bg-agricultural-green hover:bg-agricultural-green-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>

      <ProductFormModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, productId: null })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
