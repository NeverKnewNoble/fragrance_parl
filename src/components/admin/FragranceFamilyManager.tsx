"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Check, X, Sparkles, Flower2, Leaf, Droplet, Wind, Flame, Heart, Star, Sun, Moon, Coffee, Apple, Cherry, Citrus, TreePine, Waves } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/alert";
import { fetchAllFragranceFamilies } from "@/utils/fragranceFamilies";
import { fragrance_family } from "@/types/family_fragrance";
import * as LucideIcons from "lucide-react";

const AVAILABLE_ICONS = [
  { name: "Flower2", label: "Flower" },
  { name: "Leaf", label: "Leaf" },
  { name: "Droplet", label: "Droplet" },
  { name: "Wind", label: "Wind" },
  { name: "Flame", label: "Flame" },
  { name: "Heart", label: "Heart" },
  { name: "Star", label: "Star" },
  { name: "Sun", label: "Sun" },
  { name: "Moon", label: "Moon" },
  { name: "Coffee", label: "Coffee" },
  { name: "Apple", label: "Apple" },
  { name: "Cherry", label: "Cherry" },
  { name: "Citrus", label: "Citrus" },
  { name: "TreePine", label: "Pine" },
  { name: "Waves", label: "Waves" },
  { name: "Sparkles", label: "Sparkles" },
];

