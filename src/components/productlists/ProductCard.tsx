"use client";

import { useState } from "react";
import { type Product, ProductStatus } from "@/types/product";
import StockUpdateModal from "./StockUpdateModal";

interface ProductCardProps {
  product: Product;
  onStockUpdate?: (productId: string, newStock: number) => void;
}

export default function ProductCard({
  product,
  onStockUpdate,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStockUpdate = async (productId: string, newStock: number) => {
    if (onStockUpdate) {
      await onStockUpdate(productId, newStock);
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
            <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md">
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
          <button
            onClick={() => setIsModalOpen(true)}
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
        </td>
      </tr>

      {/* Stock Update Modal */}
      <StockUpdateModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleStockUpdate}
      />
    </>
  );
}
