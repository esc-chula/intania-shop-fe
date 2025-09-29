import { Plus, Trash2 } from "lucide-react";
import { type VariantGroup } from "@/types/product-form";

interface VariantSectionProps {
  variantGroups: VariantGroup[];
  onAddVariantGroup: () => void;
  onRemoveVariantGroup: (groupId: string) => void;
  onUpdateVariantGroup: (groupId: string, name: string) => void;
  onAddVariantOption: (groupId: string) => void;
  onRemoveVariantOption: (groupId: string, optionId: string) => void;
  onUpdateVariantOption: (
    groupId: string,
    optionId: string,
    name: string,
  ) => void;
}

export default function VariantSection({
  variantGroups,
  onAddVariantGroup,
  onRemoveVariantGroup,
  onUpdateVariantGroup,
  onAddVariantOption,
  onRemoveVariantOption,
  onUpdateVariantOption,
}: VariantSectionProps) {
  return (
    <div className="space-y-6">
      {variantGroups.map((group, groupIndex) => (
        <div key={group.id} className="rounded-lg border border-gray-200 p-4">
          {/* Variant Group Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                ตัวเลือกสินค้า {groupIndex + 1}
              </label>
              <div className="text-sm text-gray-400">
                {group.options.length}/14
              </div>
            </div>
            {variantGroups.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveVariantGroup(group.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Variant Group Name */}
          <div className="mb-4">
            <input
              type="text"
              value={group.name}
              onChange={(e) => onUpdateVariantGroup(group.id, e.target.value)}
              placeholder="สี"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#892328] focus:outline-none"
            />
          </div>

          {/* Variant Options */}
          <div className="space-y-2">
            {group.options.map((option, optionIndex) => (
              <div key={option.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option.name}
                  onChange={(e) =>
                    onUpdateVariantOption(group.id, option.id, e.target.value)
                  }
                  placeholder={optionIndex === 0 ? "สีแดง" : "สีดำ"}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-[#892328] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onAddVariantOption(group.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:text-[#892328]"
                >
                  <Plus className="h-4 w-4" />
                </button>
                {group.options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveVariantOption(group.id, option.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Option Button */}
          {group.options.length === 0 && (
            <button
              type="button"
              onClick={() => onAddVariantOption(group.id)}
              className="mt-2 flex items-center gap-2 text-sm text-[#892328] hover:text-[#7a1f24]"
            >
              <Plus className="h-4 w-4" />
              เพิ่มตัวเลือก
            </button>
          )}
        </div>
      ))}

      {/* Add Variant Group Button */}
      <button
        type="button"
        onClick={onAddVariantGroup}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 text-gray-500 hover:border-[#892328] hover:text-[#892328]"
      >
        <Plus className="h-4 w-4" />
        เพิ่มตัวเลือกสินค้า
      </button>
    </div>
  );
}
