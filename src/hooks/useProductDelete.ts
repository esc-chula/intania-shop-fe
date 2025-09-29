import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axios";

interface DeleteProductRequest {
  productId: string;
}

interface DeleteProductResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const deleteProduct = async ({
  productId,
}: DeleteProductRequest): Promise<DeleteProductResponse> => {
  const response = await api.delete<DeleteProductResponse>(
    `/products/${productId}`,
  );
  return response.data;
};

export function useProductDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${data.message ?? "ลบสินค้าสำเร็จ"} 🗑️`, {
          duration: 4000,
          style: {
            background: "#EF4444",
            color: "white",
          },
        });
        // Invalidate products query to refetch updated data
        void queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(data.error ?? "เกิดข้อผิดพลาดในการลบสินค้า", {
          duration: 5000,
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "เกิดข้อผิดพลาดในการลบสินค้า", {
        duration: 5000,
        style: {
          background: "#EF4444",
          color: "white",
        },
      });
    },
  });
}
