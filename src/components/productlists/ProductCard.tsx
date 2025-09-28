import Link from "next/link";
import { type Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getStatusText = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "แก้ไข/ดูเพิ่มเติม";
      case "out_of_stock":
        return "แก้ไข/ดูเพิ่มเติม";
      case "inactive":
        return "แก้ไข/ดูเพิ่มเติม";
      default:
        return "แก้ไข/ดูเพิ่มเติม";
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      {/* Product Image and Info */}
      <td className="px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600">SKU : {product.sku}</p>
            <p className="text-sm text-gray-600">
              รหัสสินค้า : {product.productCode}
            </p>
            <p className="text-sm text-gray-600">
              ลงสินค้า : {product.createdAt}
            </p>
          </div>
        </div>
      </td>

      {/* Sales */}
      <td className="p-4 text-center">
        <span className="text-lg font-medium">{product.sales}</span>
      </td>

      {/* Price */}
      <td className="p-4 text-center">
        <span className="text-lg font-medium">฿{product.price}</span>
      </td>

      {/* Stock */}
      <td className="p-4 text-center">
        <span className="text-lg font-medium">{product.stock}</span>
      </td>

      {/* Actions */}
      <td className="p-4 text-center">
        <Link
          href={`/products/${product.id}/edit`}
          className="text-sm text-[#892328] hover:underline"
        >
          {getStatusText(product.status)}
        </Link>
      </td>
    </tr>
  );
}
