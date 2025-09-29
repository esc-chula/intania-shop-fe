"use client";

import { useState, useMemo } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useProducts, useFilteredProducts } from "@/hooks/useProducts";
import { useStockUpdate } from "@/hooks/useStockUpdate";
import {
  type ProductTab,
  type SortField,
  type SortOrder,
} from "@/types/product";
import {
  ProductTable,
  SearchBar,
  ProductTabs,
} from "@/components/productlists";

const ITEMS_PER_PAGE = 5;

export default function ProductListsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ProductTab>("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products from Firestore
  const { products, loading, error, refetch } = useProducts();

  // Stock update mutation
  const stockUpdateMutation = useStockUpdate();

  // Filter and sort products
  const { filteredProducts: sortedProducts, tabCounts } = useFilteredProducts(
    products,
    searchQuery,
    activeTab,
    sortField,
    sortOrder,
  );

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleTabChange = (tab: ProductTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    await stockUpdateMutation.mutateAsync({ productId, stock: newStock });
  };

  const getTabContent = (tab: ProductTab) => {
    switch (tab) {
      case "active":
        return "hi ขายอยู่...";
      case "out_of_stock":
        return "hi สินค้าหมด...";
      case "inactive":
        return "hi ยังไม่ขาย...";
      default:
        return null;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">สินค้า</h1>
          </div>
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">กำลังโหลดสินค้า...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">สินค้า</h1>
          </div>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mb-2 text-red-500">{error}</div>
              <button
                onClick={() => void refetch()}
                className="rounded-lg bg-[#892328] px-4 py-2 text-white hover:bg-[#7a1f24]"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm",
          duration: 4000,
        }}
      />
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">สินค้า</h1>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <ProductTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={tabCounts}
          />
        </div>

        {/* Tab Content for non-all tabs */}
        {activeTab !== "all" && (
          <div className="mb-6 rounded-lg bg-white p-4 text-center text-gray-500">
            {getTabContent(activeTab)}
          </div>
        )}

        {/* Search and Actions */}
        <div className="mb-6 flex items-center gap-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ชื่อสินค้า, รหัส SKU, รหัสสินค้า"
          />
          <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-50">
            <Plus className="h-4 w-4" />
            เพิ่มสินค้า
          </button>
          <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-50">
            <ShoppingCart className="h-4 w-4" />
            Manual Order
          </button>
        </div>

        {/* Products List */}
        {activeTab === "all" && (
          <ProductTable
            products={paginatedProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onPageChange={setCurrentPage}
            onStockUpdate={handleStockUpdate}
            hasResults={sortedProducts.length > 0}
          />
        )}
      </div>
    </div>
  );
}
