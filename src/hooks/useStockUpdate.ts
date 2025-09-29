import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axios";

interface UpdateStockRequest {
  productId: string;
  stock: number;
}

interface UpdateStockResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const updateProductStock = async ({
  productId,
  stock,
}: UpdateStockRequest): Promise<UpdateStockResponse> => {
  const response = await api.patch<UpdateStockResponse>(
    `/products/${productId}`,
    {
      stock,
    },
  );
  return response.data;
};

export function useStockUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductStock,
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success(
          `อัปเดตจำนวนสินค้าเป็น ${variables.stock} ชิ้นสำเร็จ! 🎉`,
          {
            duration: 4000,
            style: {
              background: "#10B981",
              color: "white",
            },
          },
        );
        // Invalidate products query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาดในการอัปเดต", {
          duration: 5000,
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า", {
        duration: 5000,
        style: {
          background: "#EF4444",
          color: "white",
        },
      });
    },
  });
}
