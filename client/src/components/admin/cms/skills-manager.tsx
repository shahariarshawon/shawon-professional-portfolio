"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  FolderPlus,
  Loader2,
  X,
  Save,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import {
  getAdminSkillCategories,
  createAdminSkillCategory,
  updateAdminSkillCategory,
  deleteAdminSkillCategory,
  reorderAdminSkillCategories,
  getAdminSkills,
  createAdminSkill,
  updateAdminSkill,
  deleteAdminSkill,
  reorderAdminSkills
} from "@/lib/admin-api";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SearchFilterBar } from "@/components/admin/cms/search-filter-bar";
import { SortableList } from "@/components/admin/cms/sortable-list";
import { StatusToggle } from "@/components/admin/cms/status-toggle";
import { ConfirmDialog } from "@/components/admin/cms/confirm-dialog";
import { MediaUploader } from "@/components/admin/cms/media-uploader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { TSkill, TSkillCategory } from "@/types/portfolio";
import { SafeImage } from "@/components/ui/safe-image";

export function SkillsManager() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["admin-skill-categories"],
    queryFn: getAdminSkillCategories
  });

  const { data: allSkills = [], isLoading: isSkillsLoading } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: getAdminSkills
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TSkillCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [deleteTargetCategoryId, setDeleteTargetCategoryId] = useState<string | null>(null);

  // Skill Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<TSkill | null>(null);
  const [skillName, setSkillName] = useState("");
  const [skillIconUrl, setSkillIconUrl] = useState("");
  const [skillLevel, setSkillLevel] = useState<number>(90);
  const [skillCategoryId, setSkillCategoryId] = useState<string>("");
  const [deleteTargetSkillId, setDeleteTargetSkillId] = useState<string | null>(null);

  /* ---------------- Category Mutations ---------------- */

  const createCategoryMutation = useMutation({
    mutationFn: createAdminSkillCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skill-categories"] });
      setIsCategoryModalOpen(false);
      setCategoryName("");
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TSkillCategory> }) =>
      updateAdminSkillCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skill-categories"] });
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryName("");
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteAdminSkillCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skill-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      setDeleteTargetCategoryId(null);
      if (selectedCategoryId === deleteTargetCategoryId) {
        setSelectedCategoryId("ALL");
      }
    }
  });

  const reorderCategoriesMutation = useMutation({
    mutationFn: reorderAdminSkillCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skill-categories"] });
    }
  });

  /* ---------------- Skill Mutations ---------------- */

  const createSkillMutation = useMutation({
    mutationFn: createAdminSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      queryClient.invalidateQueries({ queryKey: ["admin-skill-categories"] });
      setIsSkillModalOpen(false);
      resetSkillForm();
    }
  });

  const updateSkillMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TSkill> }) =>
      updateAdminSkill(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      queryClient.invalidateQueries({ queryKey: ["admin-skill-categories"] });
      setIsSkillModalOpen(false);
      resetSkillForm();
    }
  });

  const deleteSkillMutation = useMutation({
    mutationFn: deleteAdminSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      queryClient.invalidateQueries({ queryKey: ["admin-skill-categories"] });
      setDeleteTargetSkillId(null);
    }
  });

  const reorderSkillsMutation = useMutation({
    mutationFn: reorderAdminSkills,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      queryClient.invalidateQueries({ queryKey: ["admin-skill-categories"] });
    }
  });

  const resetSkillForm = () => {
    setEditingSkill(null);
    setSkillName("");
    setSkillIconUrl("");
    setSkillLevel(90);
    setSkillCategoryId(categories[0]?.id || "");
  };

  const openCreateSkillModal = () => {
    resetSkillForm();
    if (selectedCategoryId !== "ALL") {
      setSkillCategoryId(selectedCategoryId);
    } else if (categories.length > 0) {
      setSkillCategoryId(categories[0].id);
    }
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: TSkill) => {
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillIconUrl(skill.iconUrl || "");
    setSkillLevel(skill.level || 90);
    setSkillCategoryId(skill.categoryId || skill.category?.id || categories[0]?.id || "");
    setIsSkillModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, payload: { name: categoryName.trim() } });
    } else {
      createCategoryMutation.mutate({ name: categoryName.trim(), order: categories.length + 1 });
    }
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim() || !skillCategoryId) return;

    const payload: Partial<TSkill> = {
      name: skillName.trim(),
      iconUrl: skillIconUrl.trim() || null,
      level: Number(skillLevel) || null,
      categoryId: skillCategoryId
    };

    if (editingSkill) {
      updateSkillMutation.mutate({ id: editingSkill.id, payload });
    } else {
      createSkillMutation.mutate(payload);
    }
  };

  const handleToggleSkillStatus = async (skill: TSkill, newState: boolean) => {
    await updateAdminSkill(skill.id, { isEnabled: newState });
    queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
  };

  const handleToggleCategoryStatus = async (cat: TSkillCategory, newState: boolean) => {
    await updateAdminSkillCategory(cat.id, { isEnabled: newState });
    queryClient.invalidateQueries({ queryKey: ["admin-skill-categories"] });
  };

  const handleReorderCategories = (newCategories: TSkillCategory[]) => {
    queryClient.setQueryData(["admin-skill-categories"], newCategories);
    reorderCategoriesMutation.mutate(newCategories.map((c, i) => ({ id: c.id, order: i + 1 })));
  };

  const handleMoveCategory = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;

    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    handleReorderCategories(next);
  };

  const handleReorderSkills = (newSkills: TSkill[]) => {
    queryClient.setQueryData(["admin-skills"], newSkills);
    reorderSkillsMutation.mutate(newSkills.map((s, i) => ({ id: s.id, order: i + 1 })));
  };

  // Filter skills
  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      const catId = skill.categoryId || skill.category?.id;
      const matchesCategory = selectedCategoryId === "ALL" || catId === selectedCategoryId;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ENABLED"
          ? skill.isEnabled
          : !skill.isEnabled;

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [allSkills, selectedCategoryId, searchQuery, statusFilter]);

  if (isCategoriesLoading || isSkillsLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          eyebrow="Content Management"
          title="Skills & Technologies Manager"
          description="Organize your technical proficiencies, frameworks, cloud tools, and custom skill categories."
        />

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingCategory(null);
              setCategoryName("");
              setIsCategoryModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl text-xs font-semibold"
          >
            <FolderPlus size={16} /> Add Category
          </Button>

          <Button
            type="button"
            onClick={openCreateSkillModal}
            className="flex items-center gap-2 bg-(--color-accent) text-white rounded-xl text-xs font-semibold"
          >
            <Plus size={16} /> Add Skill
          </Button>
        </div>
      </div>

      {/* Category Pills & Reordering */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-highlight flex items-center gap-1.5">
            <Layers size={15} className="text-accent" /> Categories
          </span>
          <span className="text-[11px] text-normal">Click category to filter skills</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategoryId("ALL")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              selectedCategoryId === "ALL"
                ? "bg-(--color-accent) text-white"
                : "border border-site bg-card text-normal hover:text-highlight"
            }`}
          >
            All Categories ({allSkills.length})
          </button>

          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className={`group flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold border transition ${
                selectedCategoryId === cat.id
                  ? "border-(--color-accent) bg-(--color-accent)/10 text-accent"
                  : "border-site bg-card text-normal hover:border-(--color-accent)/40 hover:text-highlight"
              } ${cat.isEnabled ? "" : "opacity-60"}`}
            >
              <button
                type="button"
                onClick={() => handleMoveCategory(index, -1)}
                disabled={index === 0}
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 p-0.5 text-normal hover:text-highlight disabled:hidden transition"
                title="Move earlier"
                aria-label={`Move ${cat.name} earlier`}
              >
                <ChevronLeft size={12} />
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className="cursor-pointer"
              >
                {cat.name} ({cat.skills?.length || 0})
                {cat.isEnabled ? "" : " · hidden"}
              </button>

              <button
                type="button"
                onClick={() => handleMoveCategory(index, 1)}
                disabled={index === categories.length - 1}
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 p-0.5 text-normal hover:text-highlight disabled:hidden transition"
                title="Move later"
                aria-label={`Move ${cat.name} later`}
              >
                <ChevronRight size={12} />
              </button>

              <button
                type="button"
                onClick={() => handleToggleCategoryStatus(cat, !cat.isEnabled)}
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 p-0.5 text-normal hover:text-highlight transition"
                title={cat.isEnabled ? "Hide from the public site" : "Show on the public site"}
                aria-label={cat.isEnabled ? `Hide ${cat.name}` : `Show ${cat.name}`}
              >
                {cat.isEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingCategory(cat);
                  setCategoryName(cat.name);
                  setIsCategoryModalOpen(true);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-normal hover:text-highlight transition"
                title="Edit category name"
              >
                <Edit2 size={12} />
              </button>

              <button
                type="button"
                onClick={() => setDeleteTargetCategoryId(cat.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-normal hover:text-red-400 transition"
                title="Delete category"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Toolbar & List */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddNew={openCreateSkillModal}
        addNewLabel="Add Skill"
        totalCount={allSkills.length}
        filteredCount={filteredSkills.length}
        placeholder="Search skill (e.g. PostgreSQL, Go, Docker)..."
      />

      {filteredSkills.length > 0 ? (
        <SortableList
          items={filteredSkills}
          onReorder={handleReorderSkills}
          renderItem={(skill) => {
            const categoryName =
              skill.category?.name ||
              categories.find((c) => c.id === skill.categoryId)?.name ||
              "Uncategorized";

            return (
              <Card className="p-4 flex items-center justify-between gap-4 hover:border-(--color-accent)/40 transition">
                <div className="flex items-center gap-3 min-w-0">
                  {skill.iconUrl ? (
                    <SafeImage
                      src={skill.iconUrl}
                      alt={skill.name}
                      className="h-9 w-9 rounded-lg object-contain border border-site p-1 bg-card shrink-0"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-accent)/10 text-accent shrink-0">
                      <Sparkles size={18} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-highlight truncate">{skill.name}</p>
                      <span className="rounded-md bg-white/5 border border-site px-2 py-0.5 text-[10px] text-normal">
                        {categoryName}
                      </span>
                    </div>

                    {skill.level ? (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 w-24 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-(--color-accent) rounded-full"
                            style={{ width: `${Math.min(100, skill.level)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-normal font-mono">{skill.level}%</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusToggle
                    isEnabled={skill.isEnabled}
                    onToggle={(newState) => handleToggleSkillStatus(skill, newState)}
                  />

                  <button
                    type="button"
                    onClick={() => openEditSkillModal(skill)}
                    className="rounded-xl border border-site p-1.5 text-normal hover:border-(--color-accent) hover:text-accent transition"
                    title="Edit skill"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetSkillId(skill.id)}
                    className="rounded-xl border border-site p-1.5 text-normal hover:border-red-500 hover:text-red-400 transition"
                    title="Delete skill"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            );
          }}
        />
      ) : (
        <Card className="p-12 text-center text-normal">
          <Sparkles size={40} className="mx-auto mb-3 text-normal/50" />
          <p className="font-semibold text-highlight">No skills found</p>
          <p className="text-xs text-normal mt-1">
            {searchQuery || statusFilter !== "ALL" || selectedCategoryId !== "ALL"
              ? "Try adjusting your category filter or search query."
              : "Click 'Add Skill' to add your technical abilities."}
          </p>
        </Card>
      )}

      {/* Category Create/Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-site bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-site pb-3">
              <h3 className="text-base font-bold text-highlight">
                {editingCategory ? "Edit Category" : "New Skill Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-normal hover:text-highlight"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-highlight">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Distributed Systems & Databases"
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  className="bg-(--color-accent) text-white rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  {createCategoryMutation.isPending || updateCategoryMutation.isPending ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : null}
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Create/Edit Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl border border-site bg-card p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-site pb-3">
              <h3 className="text-base font-bold text-highlight">
                {editingSkill ? "Edit Skill" : "Add Technical Skill"}
              </h3>
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="text-normal hover:text-highlight"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-highlight">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. PostgreSQL, Redis, Node.js"
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Category *</label>
                <select
                  required
                  value={skillCategoryId}
                  onChange={(e) => setSkillCategoryId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">
                  Proficiency Level ({skillLevel}%)
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(Number(e.target.value))}
                  className="mt-2 w-full accent-(--color-accent) cursor-pointer"
                />
              </div>

              <MediaUploader
                value={skillIconUrl}
                onChange={setSkillIconUrl}
                folder="skills"
                label="Skill Icon"
                description="Small SVG or PNG icon"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-site">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createSkillMutation.isPending || updateSkillMutation.isPending}
                  className="bg-(--color-accent) text-white rounded-xl px-5 py-2 text-xs font-semibold"
                >
                  {createSkillMutation.isPending || updateSkillMutation.isPending ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <Save size={14} className="mr-1.5" />
                  )}
                  {editingSkill ? "Update Skill" : "Add Skill"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetCategoryId)}
        onClose={() => setDeleteTargetCategoryId(null)}
        onConfirm={() => {
          if (deleteTargetCategoryId) deleteCategoryMutation.mutate(deleteTargetCategoryId);
        }}
        title="Delete Skill Category"
        message="Deleting this category will also remove or uncategorize skills associated with it."
      />

      {/* Delete Skill Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetSkillId)}
        onClose={() => setDeleteTargetSkillId(null)}
        onConfirm={() => {
          if (deleteTargetSkillId) deleteSkillMutation.mutate(deleteTargetSkillId);
        }}
        title="Delete Skill"
        message="Are you sure you want to delete this technical skill from your portfolio?"
      />
    </div>
  );
}
