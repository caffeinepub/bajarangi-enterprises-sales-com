import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, BusinessInfo, ProductId } from '../backend';
import { toast } from 'sonner';

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: ProductId) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getProduct(id);
      } catch (error) {
        console.error('Error fetching product:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetBusinessInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<BusinessInfo>({
    queryKey: ['businessInfo'],
    queryFn: async () => {
      if (!actor) {
        return {
          businessName: 'BAJARANGI ENTERPRISES',
          contactPhone: '+1234567890',
          contactEmail: 'contact@bajarangi.com',
          businessAddress: 'Business Address',
          aboutText: 'About BAJARANGI ENTERPRISES',
        };
      }
      return actor.getBusinessInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      price: number;
      shortDescription: string;
      fullDescription: string;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addProduct(
        data.name,
        data.price,
        data.shortDescription,
        data.fullDescription,
        data.imageUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add product: ${error.message}`);
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: ProductId;
      name: string;
      price: number;
      shortDescription: string;
      fullDescription: string;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateProduct(
        data.id,
        data.name,
        data.price,
        data.shortDescription,
        data.fullDescription,
        data.imageUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ProductId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });
}

export function useUpdateBusinessInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      businessName: string;
      contactPhone: string;
      contactEmail: string;
      businessAddress: string;
      aboutText: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateBusinessInfo(
        data.businessName,
        data.contactPhone,
        data.contactEmail,
        data.businessAddress,
        data.aboutText
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessInfo'] });
      toast.success('Business information updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update business info: ${error.message}`);
    },
  });
}