const FragranceFamilyManager = () => {
  const [families, setFamilies] = useState<fragrance_family[]>([]);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newIcon, setNewIcon] = useState("Flower2");
  const [editingFamily, setEditingFamily] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const fetched = await fetchAllFragranceFamilies();
        setFamilies(fetched);
      } catch {
        toast.error("Unable to fetch fragrance family List", {
          durationMs: 5000,
        });
        setFamilies([]);
      }
    };

    void run();
  }, []);

  // !! Function to create a new fragrance family
  const createFragranceFamily = async () => {
    try {
      const { error } = await supabase
        .from("fragrance_families")
        .insert([{ name: newFamilyName, icon: newIcon }])
        .select();
      if (error) return console.error(error);

      toast.success("Fragrance family created successfully", {
        durationMs: 5000,
      });

      const refreshed = await fetchAllFragranceFamilies();
      setFamilies(refreshed);
      setNewFamilyName("");
      setNewIcon("Flower2");
      setIsAdding(false);
    } catch (err) {
      console.error(err, "Unable to create family");
      toast.error("Failed to create fragrance family", { durationMs: 5000 });
    }
  };

  // !! Edit and change name of fragrance family
  const editFragranceFamily = async () => {
    if (!editingFamily) return;

    try {
      const { error } = await supabase
        .from("fragrance_families")
        .update({ name: editValue, icon: editIcon })
        .eq("name", editingFamily);

      if (error) return console.error(error);

      toast.success("Saved changes", { durationMs: 5000 });

      const refreshed = await fetchAllFragranceFamilies();
      setFamilies(refreshed);
      setEditingFamily(null);
      setEditValue("");
      setEditIcon("");
    } catch (err) {
      toast.error("Unable to edit fragrance faimly", { durationMs: 5000 });
    }
  };

  // !! Delete fragrance family
  const deleteFragranceFamily = async (family: string) => {
    try {
      const { error } = await supabase
        .from("fragrance_families")
        .delete()
        .eq("name", family);
      if (error) return console.error(error);

      toast.success("Fragrance family deleted successfully", {
        durationMs: 5000,
      });

      const refreshed = await fetchAllFragranceFamilies();
      setFamilies(refreshed);
    } catch (err) {
      console.error(err, "Unable to delete fragrance faimly");
      toast.error("Unable to delete fragrance faimly", { durationMs: 5000 });
    }
  };

  // !! Function to start editing a fragrance family
  const handleStartEdit = (family: fragrance_family) => {
    setEditingFamily(family.name);
    setEditValue(family.name);
    setEditIcon(family.icon || "Flower2");
    setError(null);
  };

  // !! Get icon component dynamically
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Flower2;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || Flower2;
  };

  // !! Function to cancel editing a fragrance family
  const handleCancelEdit = () => {
    setEditingFamily(null);
    setEditValue("");
    setEditIcon("");
    setError(null);
  };







  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Add New Family */}
      <div className="rounded-2xl border border-gray-200 bg-linear-to-br from-[#D4AF37]/5 to-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-linear-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 p-3">
            <Plus className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <h3 className="text-lg font-bold text-black">
            Add New Fragrance Family
          </h3>
        </div>

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
          >
            + Add Fragrance Family
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              Enter a name and click the icon to select one for this family
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createFragranceFamily();
                  if (e.key === "Escape") {
                    setIsAdding(false);
                    setNewFamilyName("");
                    setNewIcon("Flower2");
                    setShowIconPicker(false);
                    setError(null);
                  }
                }}
                placeholder="e.g., Gourmand"
                autoFocus
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all"
              />
              <button
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:border-[#D4AF37] transition-colors"
                title="Click to select an icon"
              >
                {(() => {
                  const IconComp = getIconComponent(newIcon);
                  return <IconComp className="h-5 w-5 text-[#D4AF37]" />;
                })()}
              </button>
              <button
                onClick={createFragranceFamily}
                disabled={!newFamilyName.trim()}
                className="rounded-xl bg-linear-to-r from-[#D4AF37] to-[#e3c55d] cursor-pointer text-white px-4 py-3 font-semibold shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewFamilyName("");
                  setNewIcon("Flower2");
                  setShowIconPicker(false);
                  setError(null);
                }}
                className="rounded-xl bg-gray-100 text-gray-600 px-4 py-3 font-semibold hover:bg-gray-200 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Icon Picker Dropdown */}
            {showIconPicker && (
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-8 gap-2">
                {AVAILABLE_ICONS.map((icon) => {
                  const IconComp = getIconComponent(icon.name);
                  return (
                    <button
                      key={icon.name}
                      onClick={() => {
                        setNewIcon(icon.name);
                        setShowIconPicker(false);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        newIcon === icon.name
                          ? "bg-[#D4AF37] text-white"
                          : "bg-white hover:bg-gray-100 text-gray-600"
                      }`}
                      title={icon.label}
                    >
                      <IconComp className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fragrance Families List */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-linear-to-br from-purple-500/10 to-purple-500/5 p-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-black">Fragrance Families</h3>
            <p className="text-sm text-gray-600">
              {families.length} families available
            </p>
          </div>
        </div>

        {families.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-base font-medium text-gray-900">
              No fragrance families
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Add your first fragrance family to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {families.map((family) => (
              <div
                key={family.name}
                className="group relative rounded-xl border border-gray-200 bg-white p-4 hover:border-[#D4AF37]/30 hover:shadow-md transition-all"
              >
                {editingFamily === family.name ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") editFragranceFamily();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      autoFocus
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                    
                    {/* Icon Picker for Edit */}
                    <div className="grid grid-cols-8 gap-1">
                      {AVAILABLE_ICONS.map((icon) => {
                        const IconComp = getIconComponent(icon.name);
                        return (
                          <button
                            key={icon.name}
                            onClick={() => setEditIcon(icon.name)}
                            className={`p-1.5 rounded transition-colors ${
                              editIcon === icon.name
                                ? "bg-[#D4AF37] text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                            }`}
                            title={icon.label}
                            type="button"
                          >
                            <IconComp className="h-3 w-3" />
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={editFragranceFamily}
                        className="flex-1 rounded-lg bg-[#D4AF37] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#e3c55d] transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 rounded-lg bg-gray-100 text-gray-600 px-3 py-1.5 text-xs font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const IconComp = getIconComponent(family.icon);
                          return <IconComp className="h-4 w-4 text-[#D4AF37]" />;
                        })()}
                        <span className="font-semibold text-sm text-black">
                          {family.name}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(family)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteFragranceFamily(family.name)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FragranceFamilyManager;