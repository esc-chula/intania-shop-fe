import {
  type VariantGroup,
  type VariantCombination,
} from "@/types/product-form";

interface VariantTableRowProps {
  combination: VariantCombination;
  variantGroups: VariantGroup[];
  onUpdateCombination: (
    combinationId: string,
    field: "price" | "stock",
    value: number,
  ) => void;
}

export default function VariantTableRow({
  combination,
  variantGroups,
  onUpdateCombination,
}: VariantTableRowProps) {
  return (
    <tr className="border-b border-gray-100">
      {/* Variant Options */}
      {variantGroups.map((group) => {
        const optionId = combination.combination[group.id];
        const option = group.options.find((opt) => opt.id === optionId);
        return (
          <td key={group.id} className="px-4 py-3 text-sm text-gray-900">
            {option?.name ?? "-"}
          </td>
        );
      })}

      {/* Price Input */}
      <td className="px-4 py-3">
        <input
          type="number"
          value={combination.price}
          onChange={(e) =>
            onUpdateCombination(combination.id, "price", Number(e.target.value))
          }
          placeholder="ใส่ราคา"
          min="0"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#892328] focus:outline-none"
        />
      </td>

      {/* Stock Input */}
      <td className="px-4 py-3">
        <input
          type="number"
          value={combination.stock}
          onChange={(e) =>
            onUpdateCombination(combination.id, "stock", Number(e.target.value))
          }
          placeholder="0"
          min="0"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#892328] focus:outline-none"
        />
      </td>
    </tr>
  );
}
