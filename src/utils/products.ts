import { supabase } from "@/lib/supabase";
import { getAllProductsWithLinkages } from "@/types/product";
import { toast } from "@/components/ui/alert";


// !! Fetch Product all products and its linkage variants, notes and images
export async function getAllProductsAndLinkages(): Promise<getAllProductsWithLinkages[]> {
    try {
        const { data, error } = await supabase.from("products").select(`
            id,
            name,
            description,
            slug,
            is_active,
            fragrance_families (
                id,
                name,
                icon
            ),
            product_images (
                id,
                product_id,
                image_url,
                is_primary
            ),
            product_notes (
                id,
                product_id,
                note_name,
                note_type
            ),
            product_variants (
                id,
                product_id,
                size_ml,
                price
            ),
            created_at
        `).order("created_at", { ascending: false });

        if (error) throw error;
        // console.log(data);
        return (data || []) as getAllProductsWithLinkages[]
    } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again.", {
            durationMs: 5000,});
        return [] as getAllProductsWithLinkages[];
    }
}



// !! Delete Product
export async function deleteProduct(id: string) {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        // Check if user is admin by looking up their role in user_role table
        const { data: roleData, error: roleError } = await supabase
            .from('user_role')
            .select('role')
            .eq('user_id', user.id)
            .single();
            
        if (roleError || roleData?.role !== 'admin') {
            throw new Error('Admin access required');
        }
        
        // Delete the product (admin can delete any product)
        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (error) throw error;
        toast.success("Product deleted successfully.", {
            durationMs: 5000,}
        );
    } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product. Please try again.", {
            durationMs: 5000,});
    }
}


//  !! Product activity switch
export async function isActiveSwitch(id: string, is_active: boolean) {
    try{
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        // Check if user is admin by looking up their role in user_role table
        const { data: roleData, error: roleError } = await supabase
            .from('user_role')
            .select('role')
            .eq('user_id', user.id)
            .single();
            
        if (roleError || roleData?.role !== 'admin') {
            throw new Error('Admin access required');
        }
        
        // Update the product (admin can update any product)
        const { error } = await supabase
            .from("products")
            .update({ is_active: is_active })
            .eq("id", id);

        if (error) throw error;
        toast.success("Product updated successfully.", {
            durationMs: 5000,}
        );
    } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product. Please try again.", {
            durationMs: 5000,});
    }
}