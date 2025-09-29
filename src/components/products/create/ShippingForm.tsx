import { forwardRef } from "react";
import { type FormSectionProps } from "@/types/product-form";

const ShippingForm = forwardRef<HTMLDivElement, FormSectionProps>(
  ({ formData, errors, onInputChange, onCheckboxChange }, ref) => {
    if (!onCheckboxChange) {
      throw new Error("onCheckboxChange is required for ShippingForm");
    }

    return (
      <div ref={ref} className="rounded-lg bg-white p-6">
        <h2 className="mb-6 text-xl font-bold text-gray-900">การจัดส่ง</h2>

        <div className="space-y-6">
          {/* Pickup Methods */}
          <div>
            <label className="mb-4 block text-sm font-medium text-gray-700">
              การรับสินค้า
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.pickupMethods?.selfPickup ?? false}
                  onChange={(e) =>
                    onCheckboxChange("selfPickup", e.target.checked)
                  }
                  className="rounded text-[#892328] focus:ring-[#892328]"
                />
                <span className="text-sm">มารับที่คณะวิศวกรรมศาสตร์</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.pickupMethods?.homeDelivery ?? false}
                  onChange={(e) =>
                    onCheckboxChange("homeDelivery", e.target.checked)
                  }
                  className="rounded text-[#892328] focus:ring-[#892328]"
                />
                <span className="text-sm">ส่งโปรดักชั่น</span>
              </label>
            </div>
            {errors?.pickupMethods && (
              <p className="mt-1 text-sm text-red-500">
                {errors.pickupMethods}
              </p>
            )}
          </div>

          {/* Pickup Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              จุดนัดรับสินค้า
            </label>
            <input
              type="text"
              value={formData.pickupLocation ?? ""}
              onChange={(e) => onInputChange("pickupLocation", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#892328] focus:outline-none"
              placeholder="จุดนัดรับสินค้า"
            />
          </div>

          {/* Shipping Fee */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              ค่าส่งโปรดักชั่น
            </label>
            <input
              type="text"
              value={formData.shippingFee ?? ""}
              onChange={(e) => onInputChange("shippingFee", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#892328] focus:outline-none"
              placeholder="฿"
            />
          </div>
        </div>
      </div>
    );
  },
);

ShippingForm.displayName = "ShippingForm";

export default ShippingForm;
