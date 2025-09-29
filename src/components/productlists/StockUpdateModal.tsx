"use client";

import { useState, useEffect, useRef } from "react";
import { type Product } from "@/types/product";

interface StockUpdateModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (productId: string, newStock: number) => void;
}

export default function StockUpdateModal({
  product,
  isOpen,
  onClose,
  onUpdate,
}: StockUpdateModalProps) {
  const [stock, setStock] = useState(product.stock);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStock(product.stock);
      setError(null);
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, product.stock]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (stock < 0) {
      setError("จำนวนสินค้าต้องไม่น้อยกว่า 0");
      return;
    }

    if (stock === product.stock) {
      setError("จำนวนสินค้าไม่เปลี่ยนแปลง");
      return;
    }

    setIsLoading(true);

    try {
      await onUpdate(product.id, stock);
      onClose();
    } catch (error) {
      console.error("Error updating stock:", error);
      setError("เกิดข้อผิดพลาดในการอัปเดต กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockChange = (newStock: number) => {
    setStock(newStock);
    setError(null);
  };

  const handleQuickAdjust = (adjustment: number) => {
    const newStock = Math.max(0, stock + adjustment);
    handleStockChange(newStock);
  };

  const handleClose = () => {
    if (!isLoading) {
      setStock(product.stock); // Reset to original value
      setError(null);
      onClose();
    }
  };

  const stockDifference = stock - product.stock;
  const hasChanges = stockDifference !== 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="bg-opacity-60 absolute inset-0 cursor-pointer bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="bg-opacity-90 absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#892328] border-t-transparent"></div>
              <span className="text-sm font-medium text-gray-700">
                กำลังอัปเดต...
              </span>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              แก้ไขจำนวนสินค้า
            </h2>
            <p className="mt-1 text-sm text-gray-500">ปรับจำนวนสินค้าในคลัง</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="ปิด"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600">SKU: {product.sku}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">จำนวนปัจจุบัน:</span>
                <span className="text-lg font-semibold text-[#892328]">
                  {product.stock}
                </span>
                <span className="text-sm text-gray-600">ชิ้น</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="stock"
                className="text-sm font-medium text-gray-700"
              >
                จำนวนสินค้าใหม่
              </label>
              {hasChanges && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-500">เปลี่ยนแปลง:</span>
                  <span
                    className={`font-semibold ${
                      stockDifference > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stockDifference > 0 ? "+" : ""}
                    {stockDifference}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Adjust Buttons */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">ปรับเร็ว:</span>
              {[-10, -5, -1, +1, +5, +10].map((adjustment) => (
                <button
                  key={adjustment}
                  type="button"
                  onClick={() => handleQuickAdjust(adjustment)}
                  disabled={isLoading || stock + adjustment < 0}
                  className="cursor-pointer rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adjustment > 0 ? "+" : ""}
                  {adjustment}
                </button>
              ))}
            </div>

            {/* Stock Input */}
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => handleStockChange(Number(e.target.value))}
                min="0"
                className={`w-full rounded-lg border px-4 py-3 text-lg font-medium transition-colors focus:ring-2 focus:outline-none ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : hasChanges
                      ? "border-[#892328] focus:border-[#892328] focus:ring-[#892328]/20"
                      : "border-gray-300 focus:border-[#892328] focus:ring-[#892328]/20"
                }`}
                placeholder="0"
                disabled={isLoading}
              />
              <div className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500">
                ชิ้น
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading || !hasChanges || !!error}
              className={`flex-1 cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                hasChanges && !error && !isLoading
                  ? "bg-[#892328] text-white shadow-md hover:bg-[#7a1f24] hover:shadow-lg"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  อัปเดต...
                </div>
              ) : (
                `อัปเดตเป็น ${stock} ชิ้น`
              )}
            </button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="mt-4 text-center text-xs text-gray-400">
            กด{" "}
            <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono">
              Ctrl+Enter
            </kbd>{" "}
            เพื่ออัปเดต หรือ{" "}
            <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono">Esc</kbd>{" "}
            เพื่อยกเลิก
          </div>
        </form>
      </div>
    </div>
  );
}
