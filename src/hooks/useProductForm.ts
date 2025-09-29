import { useState, useRef, useCallback } from "react";
import {
  type ProductFormData,
  type FormTab,
  type FormTabConfig,
  type FormErrors,
} from "@/types/product-form";
import { validateField, validateForm } from "@/schemas/product-form";

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

  const tabs: FormTabConfig[] = [
    {
      key: "product-info",
      label: "ข้อมูลสินค้า",
      ref: productInfoRef,
    },
    { key: "sales-info", label: "ข้อมูลการขาย", ref: salesInfoRef },
    { key: "shipping", label: "การจัดส่ง", ref: shippingRef },
  ];

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
  };
}
