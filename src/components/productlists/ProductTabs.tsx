import { type ProductTab } from "@/types/product";

interface ProductTabsProps {
  activeTab: ProductTab;
  onTabChange: (tab: ProductTab) => void;
  counts: {
    all: number;
    active: number;
    out_of_stock: number;
    inactive: number;
  };
}

export default function ProductTabs({
  activeTab,
  onTabChange,
  counts,
}: ProductTabsProps) {
  const tabs = [
    { key: "all" as ProductTab, label: "ทั้งหมด", count: counts.all },
    // { key: "active" as ProductTab, label: "ขายอยู่", count: counts.active },
    // {
    //   key: "out_of_stock" as ProductTab,
    //   label: "สินค้าหมด",
    //   count: counts.out_of_stock,
    // },
    // {
    //   key: "inactive" as ProductTab,
    //   label: "ยังไม่ขาย",
    //   count: counts.inactive,
    // },
  ];

  return (
    <nav className="flex w-fit rounded-lg bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`cursor-pointer border-b-2 px-11.5 py-4 text-sm font-bold whitespace-nowrap text-black ${
            activeTab === tab.key
              ? "border-[#892328]"
              : "border-transparent hover:border-gray-300"
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </nav>
  );
}
