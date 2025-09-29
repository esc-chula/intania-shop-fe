export type FormTab = "product-info" | "sales-info" | "shipping";

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
}
