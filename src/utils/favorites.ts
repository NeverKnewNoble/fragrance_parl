import { toast } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";


//!! Load favorites from database
export const loadFavorites = async (userId: string) => {
    try{
        let { data: favorites, error } = await supabase.from('favorites').select('*').eq('user_id', userId);
        if (error) return console.error("Error loading favorites:", error);
        return favorites;
    }catch(error){
        console.error("Error loading favorites:", error);
        toast.error("Failed to load favorites. Please try again.", {
            durationMs: 5000,}
        );
        return [];
    }
}


//!! Save favorites to database
export const saveFavorites = async(userId: string, productId: string) => {
    try{
        let {error} = await supabase.from('favorites').insert({
            user_id: userId,
            product_id: productId,
        }).select();
        if (error) return console.error("Error saving favorites:", error);
        toast.success("Favorite saved successfully.", {
            durationMs: 5000,
        });
    } catch(err){
        console.error("Error saving favorites:", err);
        toast.error("Failed to save favorites. Please try again.", {
            durationMs: 5000,}
        );
    }
}



// //!! Toggle favorite (add if not present, remove if present)
// //!! Adds or removes a product from favorites
// export const toggleFavorite = (userId: string | undefined, productTitle: string): string[] => {
//   const favorites = loadFavorites(userId);
//   const index = favorites.indexOf(productTitle);
  
//   if (index >= 0) {
//     // Remove from favorites
//     favorites.splice(index, 1);
//   } else {
//     // Add to favorites
//     favorites.push(productTitle);
//   }
  
//   saveFavorites(userId, favorites);
//   return favorites;
// };

// //!! Check if product is in favorites
// //!! Returns true if the product is in the user's favorites
// export const isFavorite = (userId: string | undefined, productTitle: string): boolean => {
//   const favorites = loadFavorites(userId);
//   return favorites.includes(productTitle);
// };