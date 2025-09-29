import { forwardRef } from "react";
import { Image, Video } from "lucide-react";
import { type FormSectionProps } from "@/types/product-form";
import FileUploadButton from "./FileUploadButton";

const ProductInfoForm = forwardRef<HTMLDivElement, FormSectionProps>(
  ({ formData, errors, onInputChange, onFileUpload }, ref) => {
    return (
      <div ref={ref} className="rounded-lg bg-white p-6">
        <h2 className="mb-6 text-xl font-bold text-gray-900">ข้อมูลสินค้า</h2>

        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              ชื่อสินค้า <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name ?? ""}
                onChange={(e) => onInputChange("name", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                  errors?.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#892328]"
                }`}
                placeholder="ชื่อสินค้า"
                maxLength={120}
              />
              <span className="absolute top-2 right-3 text-sm text-gray-400">
                {(formData.name ?? "").length}/120
              </span>
            </div>
            {errors?.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* File Upload Buttons */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <FileUploadButton
                label="ภาพสินค้า"
                icon={Image}
                onFileSelect={(file) => onFileUpload("image", file)}
                accept="image/*"
                required
              />
              {errors?.image && (
                <p className="mt-1 text-sm text-red-500">{errors.image}</p>
              )}
            </div>
            <div>
              <FileUploadButton
                label="รูปโปรไฟล์"
                icon={Image}
                onFileSelect={(file) => onFileUpload("profileImage", file)}
                accept="image/*"
                required
              />
              {errors?.profileImage && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.profileImage}
                </p>
              )}
            </div>
            <div>
              <FileUploadButton
                label="วิดีโอสินค้า"
                icon={Video}
                onFileSelect={(file) => onFileUpload("video", file)}
                accept="video/*"
              />
              {errors?.video && (
                <p className="mt-1 text-sm text-red-500">{errors.video}</p>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              รายละเอียดสินค้า <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                value={formData.description ?? ""}
                onChange={(e) => onInputChange("description", e.target.value)}
                rows={6}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                  errors?.description
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#892328]"
                }`}
                placeholder="รายละเอียดสินค้า"
                maxLength={3000}
              />
              <span className="absolute right-3 bottom-3 text-sm text-gray-400">
                {(formData.description ?? "").length}/3000
              </span>
            </div>
            {errors?.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

ProductInfoForm.displayName = "ProductInfoForm";

export default ProductInfoForm;
