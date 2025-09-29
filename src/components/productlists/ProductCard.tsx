"use client";

import { useState } from "react";
import { type Product, ProductStatus } from "@/types/product";
import StockUpdateModal from "./StockUpdateModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ProductCardProps {
  product: Product;
  onStockUpdate?: (productId: string, newStock: number) => Promise<void>;
  onDelete?: (productId: string) => Promise<void>;
}

export default function ProductCard({
  product,
  onStockUpdate,
  onDelete,
}: ProductCardProps) {
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleStockUpdate = async (productId: string, newStock: number) => {
    if (onStockUpdate) {
      await onStockUpdate(productId, newStock);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (productId: string) => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        await onDelete(productId);
        setIsDeleteModalOpen(false);
      } catch (error) {
        // Error is handled by the hook
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusText = (status: Product["status"]) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "แก้ไข/ดูเพิ่มเติม";
      case ProductStatus.OUT_OF_STOCK:
        return "แก้ไข/ดูเพิ่มเติม";
      case ProductStatus.INACTIVE:
        return "แก้ไข/ดูเพิ่มเติม";
      default:
        return "แก้ไข/ดูเพิ่มเติม";
    }
  };

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50">
        {/* Product Image and Info */}
        <td className="px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">SKU : {product.sku}</p>
              <p className="text-sm text-gray-600">
                รหัสสินค้า : {product.productCode}
              </p>
              <p className="text-sm text-gray-600">
                ลงสินค้า : {product.createdAt}
              </p>
            </div>
          </div>
        </td>

        {/* Sales */}
        <td className="p-4 text-center">
          <span className="text-lg font-medium">{product.sales}</span>
        </td>

        {/* Price */}
        <td className="p-4 text-center">
          <span className="text-lg font-medium">฿{product.price}</span>
        </td>

        {/* Stock */}
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-medium">{product.stock}</span>
          </div>
        </td>

        {/* Actions */}
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            {/* Primary Action - Edit Stock */}
            <button
              onClick={() => setIsStockModalOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#892328] bg-white px-3 py-2 text-sm font-medium text-[#892328] transition-colors hover:bg-[#892328] hover:text-white focus:ring-2 focus:ring-[#892328] focus:ring-offset-2 focus:outline-none"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              แก้ไขสต็อก
            </button>

            {/* Secondary Action - Delete (More subtle) */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              title="ลบสินค้า"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {/* Stock Update Modal */}
      <StockUpdateModal
        product={product}
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onUpdate={handleStockUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        product={product}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
