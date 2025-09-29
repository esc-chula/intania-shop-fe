import { z } from "zod";
import { type ProductFormData } from "@/types/product-form";

// File validation schema
const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "ไฟล์ต้องมีขนาดไม่เกิน 10MB",
  });

const imageFileSchema = fileSchema.refine(
  (file) => file.type.startsWith("image/"),
  {
    message: "กรุณาเลือกไฟล์รูปภาพเท่านั้น",
  },
);

const videoFileSchema = fileSchema.refine(
  (file) => file.type.startsWith("video/"),
  {
    message: "กรุณาเลือกไฟล์วิดีโอเท่านั้น",
  },
);

const documentFileSchema = fileSchema.refine(
  (file) =>
    file.type.startsWith("image/") ||
    file.type === "application/pdf" ||
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  {
    message: "กรุณาเลือกไฟล์รูปภาพ, PDF หรือ Word เท่านั้น",
  },
);

// Main product form schema
export const productFormSchema = z.object({
  // Product Information
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อสินค้า")
    .max(120, "ชื่อสินค้าต้องไม่เกิน 120 ตัวอักษร")
    .trim(),

  image: z
    .instanceof(File, { message: "กรุณาเพิ่มภาพสินค้า" })
    .pipe(imageFileSchema),

  profileImage: z
    .instanceof(File, { message: "กรุณาเพิ่มรูปโปรไฟล์" })
    .pipe(imageFileSchema),

  video: z.instanceof(File).pipe(videoFileSchema).optional().nullable(),

  description: z
    .string()
    .min(1, "กรุณากรอกรายละเอียดสินค้า")
    .max(3000, "รายละเอียดสินค้าต้องไม่เกิน 3000 ตัวอักษร")
    .trim(),

  // Sales Information
  productType: z.enum(["single", "multiple"], {
    errorMap: () => ({ message: "กรุณาเลือกประเภทสินค้า" }),
  }),

  price: z
    .number({ invalid_type_error: "กรุณากรอกราคาเป็นตัวเลข" })
    .positive("ราคาต้องมากกว่า 0")
    .max(999999, "ราคาต้องไม่เกิน 999,999 บาท"),

  stock: z
    .number({ invalid_type_error: "กรุณากรอกจำนวนคลังเป็นตัวเลข" })
    .int("จำนวนคลังต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคลังต้องไม่น้อยกว่า 0"),

  minOrder: z
    .number({ invalid_type_error: "กรุณากรอกจำนวนการสั่งขั้นต่ำเป็นตัวเลข" })
    .int("จำนวนการสั่งขั้นต่ำต้องเป็นจำนวนเต็ม")
    .positive("จำนวนการสั่งขั้นต่ำต้องมากกว่า 0"),

  sizeChart: z
    .instanceof(File, { message: "กรุณาเพิ่มตารางขนาดสินค้า" })
    .pipe(documentFileSchema),

  // Shipping Information
  pickupMethods: z
    .object({
      selfPickup: z.boolean(),
      homeDelivery: z.boolean(),
    })
    .refine((data) => data.selfPickup || data.homeDelivery, {
      message: "กรุณาเลือกวิธีการรับสินค้าอย่างน้อย 1 วิธี",
      path: ["pickupMethods"],
    }),

  pickupLocation: z.string().trim().optional(),

  shippingFee: z.string().trim().optional(),
});

// Type inference from schema (for internal validation use)
export type ProductFormDataZod = z.infer<typeof productFormSchema>;

// Custom validation functions
export const validateField = (
  field: keyof ProductFormData,
  value: unknown,
): { isValid: boolean; error?: string } => {
  try {
    // Create a temporary object with just this field
    const testData = { [field]: value } as Partial<ProductFormData>;

    // Validate the specific field using the full schema
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productFormSchema.pick({ [field]: true } as any).parse(testData);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }
    return { isValid: false, error: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล" };
  }
};

export const validateForm = (
  data: Partial<ProductFormData>,
): { isValid: boolean; errors: Record<string, string> } => {
  try {
    productFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return {
      isValid: false,
      errors: { general: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล" },
    };
  }
};
