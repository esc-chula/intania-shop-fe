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
import { type VariantGroup, type VariantCombination } from "@/types/product";

interface ProductDataToSave {
  name: string;
  description: string;
  productType: string;
  price: number;
  stock: number;
  minOrder: number;
  pickupMethods: {
    selfPickup: boolean;
    homeDelivery: boolean;
  };
  status: string;
  sales: number;
  createdAt: string;
  updatedAt: string;
  pickupLocation?: string;
  shippingFee?: string;
  image?: string;
  profileImage?: string;
  video?: string;
  sizeChart?: string;
  variantGroups?: VariantGroup[];
  variantCombinations?: VariantCombination[];
}

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

    let variantGroups: VariantGroup[] | null = null;
    let variantCombinations: VariantCombination[] | null = null;
    let calculatedPrice: number;
    let calculatedStock: number;

    // Parse variant data
    const variantGroupsData = formData.get("variantGroups");
    if (variantGroupsData) {
      try {
        variantGroups = JSON.parse(
          variantGroupsData as string,
        ) as VariantGroup[];
      } catch (error) {
        console.warn("Failed to parse variant groups data:", error);
      }
    }

    const variantCombinationsData = formData.get("variantCombinations");
    if (variantCombinationsData) {
      try {
        variantCombinations = JSON.parse(
          variantCombinationsData as string,
        ) as VariantCombination[];
      } catch (error) {
        console.warn("Failed to parse variant combinations data:", error);
      }
    }

    // Calculate price and stock based on product type
    if (productType === "multiple") {
      // For multiple variants, validate that we have combinations
      if (!variantCombinations || variantCombinations.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Multiple product type requires variant combinations",
          },
          { status: 400 }
        );
      }

      // Calculate from variant combinations
      calculatedPrice = Math.min(
        ...variantCombinations.map((combo) => combo.price),
      );
      calculatedStock = variantCombinations.reduce(
        (total, combo) => total + combo.stock,
        0,
      );
    } else {
      // For single products, use form values
      calculatedPrice = price;
      calculatedStock = stock;
    }

    const productData: ProductDataToSave = {
      name,
      description,
      productType,
      price: calculatedPrice,
      stock: calculatedStock,
      minOrder,
      pickupMethods,
      status: calculatedStock > 0 ? "active" : "out_of_stock",
      sales: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (pickupLocation) productData.pickupLocation = pickupLocation;
    if (shippingFee) productData.shippingFee = shippingFee;
    if (imageUrl) productData.image = imageUrl;
    if (profileImageUrl) productData.profileImage = profileImageUrl;
    if (videoUrl) productData.video = videoUrl;
    if (sizeChartUrl) productData.sizeChart = sizeChartUrl;

    if (productType === "multiple") {
      if (variantGroups) productData.variantGroups = variantGroups;
      if (variantCombinations)
        productData.variantCombinations = variantCombinations;
    }

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
