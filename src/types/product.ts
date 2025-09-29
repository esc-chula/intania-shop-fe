export interface Product {
  id: string;
  name: string;
  sku?: string;
  productCode?: string;
  image: string;
  profileImage?: string;
  video?: string;
  description: string;
  productType: "single" | "multiple";
  price: number;
  stock: number;
  minOrder: number;
  sales: number;
  sizeChart?: string;
  pickupMethods: {
    selfPickup: boolean;
    homeDelivery: boolean;
  };
  pickupLocation?: string;
  shippingFee?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ProductStatus {
  ACTIVE = "active",
  OUT_OF_STOCK = "out_of_stock",
  INACTIVE = "inactive",
}

export interface CreateProductData {
  name: string;
  image?: string;
  profileImage?: string;
  video?: string;
  description: string;
  productType: "single" | "multiple";
  price: number;
  stock: number;
  minOrder: number;
  sizeChart?: string;
  pickupMethods: {
    selfPickup: boolean;
    homeDelivery: boolean;
  };
  pickupLocation?: string;
  shippingFee?: string;
  status?: ProductStatus;
}

export type SortField = "sales" | "price" | "stock";
export type SortOrder = "asc" | "desc";
export type ProductTab = "all" | "active" | "out_of_stock" | "inactive";
