import { useState } from "react";
import toast from "react-hot-toast";
import { type ProductFormData, type FormErrors } from "@/types/product-form";

interface UseProductSubmissionProps {
  formData: Partial<ProductFormData>;
  validateForm: () => { isValid: boolean; errors: FormErrors };
  resetForm: () => void;
}

export function useProductSubmission({
  formData,
  validateForm,
  resetForm,
}: UseProductSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProduct = async (): Promise<boolean> => {
    try {
      // Create FormData for file uploads
      const submitData = new FormData();

      // Add text fields
      submitData.append("name", formData.name ?? "");
      submitData.append("description", formData.description ?? "");
      submitData.append("productType", formData.productType ?? "single");
      submitData.append("price", (formData.price ?? 0).toString());
      submitData.append("stock", (formData.stock ?? 0).toString());
      submitData.append("minOrder", (formData.minOrder ?? 1).toString());
      submitData.append("pickupLocation", formData.pickupLocation ?? "");
      submitData.append("shippingFee", formData.shippingFee ?? "");
      submitData.append(
        "pickupMethods",
        JSON.stringify(
          formData.pickupMethods ?? { selfPickup: false, homeDelivery: false },
        ),
      );

      // Add files
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      if (formData.profileImage) {
        submitData.append("profileImage", formData.profileImage);
      }
      if (formData.video) {
        submitData.append("video", formData.video);
      }
      if (formData.sizeChart) {
        submitData.append("sizeChart", formData.sizeChart);
      }

      const response = await fetch("/api/products", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(errorData.message ?? "เกิดข้อผิดพลาดในการสร้างสินค้า");
      }

      return true;
    } catch (error) {
      console.error("Product creation error:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      // Show first error as toast
      const firstError = Object.values(validation.errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await createProduct();
      toast.success("สร้างสินค้าสำเร็จ!");
      resetForm();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
