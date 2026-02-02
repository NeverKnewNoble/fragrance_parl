"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { fetchFragranceFamiliesWithIds } from "@/utils/fragranceFamilies";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/alert";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  ProductVariant,
  ProductNote,
  FragranceFamily,
  Props,
} from "@/types/product";
import { uploadProductImages } from "@/utils/imageUpload";


const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// !! This component handles product creation with variants and notes
// !! It manages product details, variants, fragrance notes, and image uploads
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
  const [images, setImages] = useState<File[]>([]);
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

  //!! Handle image file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Adjust primary index if needed
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { size_ml: 50, price: 100, stock_quantity: 10, is_out_of_stock: false, is_restocked: false },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
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

  const addNote = (type: "top" | "middle" | "base") => {
    if (type === "top") setTopNotes([...topNotes, ""]);
    else if (type === "middle") setMiddleNotes([...middleNotes, ""]);
    else setBaseNotes([...baseNotes, ""]);
  };

  const removeNote = (type: "top" | "middle" | "base", index: number) => {
    if (type === "top" && topNotes.length > 1) {
      setTopNotes(topNotes.filter((_, i) => i !== index));
    } else if (type === "middle" && middleNotes.length > 1) {
      setMiddleNotes(middleNotes.filter((_, i) => i !== index));
    } else if (type === "base" && baseNotes.length > 1) {
      setBaseNotes(baseNotes.filter((_, i) => i !== index));
    }
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

  // !! Handle form submission for creating a new product
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

      // Generate slug from product name
      const slug = generateSlug(productName);

      // 1. Insert product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([
          {
            name: productName.trim(),
            description: description.trim(),
            // price: basePrice,
            fragrance_family_id: fragranceFamilyId,
            slug: slug,
            is_active: isActive,
          },
        ])
        .select()
        .single();

      if (productError) throw productError;
      if (!productData) throw new Error("Failed to create product");

      const productId = productData.id;

      // 2. Upload images to Supabase Storage and save URLs
      if (images.length > 0) {
        try {
          console.log(`Uploading ${images.length} images to Supabase Storage...`);
          
          // Upload all images to storage
          const imageUrls = await uploadProductImages(images, slug);
          console.log("Images uploaded successfully:", imageUrls);

          // Insert image records with actual storage URLs
          const imageInserts = imageUrls.map((url, index) => ({
            product_id: productId,
            image_url: url,
            is_primary: index === primaryImageIndex,
          }));

          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageInserts);

          if (imagesError) {
            console.error("Error inserting image records:", imagesError);
            throw imagesError;
          }
          
          console.log("Image records inserted successfully");
        } catch (imageError: any) {
          console.error("Error uploading images:", imageError);
          toast.error(`Image upload failed: ${imageError.message}`, { durationMs: 5000 });
          // Continue with product creation even if images fail
        }
      }

      // 3. Insert variants
      const variantInserts = variants.map((variant) => ({
        product_id: productId,
        size_ml: variant.size_ml,
        price: variant.price,
        stock_quantity: variant.stock_quantity,
        is_out_of_stock: variant.is_out_of_stock ?? false,
        is_restocked: variant.is_restocked ?? false,
      }));

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantInserts);

      if (variantsError) throw variantsError;

      // 4. Insert notes
      const allNotes: ProductNote[] = [
        ...topNotes
          .filter((n) => n.trim())
          .map((n) => ({ note_name: n.trim(), note_type: "top" as const })),
        ...middleNotes
          .filter((n) => n.trim())
          .map((n) => ({ note_name: n.trim(), note_type: "middle" as const })),
        ...baseNotes
          .filter((n) => n.trim())
          .map((n) => ({ note_name: n.trim(), note_type: "base" as const })),
      ];

      if (allNotes.length > 0) {
        const noteInserts = allNotes.map((note) => ({
          product_id: productId,
          note_name: note.note_name,
          note_type: note.note_type,
        }));

        const { error: notesError } = await supabase
          .from("product_notes")
          .insert(noteInserts);

        if (notesError) throw notesError;
      }

      toast.success("Product created successfully!", { durationMs: 5000 });
      onProductCreated?.();

      // Reset form
      setProductName("");
      setDescription("");
      setImages([]);
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
            <label
              htmlFor="productName"
              className="block text-sm font-semibold text-black mb-2"
            >
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
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-black mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the fragrance, notes, and characteristics..."
              className="block w-full px-4  py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fragranceFamily"
                className="block text-sm font-semibold text-black mb-2"
              >
                Fragrance Family *
              </label>
              <select
                id="fragranceFamily"
                value={fragranceFamilyId || ""}
                onChange={(e) => setFragranceFamilyId(Number(e.target.value))}
                required
                className="block w-full px-4  py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all"
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
                <label
                  htmlFor="isActive"
                  className="ml-3 block text-sm font-medium text-gray-900"
                >
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
          {showVariants ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {showVariants && (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Size (ml)
                  </label>
                  <select
                    value={variant.size_ml}
                    onChange={(e) =>
                      updateVariant(index, "size_ml", Number(e.target.value))
                    }
                    className="block w-full text-black  px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  >
                    <option value={50}>50ml</option>
                    <option value={75}>75ml</option>
                    <option value={100}>100ml</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (₵)
                  </label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(index, "price", Number(e.target.value))
                    }
                    className="block w-full px-3 text-black  py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={variant.stock_quantity}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "stock_quantity",
                        Number(e.target.value)
                      )
                    }
                    className="block w-full px-3 text-black  py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <label className="block text-xs font-semibold text-gray-700 whitespace-nowrap">
                    Out Of Stock
                  </label>
                  <input
                    type="checkbox"
                    checked={variant.is_out_of_stock ?? false}
                    onChange={(e) =>
                      updateVariant(index, "is_out_of_stock", e.target.checked)
                    }
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <label className="block text-xs font-semibold text-gray-700">
                    Restocked
                  </label>
                  <input
                    type="checkbox"
                    checked={variant.is_restocked ?? false}
                    onChange={(e) =>
                      updateVariant(index, "is_restocked", e.target.checked)
                    }
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
              className="flex items-center gap-2  text-sm font-semibold text-[#D4AF37] hover:text-[#e3c55d] transition-colors"
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
          {showNotes ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {showNotes && (
          <div className="space-y-6">
            {/* Top Notes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Top Notes
              </h4>
              <div className="space-y-2">
                {topNotes.map((note, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => updateNote("top", index, e.target.value)}
                      placeholder="e.g., Bergamot"
                      className="flex-1 px-3 text-black  py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => removeNote("top", index)}
                      disabled={topNotes.length === 1}
                      className="p-2 text-red-600  hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNote("top")}
                  className="text-sm font-semibold text-[#D4AF37] hover:text-[#e3c55d] transition-colors"
                >
                  + Add Top Note
                </button>
              </div>
            </div>

            {/* Middle Notes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Middle Notes
              </h4>
              <div className="space-y-2">
                {middleNotes.map((note, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) =>
                        updateNote("middle", index, e.target.value)
                      }
                      placeholder="e.g., Rose"
                      className="flex-1 px-3 py-2 text-black  border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => removeNote("middle", index)}
                      disabled={middleNotes.length === 1}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNote("middle")}
                  className="text-sm font-semibold text-[#D4AF37] hover:text-[#e3c55d] transition-colors"
                >
                  + Add Middle Note
                </button>
              </div>
            </div>

            {/* Base Notes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Base Notes
              </h4>
              <div className="space-y-2">
                {baseNotes.map((note, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) =>
                        updateNote("base", index, e.target.value)
                      }
                      placeholder="e.g., Vanilla"
                      className="flex-1 px-3 text-black  py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => removeNote("base", index)}
                      disabled={baseNotes.length === 1}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNote("base")}
                  className="text-sm font-semibold text-[#D4AF37] hover:text-[#e3c55d] transition-colors"
                >
                  + Add Base Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Images */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-bold text-black mb-4">Product Images</h3>
        
        {/* Upload Area */}
        <div className="flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 hover:border-[#D4AF37] transition-colors mb-6">
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
            <div className="mt-4 flex text-sm text-gray-600 justify-center">
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
                  className="sr-only text-black"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">
                {images.length} {images.length === 1 ? "image" : "images"} selected
              </p>
              <p className="text-xs text-gray-500">
                Click on an image to set it as primary
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    primaryImageIndex === index
                      ? "border-[#D4AF37] shadow-lg ring-2 ring-[#D4AF37]/30"
                      : "border-gray-200 hover:border-[#D4AF37]/50"
                  }`}
                  onClick={() => setPrimaryImage(index)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Primary Badge */}
                  {primaryImageIndex === index && (
                    <div className="absolute top-2 left-2 bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                      PRIMARY
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {/* Image Name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
