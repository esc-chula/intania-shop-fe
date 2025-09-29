import { type FormTab, type FormTabConfig } from "@/types/product-form";

interface FormTabsProps {
  activeTab: FormTab;
  tabs: FormTabConfig[];
  onTabClick: (tab: FormTab) => void;
}

export default function FormTabs({
  activeTab,
  tabs,
  onTabClick,
}: FormTabsProps) {
  return (
    <nav className="mb-8 flex w-fit rounded-lg bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabClick(tab.key)}
          className={`cursor-pointer border-b-2 px-11.5 py-4 text-sm font-bold whitespace-nowrap text-black ${
            activeTab === tab.key
              ? "border-[#892328]"
              : "border-transparent hover:border-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
