export interface Product {
  id: string;
  name: string;
  sku: string;
  productCode: string;
  image: string;
  sales: number;
  price: number;
  stock: number;
  status: "active" | "out_of_stock" | "inactive";
  createdAt: string;
}

export type SortField = "sales" | "price" | "stock";
export type SortOrder = "asc" | "desc";
export type ProductTab = "all" | "active" | "out_of_stock" | "inactive";
