import {
  type VariantGroup,
  type VariantCombination,
} from "@/types/product-form";
import VariantTableRow from "./VariantTableRow";

interface VariantTableProps {
  variantGroups: VariantGroup[];
  variantCombinations: VariantCombination[];
  onUpdateCombination: (
    combinationId: string,
    field: "price" | "stock",
    value: number,
  ) => void;
}

export default function VariantTable({
  variantGroups,
  variantCombinations,
  onUpdateCombination,
}: VariantTableProps) {
  // Don't render if no variant groups or no options
  if (
    variantGroups.length === 0 ||
    variantGroups.every((group) => group.options.length === 0)
  ) {
    return null;
  }

  // Get combination display text (currently unused but may be needed later)
  // const getCombinationText = (combination: VariantCombination) => {
  //   return variantGroups
  //     .map((group) => {
  //       const optionId = combination.combination[group.id];
  //       const option = group.options.find((opt) => opt.id === optionId);
  //       return option?.name ?? "";
  //     })
  //     .filter(Boolean)
  //     .join(" / ");
  // };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {variantGroups.map((group) => (
              <th
                key={group.id}
                className="px-4 py-3 text-left text-sm font-medium text-gray-700"
              >
                {group.name ?? "ตัวเลือก"}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              ราคา
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              คลัง
            </th>
          </tr>
        </thead>
        <tbody>
          {variantCombinations.map((combination) => (
            <VariantTableRow
              key={combination.id}
              combination={combination}
              variantGroups={variantGroups}
              onUpdateCombination={onUpdateCombination}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
