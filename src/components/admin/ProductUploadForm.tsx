"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { fetchFragranceFamiliesWithIds } from "@/utils/fragranceFamilies";
import { createProduct } from "@/utils/products";
import { toast } from "@/components/ui/alert";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  ProductVariant,
  ProductNote,
  FragranceFamily,
  Props,
} from "@/types/product";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// !! This component handles product creation with variants and notes.
// Image storage is URL-only after the Supabase migration — paste hosted
// image URLs (Cloudinary/S3/etc.). Wire a real upload flow later.
const ProductUploadForm = ({ onProductCreated }: Props) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [fragranceFamilyId, setFragranceFamilyId] = useState<number | null>(
    null
  );
  const [fragranceFamilies, setFragranceFamilies] = useState<FragranceFamily[]>(
    []
  );
  const [isActive, setIsActive] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>([
    { size_ml: 50, price: 100, stock_quantity: 10, is_out_of_stock: false, is_restocked: false },
    { size_ml: 75, price: 140, stock_quantity: 10, is_out_of_stock: false, is_restocked: false },
    { size_ml: 100, price: 180, stock_quantity: 10, is_out_of_stock: false, is_restocked: false },
  ]);

  // Notes state
  const [topNotes, setTopNotes] = useState<string[]>([""]);
  const [middleNotes, setMiddleNotes] = useState<string[]>([""]);
  const [baseNotes, setBaseNotes] = useState<string[]>([""]);

  // UI state
  const [showVariants, setShowVariants] = useState(true);
  const [showNotes, setShowNotes] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const families = await fetchFragranceFamiliesWithIds();
        setFragranceFamilies(families);
        if (families.length > 0 && !fragranceFamilyId) {
          setFragranceFamilyId(families[0].id);
        }
      } catch (error) {
        console.error("Failed to load fragrance families:", error);
        toast.error("Failed to load fragrance families", { durationMs: 3000 });
      }
    };
    void run();
  }, []);

  // !! Image URL handlers
  const updateImageUrl = (index: number, value: string) => {
    setImageUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addImageUrlSlot = () => setImageUrls((prev) => [...prev, ""]);

  const removeImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const setPrimaryImage = (index: number) => setPrimaryImageIndex(index);

  // !! Variant handlers
  const addVariant = () => {
    setVariants([
      ...variants,
      { size_ml: 50, price: 100, stock_quantity: 10, is_out_of_stock: false, is_restocked: false },
    ]);
  };
  const removeVariant = (index: number) => {
    if (variants.length > 1) setVariants(variants.filter((_, i) => i !== index));
  };
  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: number | boolean
  ) => {
    const updated = [...variants];
    (updated[index] as any)[field] = value;
    setVariants(updated);
  };

  // !! Note handlers
  const addNote = (type: "top" | "middle" | "base") => {
    if (type === "top") setTopNotes([...topNotes, ""]);
    else if (type === "middle") setMiddleNotes([...middleNotes, ""]);
    else setBaseNotes([...baseNotes, ""]);
  };
  const removeNote = (type: "top" | "middle" | "base", index: number) => {
    if (type === "top" && topNotes.length > 1) setTopNotes(topNotes.filter((_, i) => i !== index));
    else if (type === "middle" && middleNotes.length > 1) setMiddleNotes(middleNotes.filter((_, i) => i !== index));
    else if (type === "base" && baseNotes.length > 1) setBaseNotes(baseNotes.filter((_, i) => i !== index));
  };
  const updateNote = (
    type: "top" | "middle" | "base",
    index: number,
    value: string
  ) => {
    if (type === "top") {
      const updated = [...topNotes];
      updated[index] = value;
      setTopNotes(updated);
    } else if (type === "middle") {
      const updated = [...middleNotes];
      updated[index] = value;
      setMiddleNotes(updated);
    } else {
      const updated = [...baseNotes];
      updated[index] = value;
      setBaseNotes(updated);
    }
  };

  // !! Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productName.trim()) {
      toast.error("Product name is required", { durationMs: 3000 });
      return;
    }
    if (!fragranceFamilyId) {
      toast.error("Please select a fragrance family", { durationMs: 3000 });
      return;
    }
    if (variants.length === 0) {
      toast.error("At least one variant is required", { durationMs: 3000 });
      return;
    }

    try {
      setSubmitting(true);

      const slug = generateSlug(productName);
      const trimmedUrls = imageUrls.map((u) => u.trim()).filter((u) => u.length > 0);
      const adjustedPrimary =
        trimmedUrls.length === 0
          ? 0
          : Math.min(primaryImageIndex, trimmedUrls.length - 1);

      const allNotes: Array<{ noteName: string; noteType: "top" | "middle" | "base" }> = [
        ...topNotes.filter((n) => n.trim()).map((n) => ({ noteName: n.trim(), noteType: "top" as const })),
        ...middleNotes.filter((n) => n.trim()).map((n) => ({ noteName: n.trim(), noteType: "middle" as const })),
        ...baseNotes.filter((n) => n.trim()).map((n) => ({ noteName: n.trim(), noteType: "base" as const })),
      ];

      await createProduct({
        name: productName.trim(),
        description: description.trim(),
        fragranceFamilyId,
        slug,
        isActive,
        variants: variants.map((v) => ({
          sizeMl: v.size_ml,
          price: v.price,
          stockQuantity: v.stock_quantity,
          isOutOfStock: v.is_out_of_stock ?? false,
          isRestocked: v.is_restocked ?? false,
        })),
        notes: allNotes,
        images: trimmedUrls.map((url, i) => ({
          imageUrl: url,
          isPrimary: i === adjustedPrimary,
        })),
      });

      toast.success("Product created successfully!", { durationMs: 5000 });
      onProductCreated?.();

      // Reset
      setProductName("");
      setDescription("");
      setImageUrls([""]);
      setPrimaryImageIndex(0);
      setVariants([
        { size_ml: 50, price: 100, stock_quantity: 10, is_out_of_stock: false, is_restocked: false },
        { size_ml: 75, price: 140, stock_quantity: 10, is_out_of_stock: false, is_restocked: false },
        { size_ml: 100, price: 180, stock_quantity: 10, is_out_of_stock: false, is_restocked: false },
      ]);
      setTopNotes([""]);
      setMiddleNotes([""]);
      setBaseNotes([""]);
      setIsActive(true);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.", {
        durationMs: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-black mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-semibold text-black mb-2">
              Product Name *
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
            <p className="mt-1 text-xs text-gray-500">
              Slug will be auto-generated:{" "}
              {productName ? generateSlug(productName) : "e.g., golden-bloom"}
            </p>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fragranceFamily" className="block text-sm font-semibold text-black mb-2">
                Fragrance Family *
              </label>
              <select
                id="fragranceFamily"
                value={fragranceFamilyId || ""}
                onChange={(e) => setFragranceFamilyId(Number(e.target.value))}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all"
              >
                {fragranceFamilies.length === 0 ? (
                  <option value="">No fragrance families available</option>
                ) : (
                  fragranceFamilies.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="rounded-xl border mt-5 border-gray-200 bg-gray-50 p-4">
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
          </div>
        </div>
      </div>

      {/* Product Variants */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <button
          type="button"
          onClick={() => setShowVariants(!showVariants)}
          className="flex w-full items-center justify-between mb-4"
        >
          <h3 className="text-lg font-bold text-black">Product Variants *</h3>
          {showVariants ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {showVariants && (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Size (ml)</label>
                  <select
                    value={variant.size_ml}
                    onChange={(e) => updateVariant(index, "size_ml", Number(e.target.value))}
                    className="block w-full text-black px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  >
                    <option value={50}>50ml</option>
                    <option value={75}>75ml</option>
                    <option value={100}>100ml</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₵)</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                    className="block w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={variant.stock_quantity}
                    onChange={(e) => updateVariant(index, "stock_quantity", Number(e.target.value))}
                    className="block w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <label className="block text-xs font-semibold text-gray-700 whitespace-nowrap">Out Of Stock</label>
                  <input
                    type="checkbox"
                    checked={variant.is_out_of_stock ?? false}
                    onChange={(e) => updateVariant(index, "is_out_of_stock", e.target.checked)}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <label className="block text-xs font-semibold text-gray-700">Restocked</label>
                  <input
                    type="checkbox"
                    checked={variant.is_restocked ?? false}
                    onChange={(e) => updateVariant(index, "is_restocked", e.target.checked)}
                    disabled={variant.is_out_of_stock}
                    className="h-5 w-5 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded cursor-pointer disabled:opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  disabled={variants.length === 1}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#e3c55d] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Variant
            </button>
          </div>
        )}
      </div>

      {/* Fragrance Notes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="flex w-full items-center justify-between mb-4"
        >
          <h3 className="text-lg font-bold text-black">Fragrance Notes</h3>
          {showNotes ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {showNotes && (
          <div className="space-y-6">
            {(["top", "middle", "base"] as const).map((type) => {
              const list = type === "top" ? topNotes : type === "middle" ? middleNotes : baseNotes;
              const placeholder = type === "top" ? "e.g., Bergamot" : type === "middle" ? "e.g., Rose" : "e.g., Vanilla";
              return (
                <div key={type}>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 capitalize">{type} Notes</h4>
                  <div className="space-y-2">
                    {list.map((note, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => updateNote(type, index, e.target.value)}
                          placeholder={placeholder}
                          className="flex-1 px-3 text-black py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={() => removeNote(type, index)}
                          disabled={list.length === 1}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addNote(type)}
                      className="text-sm font-semibold text-[#D4AF37] hover:text-[#e3c55d] transition-colors capitalize"
                    >
                      + Add {type} Note
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Images (URL-only mode) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-black">Product Images</h3>
          <p className="text-xs text-gray-500 mt-1">
            Paste hosted image URLs (Cloudinary, S3, Imgur, etc.). Wire an upload provider later.
          </p>
        </div>
        <div className="space-y-3">
          {imageUrls.map((url, index) => {
            const isPrimary = index === primaryImageIndex;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                  isPrimary
                    ? "border-[#D4AF37] bg-[#D4AF37]/5"
                    : "border-gray-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPrimaryImage(index)}
                  className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                    isPrimary
                      ? "bg-[#D4AF37] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  title="Mark as primary"
                >
                  {isPrimary ? "Primary" : "Set primary"}
                </button>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                />
                {url.trim() && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={url.trim()}
                    alt={`Preview ${index + 1}`}
                    className="h-10 w-10 rounded object-cover bg-gray-100"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  disabled={imageUrls.length === 1}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={addImageUrlSlot}
            className="flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#e3c55d] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add image URL
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-linear-to-r from-[#D4AF37] to-[#e3c55d] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating Product..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductUploadForm;
