"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  Edit2,
  Layers,
  Loader2,
  X,
  Save,
  Check
} from "lucide-react";
import {
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  reorderAdminServices
} from "@/lib/admin-api";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SearchFilterBar } from "@/components/admin/cms/search-filter-bar";
import { SortableList } from "@/components/admin/cms/sortable-list";
import { StatusToggle } from "@/components/admin/cms/status-toggle";
import { ConfirmDialog } from "@/components/admin/cms/confirm-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { TService } from "@/types/portfolio";

export function ServicesManager() {
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: getAdminServices
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");
  const [sortBy, setSortBy] = useState("order");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<TService | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [features, setFeatures] = useState<{ text: string }[]>([]);
  const [newFeatureText, setNewFeatureText] = useState("");

  const resetForm = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setIcon("");
    setFeatures([]);
    setNewFeatureText("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (service: TService) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon || "");
    setFeatures((service.features || []).map((f) => ({ text: f.text })));
    setIsModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: createAdminService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TService> }) =>
      updateAdminService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      setDeleteTargetId(null);
    }
  });

  const reorderMutation = useMutation({
    mutationFn: reorderAdminServices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const payload: Partial<TService> = {
      title: title.trim(),
      description: description.trim(),
      icon: icon.trim() || null,
      order: editingService ? editingService.order : services.length + 1,
      features: features.map((f, i) => ({ text: f.text, order: i + 1 }))
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleToggleStatus = async (service: TService, newState: boolean) => {
    await updateAdminService(service.id, { isEnabled: newState });
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
  };

  const handleReorder = (newItems: TService[]) => {
    queryClient.setQueryData(["admin-services"], newItems);
    reorderMutation.mutate(newItems.map((item, idx) => ({ id: item.id, order: idx + 1 })));
  };

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesSearch =
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "ALL"
            ? true
            : statusFilter === "ENABLED"
            ? service.isEnabled
            : !service.isEnabled;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.title.localeCompare(b.title);
        return a.order - b.order;
      });
  }, [services, searchQuery, statusFilter, sortBy]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content Management"
        title="Services Manager"
        description="Define client offerings, engineering consulting services, system architecture advisory, and feature highlights."
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
          { label: "Service Title", value: "name" }
        ]}
        onAddNew={openCreateModal}
        addNewLabel="Add Service"
        totalCount={services.length}
        filteredCount={filteredServices.length}
        placeholder="Search services..."
      />

      {filteredServices.length > 0 ? (
        <SortableList
          items={filteredServices}
          onReorder={handleReorder}
          renderItem={(service) => (
            <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-(--color-accent)/40 transition">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-accent)/10 text-accent shrink-0">
                  <Layers size={22} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-highlight">{service.title}</h3>
                  <p className="text-xs text-normal line-clamp-2">{service.description}</p>

                  {service.features && service.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {service.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 rounded-md bg-white/5 border border-site px-2 py-0.5 text-[10px] text-highlight"
                        >
                          <Check size={11} className="text-accent" /> {feat.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <StatusToggle
                  isEnabled={service.isEnabled}
                  onToggle={(newState) => handleToggleStatus(service, newState)}
                />

                <button
                  type="button"
                  onClick={() => openEditModal(service)}
                  className="rounded-xl border border-site p-2 text-normal hover:border-(--color-accent) hover:text-accent transition"
                  title="Edit service"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTargetId(service.id)}
                  className="rounded-xl border border-site p-2 text-normal hover:border-red-500 hover:text-red-400 transition"
                  title="Delete service"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          )}
        />
      ) : (
        <Card className="p-12 text-center text-normal">
          <Layers size={40} className="mx-auto mb-3 text-normal/50" />
          <p className="font-semibold text-highlight">No services found</p>
          <p className="text-xs text-normal mt-1">
            {searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your search criteria."
              : "Click 'Add Service' to create your first client offering or technical service."}
          </p>
        </Card>
      )}

      {/* Service Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-site bg-card p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-site pb-3">
              <h3 className="text-base font-bold text-highlight">
                {editingService ? "Edit Service" : "Add New Service"}
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
                <label className="text-xs font-semibold text-highlight">Service Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Backend Architecture & High-Concurrency Systems"
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the value delivered, technologies used, and outcomes provided..."
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Icon Name / Identifier</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g. Database, Server, Cpu, Cloud (optional)"
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              {/* Dynamic Feature Bullets */}
              <div className="space-y-3 border-t border-site pt-3">
                <label className="text-xs font-semibold text-highlight">Deliverables & Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="e.g. Distributed database partitioning and indexing..."
                    className="flex-1 rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newFeatureText.trim()) {
                        setFeatures([...features, { text: newFeatureText.trim() }]);
                        setNewFeatureText("");
                      }
                    }}
                    className="bg-(--color-accent) text-white rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <Plus size={14} /> Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {features.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-site bg-(--color-background)/40 px-3 py-2 text-xs text-highlight"
                    >
                      <span className="flex-1 mr-2 flex items-center gap-1.5">
                        <Check size={12} className="text-accent shrink-0" />
                        {f.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                        className="text-normal hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
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
                  {editingService ? "Update Service" : "Add Service"}
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
        title="Delete Service"
        message="Are you sure you want to permanently delete this service offering?"
      />
    </div>
  );
}
