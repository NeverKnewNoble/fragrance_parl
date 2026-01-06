import { supabase } from "@/lib/supabase";
import { fragrance_family } from "@/types/family_fragrance";

// !! Fetch all fragrance families with their icons
export async function fetchAllFragranceFamilies(): Promise<fragrance_family[]> {
  const { data, error } = await supabase
    .from("fragrance_families")
    .select("name, icon");

  if (error) {
    throw error;
  }

  return ((data ?? []) as fragrance_family[])
    .filter(
      (row) => 
        row !== null && 
        typeof row.name === "string" && 
        row.name.length > 0
    );
}

export async function fetchAllFragranceFamilyNames(): Promise<string[]> {
  const families = await fetchAllFragranceFamilies();
  return families.map(f => f.name);
}

// !! Fetch all fragrance families with their IDs and icons
export async function fetchFragranceFamiliesWithIds(): Promise<Array<{ id: number; name: string; icon?: string }>> {
  const { data, error } = await supabase
    .from("fragrance_families")
    .select("id, name, icon");

  if (error) {
    throw error;
  }

  return data ?? [];
}
