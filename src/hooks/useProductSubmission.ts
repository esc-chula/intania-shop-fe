import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFormData } from "@/lib/axios";
import { type ProductFormData, type FormErrors } from "@/types/product-form";
import { ProductQueryKeys } from "./useProducts";

interface UseProductSubmissionProps {
  formData: Partial<ProductFormData>;
  validateForm: () => { isValid: boolean; errors: FormErrors };
  resetForm: () => void;
}

interface CreateProductResponse {
  success: boolean;
  error?: string;
}

const createProduct = async (
  formData: FormData,
): Promise<CreateProductResponse> => {
  await apiFormData.post<CreateProductResponse, FormData>(
    "/products",
    formData,
  );

  return { success: true };
};

export function useProductSubmission({
  formData,
  validateForm,
  resetForm,
}: UseProductSubmissionProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      toast.success("สร้างสินค้าสำเร็จ!");
      resetForm();
      await queryClient.invalidateQueries({ queryKey: [ProductQueryKeys] });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "เกิดข้อผิดพลาดในการสร้างสินค้า");
    },
  });

  const handleSubmit = async () => {
    if (mutation.isPending) return;

    const validation = validateForm();
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    const form = new FormData();

    form.append("name", formData.name ?? "");
    form.append("description", formData.description ?? "");
    form.append("productType", formData.productType ?? "single");
    form.append("price", String(formData.price ?? 0));
    form.append("stock", String(formData.stock ?? 0));
    form.append("minOrder", String(formData.minOrder ?? 1));
    form.append(
      "selfPickup",
      String(formData.pickupMethods?.selfPickup ?? false),
    );
    form.append(
      "homeDelivery",
      String(formData.pickupMethods?.homeDelivery ?? false),
    );

    if (formData.pickupLocation)
      form.append("pickupLocation", formData.pickupLocation);
    if (formData.shippingFee) form.append("shippingFee", formData.shippingFee);

    if (formData.image) form.append("image", formData.image);
    if (formData.profileImage)
      form.append("profileImage", formData.profileImage);
    if (formData.video) form.append("video", formData.video);
    if (formData.sizeChart) form.append("sizeChart", formData.sizeChart);

    mutation.mutate(form);
  };

  return {
    isSubmitting: mutation.isPending,
    handleSubmit,
  };
}
