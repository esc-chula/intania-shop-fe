"use client";

import { useState, useEffect } from "react";
import { type Product } from "@/types/product";

interface DeleteConfirmationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string) => void;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  product,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const [step, setStep] = useState<"confirm" | "final">("confirm");
  const [confirmText, setConfirmText] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("confirm");
      setConfirmText("");
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    if (!isLoading) {
      setStep("confirm");
      setConfirmText("");
      onClose();
    }
  };

  const handleFirstConfirm = () => {
    if (step === "confirm") {
      setStep("final");
    }
  };

  const handleFinalConfirm = () => {
    if (product && step === "final" && !isLoading) {
      onConfirm(product.id);
    }
  };

  const isFirstStepEnabled = step === "confirm" && !isLoading;
  const isFinalStepEnabled = step === "final" && !isLoading;

  if (!isOpen || !product) return null;

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
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
              <span className="text-sm font-medium text-gray-700">
                กำลังลบสินค้า...
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {step === "confirm" ? "ลบสินค้า" : "ยืนยันการลบ"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {step === "confirm"
                ? "คุณต้องการลบสินค้านี้หรือไม่?"
                : "การดำเนินการนี้ไม่สามารถยกเลิกได้"}
            </p>
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

        {/* Step Content */}
        {step === "confirm" ? (
          <div className="mb-6">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">คำเตือน:</p>
                  <p>
                    สินค้าที่ลบแล้วจะไม่สามารถกู้คืนได้
                    กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="mb-4 flex items-center gap-3">
                <svg
                  className="h-6 w-6 text-[#892328]"
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
                <div>
                  <p className="font-semibold text-red-800">
                    ยืนยันการลบสินค้า
                  </p>
                  <p className="text-sm text-[#892328]">
                    การดำเนินการนี้จะลบสินค้าออกจากระบบอย่างถาวร
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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

          {step === "confirm" ? (
            <button
              type="button"
              onClick={handleFirstConfirm}
              disabled={!isFirstStepEnabled}
              className={`flex-1 cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isFirstStepEnabled
                  ? "bg-[#892328] text-white shadow-md hover:bg-[#7a1f24] hover:shadow-lg"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              ลบสินค้า
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalConfirm}
              disabled={!isFinalStepEnabled}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isFinalStepEnabled
                  ? "cursor-pointer bg-[#892328] text-white shadow-md hover:bg-[#7a1f24] hover:shadow-lg"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ลบสินค้า...
                </div>
              ) : (
                "ยืนยันการลบ"
              )}
            </button>
          )}
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-4 text-center text-xs text-gray-400">
          กด{" "}
          <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono">Esc</kbd>{" "}
          เพื่อยกเลิก
        </div>
      </div>
    </div>
  );
}
