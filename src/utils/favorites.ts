import { toast } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { Favorites } from "@/types/favorites";


//!! Load favorites from database
export const loadFavorites = async (userId: string): Promise<Favorites[]> => {
    try{
        let { data: favorites, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', userId);
        
        if (error) {
            console.error("Error loading favorites:", error);
            toast.error("Failed to load favorites. Please try again.", {
                durationMs: 5000,
            });
            return [];
        }
        
        return favorites || [];
    }catch(error){
        console.error("Error loading favorites:", error);
        toast.error("Failed to load favorites. Please try again.", {
            durationMs: 5000,
        });
        return [];
    }
}


//!! Remove favorite from database
export const removeFavorite = async(userId: string, productId: string) => {
    try{
        let { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);
        
        if (error) {
            console.error("Error removing favorite:", error);
            toast.error("Failed to remove favorite. Please try again.", {
                durationMs: 5000,
            });
            return false;
        }
        
        toast.success("Favorite removed successfully.", {
            durationMs: 5000,
        });
        return true;
    } catch(err){
        console.error("Error removing favorite:", err);
        toast.error("Failed to remove favorite. Please try again.", {
            durationMs: 5000,
        });
        return false;
    }
}



//!! Toggle favorite (add if not present, remove if present)
//!! Adds or removes a product from favorites
export const toggleFavorite = async (userId: string | undefined, productId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Check if product is already in favorites
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle(); // Use maybeSingle() instead of single()
    
    if (checkError) {
      console.error("Error checking favorite:", checkError);
      return false;
    }
    
    if (existingFavorite) {
      // Remove from favorites
      const success = await removeFavorite(userId, productId);
      return !success; // Return false if it was removed
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          product_id: productId,
        });
      
      if (error) {
        console.error("Error adding favorite:", error);
        toast.error("Failed to add favorite. Please try again.", {
          durationMs: 5000,
        });
        return false;
      }
      
      toast.success("Favorite added successfully.", {
        durationMs: 5000,
      });
      return true; // Return true if it was added
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    toast.error("Failed to update favorites. Please try again.", {
      durationMs: 5000,
    });
    return false;
  }
};

//!! Check if product is in favorites
//!! Returns true if the product is in the user's favorites
export const isFavorite = async (userId: string | undefined, productId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle(); // Use maybeSingle() instead of single()
    
    if (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
};