import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { getQueryFn } from '@/lib/queryClient';

type UnauthorizedBehavior = "returnNull" | "throw";

export type ProductFilters = {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
};

export function useProducts(filters: ProductFilters = {}) {
  const queryKey = ['/api/products', filters];

  return useQuery<ProductsResponse, Error>({
    queryKey,
    queryFn: getQueryFn({ on401: "throw" }),
    keepPreviousData: true,
  });
}

export function useProduct(productId: string | undefined) {
  return useQuery<Product, Error>({
    queryKey: [`/api/products/${productId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!productId,
  });
}