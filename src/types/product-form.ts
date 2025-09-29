export type FormTab = "product-info" | "sales-info" | "shipping";

// Variant types for multiple product options
export interface VariantOption {
  id: string;
  name: string;
}

export interface VariantGroup {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface VariantCombination {
  id: string;
  combination: Record<string, string>; // variantGroupId -> optionId
  price: number;
  stock: number;
}

// Define ProductFormData interface directly to avoid Zod type complexity
export interface ProductFormData {
  name: string;
  image: File | null;
  profileImage: File | null;
  video?: File | null;
  description: string;
  productType: "single" | "multiple";
  price: number;
  stock: number;
  minOrder: number;
  sizeChart: File | null;
  // Variant data for multiple product type
  variantGroups: VariantGroup[];
  variantCombinations: VariantCombination[];
  pickupMethods: {
    selfPickup: boolean;
    homeDelivery: boolean;
  };
  pickupLocation?: string;
  shippingFee?: string;
}

// Form validation errors
export type FormErrors = Record<string, string>;

export interface FormTabConfig {
  key: FormTab;
  label: string;
  ref: React.RefObject<HTMLDivElement | null>;
}

export interface FileUploadButtonProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  selectedFile?: File | null;
}

export interface FormSectionProps {
  formData: Partial<ProductFormData>;
  errors?: FormErrors;
  onInputChange: (field: string, value: unknown) => void;
  onFileUpload: (field: string, file: File | null) => void;
  onCheckboxChange?: (
    method: "selfPickup" | "homeDelivery",
    checked: boolean,
  ) => void;
  // Variant management functions
  onAddVariantGroup?: () => void;
  onRemoveVariantGroup?: (groupId: string) => void;
  onUpdateVariantGroup?: (groupId: string, name: string) => void;
  onAddVariantOption?: (groupId: string) => void;
  onRemoveVariantOption?: (groupId: string, optionId: string) => void;
  onUpdateVariantOption?: (
    groupId: string,
    optionId: string,
    name: string,
  ) => void;
  onUpdateVariantCombination?: (
    combinationId: string,
    field: "price" | "stock",
    value: number,
  ) => void;
}
