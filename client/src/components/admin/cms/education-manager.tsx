"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Loader2,
  X,
  Save
} from "lucide-react";
import {
  getAdminEducation,
  createAdminEducation,
  updateAdminEducation,
  deleteAdminEducation,
  reorderAdminEducation
} from "@/lib/admin-api";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SearchFilterBar } from "@/components/admin/cms/search-filter-bar";
import { SortableList } from "@/components/admin/cms/sortable-list";
import { StatusToggle } from "@/components/admin/cms/status-toggle";
import { ConfirmDialog } from "@/components/admin/cms/confirm-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { TEducation } from "@/types/portfolio";

export function EducationManager() {
  const queryClient = useQueryClient();

  const { data: educations = [], isLoading } = useQuery({
    queryKey: ["admin-education"],
    queryFn: getAdminEducation
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");
  const [sortBy, setSortBy] = useState("order");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<TEducation | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form Fields
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setEditingEducation(null);
    setInstitution("");
    setDegree("");
    setDuration("");
    setLocation("");
    setDescription("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (edu: TEducation) => {
    setEditingEducation(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setDuration(edu.duration);
    setLocation(edu.location || "");
    setDescription(edu.description || "");
    setIsModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: createAdminEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-education"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TEducation> }) =>
      updateAdminEducation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-education"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-education"] });
      setDeleteTargetId(null);
    }
  });

  const reorderMutation = useMutation({
    mutationFn: reorderAdminEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-education"] });
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) return;

    const payload: Partial<TEducation> = {
      institution: institution.trim(),
      degree: degree.trim(),
      duration: duration.trim(),
      location: location.trim() || null,
      description: description.trim() || null,
      order: editingEducation ? editingEducation.order : educations.length + 1
    };

    if (editingEducation) {
      updateMutation.mutate({ id: editingEducation.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleToggleStatus = async (edu: TEducation, newState: boolean) => {
    await updateAdminEducation(edu.id, { isEnabled: newState });
    queryClient.invalidateQueries({ queryKey: ["admin-education"] });
  };

  const handleReorder = (newItems: TEducation[]) => {
    queryClient.setQueryData(["admin-education"], newItems);
    reorderMutation.mutate(newItems.map((item, idx) => ({ id: item.id, order: idx + 1 })));
  };

  const filteredEducation = useMemo(() => {
    return educations
      .filter((edu) => {
        const matchesSearch =
          edu.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          edu.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (edu.description && edu.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          statusFilter === "ALL"
            ? true
            : statusFilter === "ENABLED"
            ? edu.isEnabled
            : !edu.isEnabled;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.degree.localeCompare(b.degree);
        return a.order - b.order;
      });
  }, [educations, searchQuery, statusFilter, sortBy]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content Management"
        title="Education Manager"
        description="Manage your university degrees, coursework, academic institutions, and academic milestones."
      />

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={[
          { label: "Default Order", value: "order" },
          { label: "Degree Title", value: "name" }
        ]}
        onAddNew={openCreateModal}
        addNewLabel="Add Education"
        totalCount={educations.length}
        filteredCount={filteredEducation.length}
        placeholder="Search education by degree or institution..."
      />

      {filteredEducation.length > 0 ? (
        <SortableList
          items={filteredEducation}
          onReorder={handleReorder}
          renderItem={(edu) => (
            <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-(--color-accent)/40 transition">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-accent)/10 text-accent shrink-0">
                  <GraduationCap size={22} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-highlight">{edu.degree}</h3>
                  <p className="text-sm font-semibold text-accent">{edu.institution}</p>

                  <div className="flex items-center gap-3 text-xs text-normal flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {edu.duration}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {edu.location}
                      </span>
                    )}
                  </div>

                  {edu.description && (
                    <p className="text-xs text-normal mt-1 line-clamp-2">{edu.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <StatusToggle
                  isEnabled={edu.isEnabled}
                  onToggle={(newState) => handleToggleStatus(edu, newState)}
                />

                <button
                  type="button"
                  onClick={() => openEditModal(edu)}
                  className="rounded-xl border border-site p-2 text-normal hover:border-(--color-accent) hover:text-accent transition"
                  title="Edit education"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTargetId(edu.id)}
                  className="rounded-xl border border-site p-2 text-normal hover:border-red-500 hover:text-red-400 transition"
                  title="Delete education"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          )}
        />
      ) : (
        <Card className="p-12 text-center text-normal">
          <GraduationCap size={40} className="mx-auto mb-3 text-normal/50" />
          <p className="font-semibold text-highlight">No education records found</p>
          <p className="text-xs text-normal mt-1">
            {searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your search criteria."
              : "Click 'Add Education' to create your first degree or academic history."}
          </p>
        </Card>
      )}

      {/* Education Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-site bg-card p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-site pb-3">
              <h3 className="text-base font-bold text-highlight">
                {editingEducation ? "Edit Education" : "Add Education Record"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-normal hover:text-highlight"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-highlight">Degree / Program *</label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Sc. in Computer Science and Engineering"
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Institution / University *</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Bangladesh University of Engineering & Technology"
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-highlight">Duration *</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2019 - 2023"
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-highlight">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dhaka, Bangladesh"
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Description / Coursework</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key achievements, major concentrations, CGPA, relevant coursework..."
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-site">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-(--color-accent) text-white rounded-xl px-5 py-2 text-xs font-semibold"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <Save size={14} className="mr-1.5" />
                  )}
                  {editingEducation ? "Update Record" : "Save Record"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteMutation.mutate(deleteTargetId);
        }}
        title="Delete Education"
        message="Are you sure you want to permanently delete this education record?"
      />
    </div>
  );
}
