import { z } from "zod";
import { type ProductFormData } from "@/types/product-form";

// Validation helper functions
export const createSingleProductValidation = (
  data: Partial<ProductFormData>,
  ctx: z.RefinementCtx,
) => {
  if (!data.price || data.price <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณากรอกราคาสินค้า",
      path: ["price"],
    });
  }

  if (data.stock === undefined || data.stock < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณากรอกจำนวนคลัง",
      path: ["stock"],
    });
  }
};

export const createMultipleProductValidation = (
  data: Partial<ProductFormData>,
  ctx: z.RefinementCtx,
) => {
  // Validate variant groups existence
  if (!data.variantGroups || data.variantGroups.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาเพิ่มตัวเลือกสินค้าอย่างน้อย 1 กลุ่ม",
      path: ["variantGroups"],
    });
    return;
  }

  // Validate each variant group
  data.variantGroups.forEach((group, groupIndex: number) => {
    validateVariantGroup(group, groupIndex, ctx);
  });

  // Validate variant combinations
  if (data.variantCombinations) {
    validateVariantCombinations(data.variantCombinations, ctx);
  }
};

const validateVariantGroup = (
  group: { name: string; options: { name: string }[] },
  groupIndex: number,
  ctx: z.RefinementCtx,
) => {
  if (!group.name.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณากรอกชื่อกลุ่มตัวเลือก",
      path: ["variantGroups", groupIndex, "name"],
    });
  }

  if (group.options.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาเพิ่มตัวเลือกอย่างน้อย 1 ตัว",
      path: ["variantGroups", groupIndex, "options"],
    });
  } else {
    // Validate each option
    group.options.forEach((option, optionIndex: number) => {
      if (!option.name.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "กรุณากรอกชื่อตัวเลือก",
          path: ["variantGroups", groupIndex, "options", optionIndex, "name"],
        });
      }
    });
  }
};

const validateVariantCombinations = (
  combinations: { price: number; stock: number }[],
  ctx: z.RefinementCtx,
) => {
  if (!combinations || combinations.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ไม่พบการผสมผสานตัวเลือก กรุณาตรวจสอบตัวเลือกสินค้า",
      path: ["variantCombinations"],
    });
    return;
  }

  combinations.forEach((combination, combIndex) => {
    if (!combination.price || combination.price <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณากรอกราคาสำหรับการผสมผสานนี้",
        path: ["variantCombinations", combIndex, "price"],
      });
    }

    if (combination.stock === undefined || combination.stock < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณากรอกจำนวนคลังสำหรับการผสมผสานนี้",
        path: ["variantCombinations", combIndex, "stock"],
      });
    }
  });
};

export const validatePickupMethods = (
  data: Partial<ProductFormData>,
  ctx: z.RefinementCtx,
) => {
  if (!data.pickupMethods?.selfPickup && !data.pickupMethods?.homeDelivery) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาเลือกวิธีการรับสินค้าอย่างน้อย 1 วิธี",
      path: ["pickupMethods"],
    });
  }
};
