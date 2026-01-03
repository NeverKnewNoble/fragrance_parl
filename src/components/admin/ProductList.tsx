"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the products from an API
    const dummyProducts: Product[] = [
      {
        id: "1",
        name: "Golden Bloom",
        description: "A warm and floral fragrance.",
        fragranceFamily: "Floral",
        isActive: true,
        slug: "golden-bloom",
        images: ["/images/golden_bloom.jpg"],
      },
      {
        id: "2",
        name: "Midnight Oud",
        description: "A mysterious and smoky scent.",
        fragranceFamily: "Woody",
        isActive: true,
        slug: "midnight-oud",
        images: [],
      },
    ];
    setProducts(dummyProducts);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Fragrance Family</th>
            <th className="py-2 px-4 border-b">Is Active</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.description}</td>
              <td className="py-2 px-4 border-b">{product.fragranceFamily}</td>
              <td className="py-2 px-4 border-b">{product.isActive ? "Yes" : "No"}</td>
              <td className="py-2 px-4 border-b">
                <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button className="text-red-600 hover:text-red-900 ml-4">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;