import { type FileUploadButtonProps } from "@/types/product-form";

export default function FileUploadButton({
  label,
  icon: Icon,
  onFileSelect,
  accept = "image/*,video/*",
  required = false,
}: FileUploadButtonProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#892328] px-4 py-2 text-white hover:bg-[#7a1f24]">
        <Icon className="h-4 w-4" />
        เพิ่มรูปภาพ
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
