"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { addProduct } from "@/utils/productStorage";
import { loadFragranceFamilies } from "@/utils/fragranceFamilyStorage";
import { Product } from "@/types/product";

type Props = {
  onProductCreated?: (product: Product) => void;
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

const ProductUploadForm = ({ onProductCreated }: Props) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [fragranceFamily, setFragranceFamily] = useState("");
  const [fragranceFamilies, setFragranceFamilies] = useState<string[]>([]);
  const [sizeMl, setSizeMl] = useState<number>(50);
  const [isActive, setIsActive] = useState(true);
  const [slug, setSlug] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const families = loadFragranceFamilies();
    setFragranceFamilies(families);
    if (families.length > 0 && !fragranceFamily) {
      setFragranceFamily(families[0]);
    }
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productName.trim()) return;
    if (!slug.trim()) return;
    if (!fragranceFamily.trim()) return;
    if (!Number.isFinite(sizeMl) || sizeMl <= 0) return;

    try {
      setSubmitting(true);

      const imageDataUrls = await Promise.all(images.map(fileToDataUrl));

      const product: Product = {
        id: crypto.randomUUID(),
        name: productName.trim(),
        description: description.trim(),
        fragranceFamily: fragranceFamily.trim(),
        size_ml: sizeMl,
        isActive,
        slug: slug.trim(),
        images: imageDataUrls,
      };

      addProduct(product);
      onProductCreated?.(product);

      setProductName("");
      setDescription("");
      setFragranceFamily("");
      setSizeMl(50);
      setIsActive(true);
      setSlug("");
      setImages([]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="productName" className="block text-sm font-semibold text-black mb-2">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            placeholder="e.g., Golden Bloom"
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-black mb-2">
            Slug (URL)
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="e.g., golden-bloom"
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all"
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-black mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the fragrance, notes, and characteristics..."
          className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all resize-none"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fragranceFamily" className="block text-sm font-semibold text-black mb-2">
            Fragrance Family
          </label>
          <select
            id="fragranceFamily"
            value={fragranceFamily}
            onChange={(e) => setFragranceFamily(e.target.value)}
            required
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all"
          >
            {fragranceFamilies.length === 0 ? (
              <option value="">No fragrance families available</option>
            ) : (
              fragranceFamilies.map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))
            )}
          </select>
          <p className="mt-1 text-xs text-gray-500">Manage families in the Fragrance Families tab</p>
        </div>
        <div>
          <label htmlFor="sizeMl" className="block text-sm font-semibold text-black mb-2">
            Size (ml)
          </label>
          <select
            id="sizeMl"
            value={sizeMl}
            onChange={(e) => setSizeMl(Number(e.target.value))}
            className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all"
          >
            <option value={50}>50 ml</option>
            <option value={75}>75 ml</option>
            <option value={100}>100 ml</option>
          </select>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-900">
            Make this product active and visible to customers
          </label>
        </div>
      </div>
      <div>
        <label htmlFor="images" className="block text-sm font-semibold text-black mb-2">
          Product Images
        </label>
        <div className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 hover:border-[#D4AF37] transition-colors">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4 flex text-sm text-gray-600">
              <label
                htmlFor="images"
                className="relative cursor-pointer rounded-md font-semibold text-[#D4AF37] hover:text-[#e3c55d] focus-within:outline-none"
              >
                <span>Upload files</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            {images.length > 0 && (
              <p className="mt-2 text-sm font-medium text-[#D4AF37]">
                {images.length} {images.length === 1 ? 'file' : 'files'} selected
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-linear-to-r from-[#D4AF37] to-[#e3c55d] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Uploading...' : 'Upload Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductUploadForm;