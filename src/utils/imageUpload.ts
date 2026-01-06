import { supabase } from "@/lib/supabase";

/**
 * Upload a single image to Supabase Storage
 * @param file - The image file to upload
 * @param slug - Product slug for organizing files
 * @param index - Image index for naming
 * @returns Public URL of the uploaded image
 */
export async function uploadProductImage(
  file: File,
  slug: string,
  index: number
): Promise<string> {
  // Generate unique filename with timestamp to avoid conflicts
  const timestamp = Date.now();
  const fileExt = file.name.split(".").pop();
  const fileName = `${slug}-${index + 1}-${timestamp}.${fileExt}`;
  const filePath = `products/${fileName}`;

  console.log(`Uploading image ${index + 1}: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
  console.log(`Storage path: ${filePath}`);

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error(`Error uploading image ${fileName}:`, error);
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }

  console.log(`Upload successful for ${fileName}`);

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(filePath);

  console.log(`Public URL: ${publicUrl}`);

  return publicUrl;
}

/**
 * Upload multiple product images to Supabase Storage
 * @param files - Array of image files
 * @param slug - Product slug for organizing files
 * @returns Array of public URLs
 */
export async function uploadProductImages(
  files: File[],
  slug: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) =>
    uploadProductImage(file, slug, index)
  );

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - Full public URL of the image
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    // Extract the file path from the public URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/images/");
    if (pathParts.length < 2) {
      throw new Error("Invalid image URL format");
    }
    const filePath = pathParts[1];

    const { error } = await supabase.storage.from("images").remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}
