// Image storage was previously handled via Supabase Storage.
// Per the migration plan, image_url strings are now stored as-is (URL-only mode).
// Wire S3/R2/Cloudinary later — see docs/migration-setup.md.

export async function uploadProductImage(
  _file: File,
  _slug: string,
  _index: number
): Promise<string> {
  throw new Error(
    "uploadProductImage is not configured. Use a hosted image URL via the admin form, " +
      "or wire an upload provider (S3/R2/Cloudinary) — see docs/migration-setup.md."
  );
}

export async function uploadProductImages(
  _files: File[],
  _slug: string
): Promise<string[]> {
  throw new Error(
    "uploadProductImages is not configured. See docs/migration-setup.md."
  );
}

export async function deleteProductImage(_imageUrl: string): Promise<void> {
  // No-op in URL-only mode.
}
