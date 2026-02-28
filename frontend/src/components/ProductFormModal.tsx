import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAddProduct, useUpdateProduct } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import type { Product } from '../backend';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const isEditMode = !!product;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    shortDescription: '',
    fullDescription: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        imageUrl: product.imageUrl,
      });
    } else {
      setFormData({
        name: '',
        price: '',
        shortDescription: '',
        fullDescription: '',
        imageUrl: '',
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      imageUrl: formData.imageUrl,
    };

    if (isEditMode && product) {
      await updateProduct.mutateAsync({ id: product.id, ...productData });
    } else {
      await addProduct.mutateAsync(productData);
    }

    onClose();
  };

  const isPending = addProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
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
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              required
              rows={2}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea
              id="fullDescription"
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              required
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
              className="mt-1"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <p className="mb-1 text-sm text-muted-foreground">Preview:</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-32 w-full rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/generated/grain-texture.dim_600x400.png';
                  }}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-agricultural-green hover:bg-agricultural-green-dark"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>{isEditMode ? 'Update Product' : 'Add Product'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
