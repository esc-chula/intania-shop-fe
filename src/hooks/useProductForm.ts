import { useState, useRef, useCallback, useMemo } from "react";
import {
  type ProductFormData,
  type FormTab,
  type FormTabConfig,
  type FormErrors,
  type VariantGroup,
} from "@/types/product-form";
import { validateField, validateForm } from "@/schemas/product-form";
import {
  generateVariantCombinations,
  createUniqueId,
} from "@/utils/variant-utils";

const initialFormData: Partial<ProductFormData> = {
  name: "",
  image: null,
  profileImage: null,
  video: null,
  description: "",
  productType: "single",
  price: 0,
  stock: 0,
  minOrder: 1,
  sizeChart: null,
  variantGroups: [],
  variantCombinations: [],
  pickupMethods: {
    selfPickup: false,
    homeDelivery: false,
  },
  pickupLocation: "",
  shippingFee: "",
};

export function useProductForm() {
  const [activeTab, setActiveTab] = useState<FormTab>("product-info");
  const [formData, setFormData] =
    useState<Partial<ProductFormData>>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const productInfoRef = useRef<HTMLDivElement>(null);
  const salesInfoRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: FormTab) => {
    setActiveTab(tab);
    const targetRef = tabs.find((t) => t.key === tab)?.ref;
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const validateFieldValue = useCallback(
    (field: keyof ProductFormData, value: unknown) => {
      const validation = validateField(field, value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (validation.isValid) {
          delete newErrors[field];
        } else {
          newErrors[field] = validation.error ?? "ข้อมูลไม่ถูกต้อง";
        }
        return newErrors;
      });
      return validation.isValid;
    },
    [],
  );

  const handleFileUpload = useCallback(
    (field: string, file: File | null) => {
      const typedField = field as keyof ProductFormData;
      setFormData((prev) => ({ ...prev, [typedField]: file }));
      setTouchedFields((prev) => new Set(prev).add(typedField));

      // Validate file immediately
      if (file) {
        validateFieldValue(typedField, file);
      }
    },
    [validateFieldValue],
  );

  const handleInputChange = useCallback(
    (field: string, value: unknown) => {
      const typedField = field as keyof ProductFormData;
      setFormData((prev) => ({ ...prev, [typedField]: value }));
      setTouchedFields((prev) => new Set(prev).add(typedField));

      // Real-time validation for touched fields
      if (touchedFields.has(typedField)) {
        validateFieldValue(typedField, value);
      }
    },
    [touchedFields, validateFieldValue],
  );

  const handleCheckboxChange = useCallback(
    (method: "selfPickup" | "homeDelivery", checked: boolean) => {
      const currentPickupMethods = formData.pickupMethods ?? {
        selfPickup: false,
        homeDelivery: false,
      };
      const newPickupMethods = {
        ...currentPickupMethods,
        [method]: checked,
      };

      setFormData((prev) => ({
        ...prev,
        pickupMethods: newPickupMethods,
      }));

      setTouchedFields((prev) => new Set(prev).add("pickupMethods"));

      // Validate pickup methods
      if (touchedFields.has("pickupMethods")) {
        validateFieldValue("pickupMethods", newPickupMethods);
      }
    },
    [formData.pickupMethods, touchedFields, validateFieldValue],
  );

  // Memoized tabs configuration
  const tabs: FormTabConfig[] = useMemo(
    () => [
      {
        key: "product-info",
        label: "ข้อมูลสินค้า",
        ref: productInfoRef,
      },
      { key: "sales-info", label: "ข้อมูลการขาย", ref: salesInfoRef },
      { key: "shipping", label: "การจัดส่ง", ref: shippingRef },
    ],
    [productInfoRef, salesInfoRef, shippingRef],
  );

  // Memoized variant groups validation (for future use)
  // const validVariantGroups = useMemo(() => {
  //   return (formData.variantGroups ?? []).filter(isValidVariantGroup);
  // }, [formData.variantGroups]);

  // Memoized combinations generation (for future use)
  // const currentCombinations = useMemo(() => {
  //   return generateVariantCombinations(validVariantGroups);
  // }, [validVariantGroups]);

  // Variant management functions
  const handleAddVariantGroup = useCallback(() => {
    const newGroup: VariantGroup = {
      id: createUniqueId("group"),
      name: "",
      options: [
        {
          id: createUniqueId("option"),
          name: "",
        },
      ],
    };

    const newVariantGroups = [...(formData.variantGroups ?? []), newGroup];
    const newCombinations = generateVariantCombinations(newVariantGroups);

    setFormData((prev) => ({
      ...prev,
      variantGroups: newVariantGroups,
      variantCombinations: newCombinations,
    }));
  }, [formData.variantGroups]);

  const handleRemoveVariantGroup = useCallback(
    (groupId: string) => {
      const newVariantGroups = (formData.variantGroups ?? []).filter(
        (group) => group.id !== groupId,
      );
      const newCombinations = generateVariantCombinations(newVariantGroups);

      setFormData((prev) => ({
        ...prev,
        variantGroups: newVariantGroups,
        variantCombinations: newCombinations,
      }));
    },
    [formData.variantGroups],
  );

  const handleUpdateVariantGroup = useCallback(
    (groupId: string, name: string) => {
      const newVariantGroups = (formData.variantGroups ?? []).map((group) =>
        group.id === groupId ? { ...group, name } : group,
      );
      setFormData((prev) => ({
        ...prev,
        variantGroups: newVariantGroups,
      }));
    },
    [formData.variantGroups],
  );

  const handleAddVariantOption = useCallback(
    (groupId: string) => {
      const newVariantGroups = (formData.variantGroups ?? []).map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: [
                ...group.options,
                {
                  id: createUniqueId("option"),
                  name: "",
                },
              ],
            }
          : group,
      );
      const newCombinations = generateVariantCombinations(newVariantGroups);

      setFormData((prev) => ({
        ...prev,
        variantGroups: newVariantGroups,
        variantCombinations: newCombinations,
      }));
    },
    [formData.variantGroups],
  );

  const handleRemoveVariantOption = useCallback(
    (groupId: string, optionId: string) => {
      const newVariantGroups = (formData.variantGroups ?? []).map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.filter((option) => option.id !== optionId),
            }
          : group,
      );
      const newCombinations = generateVariantCombinations(newVariantGroups);

      setFormData((prev) => ({
        ...prev,
        variantGroups: newVariantGroups,
        variantCombinations: newCombinations,
      }));
    },
    [formData.variantGroups],
  );

  const handleUpdateVariantOption = useCallback(
    (groupId: string, optionId: string, name: string) => {
      const newVariantGroups = (formData.variantGroups ?? []).map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.map((option) =>
                option.id === optionId ? { ...option, name } : option,
              ),
            }
          : group,
      );
      setFormData((prev) => ({
        ...prev,
        variantGroups: newVariantGroups,
      }));
    },
    [formData.variantGroups],
  );

  const handleUpdateVariantCombination = useCallback(
    (combinationId: string, field: "price" | "stock", value: number) => {
      const newVariantCombinations = (formData.variantCombinations ?? []).map(
        (combination) =>
          combination.id === combinationId
            ? { ...combination, [field]: value }
            : combination,
      );
      setFormData((prev) => ({
        ...prev,
        variantCombinations: newVariantCombinations,
      }));
    },
    [formData.variantCombinations],
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setActiveTab("product-info");
    setErrors({});
    setTouchedFields(new Set());
  }, []);

  const validateFormData = useCallback((): {
    isValid: boolean;
    errors: FormErrors;
  } => {
    const validation = validateForm(formData);
    setErrors(validation.errors);

    // Mark all fields as touched to show errors
    const allFields = new Set([
      "name",
      "image",
      "profileImage",
      "description",
      "productType",
      "price",
      "stock",
      "minOrder",
      "sizeChart",
      "pickupMethods",
    ]);
    setTouchedFields(allFields);

    return validation;
  }, [formData]);

  const getFieldError = useCallback(
    (field: keyof ProductFormData): string | undefined => {
      return touchedFields.has(field) ? errors[field] : undefined;
    },
    [errors, touchedFields],
  );

  return {
    activeTab,
    formData,
    errors,
    tabs,
    productInfoRef,
    salesInfoRef,
    shippingRef,
    handleTabClick,
    handleFileUpload,
    handleInputChange,
    handleCheckboxChange,
    resetForm,
    validateForm: validateFormData,
    getFieldError,
    // Variant management functions
    handleAddVariantGroup,
    handleRemoveVariantGroup,
    handleUpdateVariantGroup,
    handleAddVariantOption,
    handleRemoveVariantOption,
    handleUpdateVariantOption,
    handleUpdateVariantCombination,
  };
}
