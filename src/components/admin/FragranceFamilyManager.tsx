"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Check, X, Sparkles } from "lucide-react";
import {
  loadFragranceFamilies,
  addFragranceFamily,
  renameFragranceFamily,
  deleteFragranceFamily,
} from "@/utils/fragranceFamilyStorage";

const FragranceFamilyManager = () => {
  const [families, setFamilies] = useState<string[]>([]);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [editingFamily, setEditingFamily] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setFamilies(loadFragranceFamilies());
  }, []);

  const handleAdd = () => {
    try {
      setError(null);
      const updated = addFragranceFamily(newFamilyName);
      setFamilies(updated);
      setNewFamilyName("");
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add fragrance family");
    }
  };

  const handleStartEdit = (family: string) => {
    setEditingFamily(family);
    setEditValue(family);
    setError(null);
  };

  const handleSaveEdit = () => {
    if (!editingFamily) return;
    try {
      setError(null);
      const updated = renameFragranceFamily(editingFamily, editValue);
      setFamilies(updated);
      setEditingFamily(null);
      setEditValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename fragrance family");
    }
  };

  const handleCancelEdit = () => {
    setEditingFamily(null);
    setEditValue("");
    setError(null);
  };

  const handleDelete = (family: string) => {
    if (!confirm(`Are you sure you want to delete "${family}"?`)) return;
    try {
      setError(null);
      const updated = deleteFragranceFamily(family);
      setFamilies(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete fragrance family");
    }
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
          <h3 className="text-lg font-bold text-black">Add New Fragrance Family</h3>
        </div>

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
          >
            + Add Fragrance Family
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newFamilyName}
              onChange={(e) => setNewFamilyName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewFamilyName("");
                  setError(null);
                }
              }}
              placeholder="e.g., Gourmand"
              autoFocus
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm text-black transition-all"
            />
            <button
              onClick={handleAdd}
              disabled={!newFamilyName.trim()}
              className="rounded-xl bg-linear-to-r from-[#D4AF37] to-[#e3c55d] text-white px-4 py-3 font-semibold shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewFamilyName("");
                setError(null);
              }}
              className="rounded-xl bg-gray-100 text-gray-600 px-4 py-3 font-semibold hover:bg-gray-200 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
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
            <p className="text-sm text-gray-600">{families.length} families available</p>
          </div>
        </div>

        {families.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-base font-medium text-gray-900">No fragrance families</p>
            <p className="mt-1 text-sm text-gray-500">Add your first fragrance family to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {families.map((family) => (
              <div
                key={family}
                className="group relative rounded-xl border border-gray-200 bg-white p-4 hover:border-[#D4AF37]/30 hover:shadow-md transition-all"
              >
                {editingFamily === family ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      autoFocus
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
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
                      <span className="font-semibold text-sm text-black">{family}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(family)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(family)}
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
