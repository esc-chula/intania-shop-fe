import { type Product, type SortField, type SortOrder } from "@/types/product";
import ProductCard from "./ProductCard";
import SortButton from "./SortButton";
import Pagination from "./Pagination";

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  sortField: SortField | null;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onPageChange: (page: number) => void;
  onStockUpdate?: (productId: string, newStock: number) => void;
  hasResults?: boolean;
}

export default function ProductTable({
  products,
  currentPage,
  totalPages,
  sortField,
  sortOrder,
  onSort,
  onPageChange,
  onStockUpdate,
  hasResults = true,
}: ProductTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="rounded-t-lg border-b border-gray-200 bg-gray-50">
            <th className="px-8 py-4 text-left">
              <span className="font-medium text-black">สินค้า</span>
            </th>
            <th className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="font-medium text-black">ยอดขาย</span>
                <SortButton
                  field="sales"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              </div>
            </th>
            <th className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="font-medium text-black">ราคา</span>
                <SortButton
                  field="price"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              </div>
            </th>
            <th className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="font-medium text-black">คลัง</span>
                <SortButton
                  field="stock"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={onSort}
                />
              </div>
            </th>
            <th className="p-4 text-center">
              <span className="font-medium text-black">การดำเนินการ</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onStockUpdate={onStockUpdate}
            />
          ))}
        </tbody>
      </table>

      {/* No Results */}
      {!hasResults && (
        <div className="p-8 text-center text-gray-500">
          ไม่พบสินค้าที่ตรงกับการค้นหา
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
