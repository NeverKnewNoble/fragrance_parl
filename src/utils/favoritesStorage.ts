//!! Load favorites from localStorage
//!! Retrieves favorites list from localStorage for the given user
export const loadFavorites = (userId?: string): string[] => {
  if (!userId) {
    // For guest users, use a temporary key
    const guestFavorites = localStorage.getItem('favorites_guest');
    return guestFavorites ? JSON.parse(guestFavorites) : [];
  }
  
  const storedFavorites = localStorage.getItem(`favorites_${userId}`);
  if (storedFavorites) {
    try {
      return JSON.parse(storedFavorites);
    } catch (error) {
      console.error('Error parsing stored favorites:', error);
      return [];
    }
  }
  return [];
};

//!! Save favorites to localStorage
//!! Stores favorites list in localStorage for the given user
export const saveFavorites = (userId: string | undefined, favorites: string[]): void => {
  try {
    const key = userId ? `favorites_${userId}` : 'favorites_guest';
    localStorage.setItem(key, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

//!! Toggle favorite (add if not present, remove if present)
//!! Adds or removes a product from favorites
export const toggleFavorite = (userId: string | undefined, productTitle: string): string[] => {
  const favorites = loadFavorites(userId);
  const index = favorites.indexOf(productTitle);
  
  if (index >= 0) {
    // Remove from favorites
    favorites.splice(index, 1);
  } else {
    // Add to favorites
    favorites.push(productTitle);
  }
  
  saveFavorites(userId, favorites);
  return favorites;
};

//!! Check if product is in favorites
//!! Returns true if the product is in the user's favorites
export const isFavorite = (userId: string | undefined, productTitle: string): boolean => {
  const favorites = loadFavorites(userId);
  return favorites.includes(productTitle);
};

