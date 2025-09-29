"use client";

import { Toaster } from "react-hot-toast";
import {
  FormTabs,
  ProductInfoForm,
  SalesInfoForm,
  ShippingForm,
} from "@/components/products/create";
import { useProductForm } from "@/hooks/useProductForm";
import { useProductSubmission } from "@/hooks/useProductSubmission";

export default function CreateProductPage() {
  const {
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
    validateForm,
    resetForm,
  } = useProductForm();

  const { isSubmitting, handleSubmit } = useProductSubmission({
    formData,
    validateForm,
    resetForm,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">เพิ่มสินค้า</h1>
        </div>

        {/* Navigation Tabs */}
        <FormTabs
          activeTab={activeTab}
          tabs={tabs}
          onTabClick={handleTabClick}
        />

        {/* Form Content */}
        <div className="space-y-8">
          {/* Product Information Section */}
          <ProductInfoForm
            ref={productInfoRef}
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />

          {/* Sales Information Section */}
          <SalesInfoForm
            ref={salesInfoRef}
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
          />

          {/* Shipping Section */}
          <ShippingForm
            ref={shippingRef}
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onCheckboxChange={handleCheckboxChange}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-[#892328] px-8 py-3 font-medium text-white hover:bg-[#7a1f24] focus:ring-2 focus:ring-[#892328] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "กำลังสร้างสินค้า..." : "สร้างสินค้า"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
