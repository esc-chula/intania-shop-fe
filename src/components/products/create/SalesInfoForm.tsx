import { forwardRef } from "react";
import { FileText } from "lucide-react";
import { type FormSectionProps } from "@/types/product-form";
import FileUploadButton from "./FileUploadButton";
import VariantSection from "./VariantSection";
import VariantTable from "./VariantTable";

const SalesInfoForm = forwardRef<HTMLDivElement, FormSectionProps>(
  (
    {
      formData,
      errors,
      onInputChange,
      onFileUpload,
      onAddVariantGroup,
      onRemoveVariantGroup,
      onUpdateVariantGroup,
      onAddVariantOption,
      onRemoveVariantOption,
      onUpdateVariantOption,
      onUpdateVariantCombination,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className="rounded-lg bg-white p-6">
        <h2 className="mb-6 text-xl font-bold text-gray-900">ข้อมูลการขาย</h2>

        <div className="space-y-6">
          {/* Product Type */}
          <div>
            <label className="mb-4 block text-sm font-medium text-gray-700">
              ประเภท
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="productType"
                  value="single"
                  checked={formData.productType === "single"}
                  onChange={(e) => onInputChange("productType", e.target.value)}
                  className="text-[#892328] focus:ring-[#892328]"
                />
                <span className="text-sm">สินค้าต่อเนื่องเดียว</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="productType"
                  value="multiple"
                  checked={formData.productType === "multiple"}
                  onChange={(e) => onInputChange("productType", e.target.value)}
                  className="text-[#892328] focus:ring-[#892328]"
                />
                <span className="text-sm">สินค้าหลายตัวเลือก</span>
              </label>
            </div>
          </div>

          {/* Variant Section - Show only when productType is "multiple" */}
          {formData.productType === "multiple" && (
            <div>
              <VariantSection
                variantGroups={formData.variantGroups ?? []}
                onAddVariantGroup={onAddVariantGroup!}
                onRemoveVariantGroup={onRemoveVariantGroup!}
                onUpdateVariantGroup={onUpdateVariantGroup!}
                onAddVariantOption={onAddVariantOption!}
                onRemoveVariantOption={onRemoveVariantOption!}
                onUpdateVariantOption={onUpdateVariantOption!}
              />
            </div>
          )}

          {/* Variant Combinations Table */}
          {formData.productType === "multiple" && (
            <div>
              <VariantTable
                variantGroups={formData.variantGroups ?? []}
                variantCombinations={formData.variantCombinations ?? []}
                onUpdateCombination={onUpdateVariantCombination!}
              />
            </div>
          )}

          {/* Price, Stock, Min Order - Show only when productType is "single" */}
          {formData.productType === "single" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  ราคา <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price ?? 0}
                  onChange={(e) =>
                    onInputChange("price", Number(e.target.value))
                  }
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    errors?.price
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#892328]"
                  }`}
                  placeholder="฿"
                  min="0"
                />
                {errors?.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  คลัง <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.stock ?? 0}
                  onChange={(e) =>
                    onInputChange("stock", Number(e.target.value))
                  }
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    errors?.stock
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#892328]"
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors?.stock && (
                  <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  จำนวนการสั่งขั้นต่ำ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.minOrder ?? 1}
                  onChange={(e) =>
                    onInputChange("minOrder", Number(e.target.value))
                  }
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
                    errors?.minOrder
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-[#892328]"
                  }`}
                  placeholder="1"
                  min="1"
                />
                {errors?.minOrder && (
                  <p className="mt-1 text-sm text-red-500">{errors.minOrder}</p>
                )}
              </div>
            </div>
          )}

          {/* Size Chart Upload */}
          <div>
            <FileUploadButton
              label="ตารางขนาดสินค้า"
              icon={FileText}
              onFileSelect={(file) => onFileUpload("sizeChart", file)}
              accept="image/*,.pdf,.doc,.docx"
              required
            />
            {errors?.sizeChart && (
              <p className="mt-1 text-sm text-red-500">{errors.sizeChart}</p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

SalesInfoForm.displayName = "SalesInfoForm";

export default SalesInfoForm;
