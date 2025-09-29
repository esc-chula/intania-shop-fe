import { type NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function GET() {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const productId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const productType = formData.get("productType") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const minOrder = Number(formData.get("minOrder"));
    const pickupLocation = formData.get("pickupLocation") as string;
    const shippingFee = formData.get("shippingFee") as string;

    const pickupMethods = {
      selfPickup: formData.get("selfPickup") === "true",
      homeDelivery: formData.get("homeDelivery") === "true",
    };

    // Upload files to Firebase Storage
    const uploadFile = async (file: File, path: string): Promise<string> => {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const fullPath = `${path}/${fileName}`;

      const storageRef = ref(storage, fullPath);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    };

    let imageUrl: string | null = null;
    let profileImageUrl: string | null = null;
    let videoUrl: string | null = null;
    let sizeChartUrl: string | null = null;

    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFile(imageFile, `products/${productId}/images`);
    }

    const profileImageFile = formData.get("profileImage") as File;
    if (profileImageFile && profileImageFile.size > 0) {
      profileImageUrl = await uploadFile(
        profileImageFile,
        `products/${productId}/profile`,
      );
    }

    const videoFile = formData.get("video") as File;
    if (videoFile && videoFile.size > 0) {
      videoUrl = await uploadFile(videoFile, `products/${productId}/videos`);
    }

    const sizeChartFile = formData.get("sizeChart") as File;
    if (sizeChartFile && sizeChartFile.size > 0) {
      sizeChartUrl = await uploadFile(
        sizeChartFile,
        `products/${productId}/charts`,
      );
    }

    const productData = {
      name,
      description,
      productType,
      price,
      stock,
      minOrder,
      pickupMethods,
      status: stock > 0 ? "active" : "out_of_stock",
      sales: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await addDoc(collection(db, "products"), productData);

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create product",
      },
      { status: 500 },
    );
  }
}
