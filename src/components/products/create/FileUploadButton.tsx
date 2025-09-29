import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { type FileUploadButtonProps } from "@/types/product-form";

export default function FileUploadButton({
  label,
  icon: Icon,
  onFileSelect,
  accept = "image/*,video/*",
  required = false,
  selectedFile = null,
}: FileUploadButtonProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (file: File | null) => {
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
  };

  const isImage = selectedFile?.type.startsWith("image/");
  const isVideo = selectedFile?.type.startsWith("video/");

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* File Upload Button */}
      <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#892328] px-4 py-2 text-white hover:bg-[#7a1f24]">
        <Icon className="h-4 w-4" />
        {selectedFile ? "เปลี่ยนไฟล์" : "เพิ่มรูปภาพ"}
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
        />
      </label>

      {/* Preview Section */}
      {selectedFile && previewUrl && (
        <div className="relative mt-2">
          {isImage && (
            <div className="relative flex items-center justify-center">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-48 w-48 rounded-lg border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 cursor-pointer rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {isVideo && (
            <div className="relative flex items-center justify-center">
              <video
                src={previewUrl}
                className="h-48 w-full rounded-lg border border-gray-200 object-cover"
                controls
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 cursor-pointer rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* File name display for non-image/video files */}
          {!isImage && !isVideo && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
              <span className="truncate text-sm text-gray-700">
                {selectedFile.name}
              </span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="ml-2 cursor-pointer rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
