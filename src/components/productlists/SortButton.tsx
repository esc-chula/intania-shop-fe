import { ChevronUp, ChevronDown } from "lucide-react";
import { type SortField, type SortOrder } from "@/types/product";

interface SortButtonProps {
  field: SortField;
  currentSortField: SortField | null;
  currentSortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export default function SortButton({
  field,
  currentSortField,
  currentSortOrder,
  onSort,
}: SortButtonProps) {
  const isActive = currentSortField === field;

  return (
    <button
      onClick={() => onSort(field)}
      className="inline-flex size-5 cursor-pointer items-center justify-center rounded-[4px] bg-gray-300 text-[#637381] hover:text-gray-600"
    >
      {isActive ? (
        currentSortOrder === "asc" ? (
          <ChevronUp className="size-2.5 text-[#637381]" />
        ) : (
          <ChevronDown className="size-2.5 text-[#637381]" />
        )
      ) : (
        <div className="flex flex-col">
          <ChevronUp className="-mb-1 h-3 w-3" />
          <ChevronDown className="h-3 w-3" />
        </div>
      )}
    </button>
  );
}
