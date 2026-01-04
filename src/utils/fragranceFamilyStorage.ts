const STORAGE_KEY = "fragranceFamilies";

const DEFAULT_FAMILIES = [
  "Floral",
  "Woody",
  "Oriental",
  "Fresh",
  "Citrus",
  "Aquatic",
  "Spicy",
  "Fruity",
];

export function loadFragranceFamilies(): string[] {
  if (typeof window === "undefined") return DEFAULT_FAMILIES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FAMILIES));
      return DEFAULT_FAMILIES;
    }
    const families = JSON.parse(stored);
    return Array.isArray(families) && families.length > 0 ? families : DEFAULT_FAMILIES;
  } catch {
    return DEFAULT_FAMILIES;
  }
}

function saveFragranceFamilies(families: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(families));
  } catch (error) {
    console.error("Failed to save fragrance families:", error);
  }
}

export function addFragranceFamily(name: string): string[] {
  const families = loadFragranceFamilies();
  const trimmed = name.trim();
  
  if (!trimmed) {
    throw new Error("Fragrance family name cannot be empty");
  }
  
  if (families.some((f) => f.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error("Fragrance family already exists");
  }
  
  const updated = [...families, trimmed];
  saveFragranceFamilies(updated);
  return updated;
}

export function renameFragranceFamily(oldName: string, newName: string): string[] {
  const families = loadFragranceFamilies();
  const trimmed = newName.trim();
  
  if (!trimmed) {
    throw new Error("Fragrance family name cannot be empty");
  }
  
  const index = families.findIndex((f) => f === oldName);
  if (index === -1) {
    throw new Error("Fragrance family not found");
  }
  
  if (families.some((f, i) => i !== index && f.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error("A fragrance family with this name already exists");
  }
  
  const updated = [...families];
  updated[index] = trimmed;
  saveFragranceFamilies(updated);
  return updated;
}

export function deleteFragranceFamily(name: string): string[] {
  const families = loadFragranceFamilies();
  const updated = families.filter((f) => f !== name);
  
  if (updated.length === families.length) {
    throw new Error("Fragrance family not found");
  }
  
  if (updated.length === 0) {
    throw new Error("Cannot delete the last fragrance family");
  }
  
  saveFragranceFamilies(updated);
  return updated;
}
