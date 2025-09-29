import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { stock: number };
    const { stock } = body;

    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "จำนวนสินค้าต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0",
        },
        { status: 400 },
      );
    }

    const productRef = doc(db, "products", id);

    // Check if product exists
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบสินค้าที่ต้องการแก้ไข",
        },
        { status: 404 },
      );
    }

    // Update stock and status
    const updateData = {
      stock,
      status: stock > 0 ? "active" : "out_of_stock",
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(productRef, updateData);

    return NextResponse.json({
      success: true,
      message: "อัปเดตจำนวนสินค้าสำเร็จ",
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const productRef = doc(db, "products", id);

    // Check if product exists
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบสินค้าที่ต้องการลบ",
        },
        { status: 404 },
      );
    }

    // Delete the product
    await deleteDoc(productRef);

    return NextResponse.json({
      success: true,
      message: "ลบสินค้าสำเร็จ",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดในการลบสินค้า",
      },
      { status: 500 },
    );
  }
}
