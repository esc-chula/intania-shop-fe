// Dedicated types for variant functionality
export interface VariantOption {
  readonly id: string;
  name: string;
}

export interface VariantGroup {
  readonly id: string;
  name: string;
  options: VariantOption[];
}

export interface VariantCombination {
  readonly id: string;
  readonly combination: Readonly<Record<string, string>>;
  price: number;
  stock: number;
}

// Utility types
export type VariantFieldType = "price" | "stock";

export interface VariantValidationResult {
  isValid: boolean;
  errors: string[];
}

// Event handler types
export type VariantGroupHandler = (groupId: string) => void;
export type VariantGroupUpdateHandler = (groupId: string, name: string) => void;
export type VariantOptionHandler = (groupId: string) => void;
export type VariantOptionUpdateHandler = (
  groupId: string,
  optionId: string,
  name: string,
) => void;
export type VariantOptionRemoveHandler = (
  groupId: string,
  optionId: string,
) => void;
export type VariantCombinationUpdateHandler = (
  combinationId: string,
  field: VariantFieldType,
  value: number,
) => void;

// Component prop interfaces
export interface VariantManagementProps {
  variantGroups: VariantGroup[];
  onAddVariantGroup: VariantGroupHandler;
  onRemoveVariantGroup: VariantGroupHandler;
  onUpdateVariantGroup: VariantGroupUpdateHandler;
  onAddVariantOption: VariantOptionHandler;
  onRemoveVariantOption: VariantOptionRemoveHandler;
  onUpdateVariantOption: VariantOptionUpdateHandler;
}

export interface VariantTableProps {
  variantGroups: VariantGroup[];
  variantCombinations: VariantCombination[];
  onUpdateCombination: VariantCombinationUpdateHandler;
}
