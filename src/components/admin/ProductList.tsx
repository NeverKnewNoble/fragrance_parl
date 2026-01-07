"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { getAllProductsAndLinkages, deleteProduct, isActiveSwitch } from "@/utils/products";
import { supabase } from "@/lib/supabase/client";
import { Trash2, Image as ImageIcon } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const productsData = await getAllProductsAndLinkages();

      const formattedProducts: Product[] = productsData.map((p: any) => {
        const primaryImage = p.product_images?.find((img: any) => img.is_primary);
        const images = p.product_images?.map((img: any) => img.image_url) || [];
        const sizes = p.product_variants?.map((v: any) => v.size_ml).sort((a: number, b: number) => a - b) || [];

        return {
          id: p.id,
          name: p.name,
          description: p.description || '',
          slug: p.slug,
          isActive: p.is_active,
          fragranceFamily: p.fragrance_families?.name || 'Unknown',
          sizes: sizes,
          images: images,
        };
      });

      setProducts(formattedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleActive = async (productId: string, next: boolean) => {
    await isActiveSwitch(productId, next);
    // Refresh the products list to reflect the change
    fetchProducts();
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This will also delete all related images, variants, and notes.')) {
      return;
    }

    await deleteProduct(productId);
    // Refresh the products list to reflect the change
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
        <p className="mt-4 text-sm text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-base font-medium text-red-600">Error: {error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#c49d2f] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

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
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200"
                    style={{ display: product.images.length > 0 ? 'none' : 'flex' }}
                  >
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
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
                <div className="flex flex-wrap gap-1">
                  {product.sizes.length > 0 ? (
                    product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {size}ml
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No sizes</span>
                  )}
                </div>
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