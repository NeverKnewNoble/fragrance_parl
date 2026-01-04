"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { deleteProduct, loadProducts, updateProduct } from "@/utils/productStorage";
import { Trash2, Image as ImageIcon } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const handleToggleActive = (productId: string, next: boolean) => {
    const updated = updateProduct(productId, { isActive: next });
    setProducts(updated);
  };

  const handleDelete = (productId: string) => {
    const updated = deleteProduct(productId);
    setProducts(updated);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-base font-medium text-gray-900">No products yet</p>
        <p className="mt-1 text-sm text-gray-500">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-black">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Product</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Description</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Family</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Size</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-black">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.slug}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 max-w-xs">
                <p className="text-sm text-gray-600 line-clamp-2">{product.description || 'No description'}</p>
              </td>
              <td className="py-4 px-4">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                  {product.fragranceFamily}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-medium text-black">{product.size_ml} ml</span>
              </td>
              <td className="py-4 px-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.isActive}
                    onChange={(e) => handleToggleActive(product.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D4AF37]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </td>
              <td className="py-4 px-4">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;