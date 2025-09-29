import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  type Product,
  type ProductTab,
  type SortField,
  type SortOrder,
  ProductStatus,
} from "@/types/product";

interface ProductsResponse {
  products: Product[];
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<ProductsResponse>("/products");
  return response.data.products;
};

export const ProductQueryKeys = "products";

export function useProducts() {
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [ProductQueryKeys],
    queryFn: fetchProducts,
  });

  return {
    products,
    loading: isLoading,
    error: error?.message,
    refetch,
  };
}

export function useFilteredProducts(
  products: Product[],
  searchQuery: string,
  activeTab: ProductTab,
  sortField: SortField | null,
  sortOrder: SortOrder,
) {
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeTab !== "all") {
      filtered = filtered.filter((product) => product.status === activeTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ??
          product.sku?.toLowerCase().includes(query) ??
          product.productCode?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [products, activeTab, searchQuery]);

  const sortedProducts = useMemo(() => {
    if (!sortField) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredProducts, sortField, sortOrder]);

  const tabCounts = useMemo(() => {
    const counts = {
      all: products.length,
      active: products.filter((p) => p.status === ProductStatus.ACTIVE).length,
      out_of_stock: products.filter(
        (p) => p.status === ProductStatus.OUT_OF_STOCK,
      ).length,
      inactive: products.filter((p) => p.status === ProductStatus.INACTIVE)
        .length,
    };
    return counts;
  }, [products]);

  return {
    filteredProducts: sortedProducts,
    tabCounts,
  };
}
