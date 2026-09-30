"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Loader2,
  X,
  CheckCircle2,
  ExternalLink,
  Save
} from "lucide-react";
import {
  getAdminExperiences,
  createAdminExperience,
  updateAdminExperience,
  deleteAdminExperience,
  reorderAdminExperiences
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
import { TExperience, TExperienceBullet, TExperienceMetric } from "@/types/portfolio";

export function ExperienceManager() {
  const queryClient = useQueryClient();

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["admin-experiences"],
    queryFn: getAdminExperiences
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");
  const [sortBy, setSortBy] = useState("order");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<TExperience | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form fields
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"CURRENTLY_WORKING" | "COMPLETED">("COMPLETED");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [bullets, setBullets] = useState<{ text: string }[]>([]);
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([]);
  const [newBulletText, setNewBulletText] = useState("");
  const [newMetricLabel, setNewMetricLabel] = useState("");
  const [newMetricValue, setNewMetricValue] = useState("");

  const resetForm = () => {
    setEditingExperience(null);
    setCompanyName("");
    setRole("");
    setStatus("COMPLETED");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setDescription("");
    setCompanyLogo("");
    setBullets([]);
    setMetrics([]);
    setNewBulletText("");
    setNewMetricLabel("");
    setNewMetricValue("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (exp: TExperience) => {
    setEditingExperience(exp);
    setCompanyName(exp.companyName || "");
    setRole(exp.role || "");
    setStatus(exp.status || "COMPLETED");
    setStartDate(exp.startDate || "");
    setEndDate(exp.endDate || "");
    setLocation(exp.location || "");
    setDescription(exp.description || "");
    setCompanyLogo(exp.companyLogo || "");
    setBullets((exp.bullets || []).map((b) => ({ text: b.text })));
    setMetrics((exp.metrics || []).map((m) => ({ label: m.label, value: m.value })));
    setIsModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: createAdminExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TExperience> }) =>
      updateAdminExperience(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      setDeleteTargetId(null);
    }
  });

  const reorderMutation = useMutation({
    mutationFn: reorderAdminExperiences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim()) return;

    const payload: Partial<TExperience> = {
      companyName: companyName.trim(),
      role: role.trim(),
      status,
      startDate: startDate.trim(),
      endDate: status === "CURRENTLY_WORKING" ? null : endDate.trim() || null,
      location: location.trim() || null,
      description: description.trim(),
      companyLogo: companyLogo.trim() || null,
      bullets: bullets.map((b, i) => ({ id: `b-${i}`, text: b.text, order: i + 1 })),
      metrics: metrics.map((m, i) => ({ id: `m-${i}`, label: m.label, value: m.value, order: i + 1 }))
    };

    if (editingExperience) {
      updateMutation.mutate({ id: editingExperience.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleToggleStatus = async (exp: TExperience, newState: boolean) => {
    await updateAdminExperience(exp.id, { isEnabled: newState });
    queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
  };

  const handleReorder = (newItems: TExperience[]) => {
    queryClient.setQueryData(["admin-experiences"], newItems);
    reorderMutation.mutate(newItems.map((item, idx) => ({ id: item.id, order: idx + 1 })));
  };

  // Filter & Search
  const filteredExperiences = useMemo(() => {
    return experiences
      .filter((exp) => {
        const matchesSearch =
          exp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          statusFilter === "ALL"
            ? true
            : statusFilter === "ENABLED"
            ? exp.isEnabled
            : !exp.isEnabled;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.companyName.localeCompare(b.companyName);
        if (sortBy === "newest") return (b.startDate || "").localeCompare(a.startDate || "");
        return a.order - b.order;
      });
  }, [experiences, searchQuery, statusFilter, sortBy]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content Management"
        title="Experience Manager"
        description="Manage your professional career history, company roles, impact metrics, and key achievement bullets."
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
          { label: "Company Name", value: "name" },
          { label: "Newest First", value: "newest" }
        ]}
        onAddNew={openCreateModal}
        addNewLabel="Add Experience"
        totalCount={experiences.length}
        filteredCount={filteredExperiences.length}
        placeholder="Search experiences by company or role..."
      />

      {filteredExperiences.length > 0 ? (
        <SortableList
          items={filteredExperiences}
          onReorder={handleReorder}
          renderItem={(exp) => (
            <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-(--color-accent)/40 transition">
              <div className="flex items-start gap-4">
                {exp.companyLogo ? (
                  <img
                    src={exp.companyLogo}
                    alt={exp.companyName}
                    className="h-12 w-12 rounded-xl object-contain border border-site p-1 bg-card shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-accent)/10 text-accent shrink-0">
                    <BriefcaseBusiness size={22} />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-highlight">{exp.role}</h3>
                    <span className="text-sm font-semibold text-accent">@ {exp.companyName}</span>
                    {exp.status === "CURRENTLY_WORKING" && (
                      <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/20">
                        Present
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-normal flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {exp.startDate} - {exp.status === "CURRENTLY_WORKING" ? "Present" : exp.endDate || "N/A"}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <p className="text-xs text-normal line-clamp-1 mt-1">
                      • {exp.bullets[0].text} {exp.bullets.length > 1 ? `(+${exp.bullets.length - 1} more)` : ""}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                <StatusToggle
                  isEnabled={exp.isEnabled}
                  onToggle={(newState) => handleToggleStatus(exp, newState)}
                />

                <button
                  type="button"
                  onClick={() => openEditModal(exp)}
                  className="rounded-xl border border-site p-2 text-normal hover:border-(--color-accent) hover:text-accent transition"
                  title="Edit Experience"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTargetId(exp.id)}
                  className="rounded-xl border border-site p-2 text-normal hover:border-red-500 hover:text-red-400 transition"
                  title="Delete Experience"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          )}
        />
      ) : (
        <Card className="p-12 text-center text-normal">
          <BriefcaseBusiness size={40} className="mx-auto mb-3 text-normal/50" />
          <p className="font-semibold text-highlight">No experiences found</p>
          <p className="text-xs text-normal mt-1">
            {searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your filters or search terms."
              : "Click 'Add Experience' to create your first career record."}
          </p>
        </Card>
      )}

      {/* Experience Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-site bg-card p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-site pb-4">
              <div>
                <h3 className="text-lg font-bold text-highlight">
                  {editingExperience ? "Edit Experience" : "Add New Experience"}
                </h3>
                <p className="text-xs text-normal">
                  Configure company details, achievements, and impact metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1 text-normal hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-highlight">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Tech Solutions"
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-highlight">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-highlight">Employment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="CURRENTLY_WORKING">Currently Working</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-highlight">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. Jan 2023"
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-highlight">End Date</label>
                  <input
                    type="text"
                    disabled={status === "CURRENTLY_WORKING"}
                    value={status === "CURRENTLY_WORKING" ? "Present" : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="e.g. Dec 2024"
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-highlight">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA (Remote)"
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                </div>

                <div>
                  <MediaUploader
                    value={companyLogo}
                    onChange={setCompanyLogo}
                    folder="company-logos"
                    label="Company Logo"
                    description="Square logo (PNG/SVG recommended)"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Overview Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of responsibilities, team size, and architectural domain..."
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              {/* Dynamic Bullets */}
              <div className="space-y-3 border-t border-site pt-3">
                <label className="text-xs font-semibold text-highlight">Key Responsibilities / Impact Bullets</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBulletText}
                    onChange={(e) => setNewBulletText(e.target.value)}
                    placeholder="e.g. Architected Redis event pipeline reducing processing latency by 45%..."
                    className="flex-1 rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newBulletText.trim()) {
                        setBullets([...bullets, { text: newBulletText.trim() }]);
                        setNewBulletText("");
                      }
                    }}
                    className="bg-(--color-accent) text-white rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <Plus size={14} /> Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {bullets.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-site bg-(--color-background)/40 px-3 py-2 text-xs text-highlight"
                    >
                      <span className="flex-1 mr-2">• {b.text}</span>
                      <button
                        type="button"
                        onClick={() => setBullets(bullets.filter((_, i) => i !== idx))}
                        className="text-normal hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Metrics */}
              <div className="space-y-3 border-t border-site pt-3">
                <label className="text-xs font-semibold text-highlight">Key Metric Badges</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMetricLabel}
                    onChange={(e) => setNewMetricLabel(e.target.value)}
                    placeholder="Label (e.g. Latency)"
                    className="flex-1 rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newMetricValue}
                    onChange={(e) => setNewMetricValue(e.target.value)}
                    placeholder="Value (e.g. -45%)"
                    className="w-28 rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newMetricLabel.trim() && newMetricValue.trim()) {
                        setMetrics([
                          ...metrics,
                          { label: newMetricLabel.trim(), value: newMetricValue.trim() }
                        ]);
                        setNewMetricLabel("");
                        setNewMetricValue("");
                      }
                    }}
                    className="bg-(--color-accent) text-white rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <Plus size={14} /> Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 rounded-xl border border-site bg-(--color-background)/40 px-3 py-1.5 text-xs text-highlight"
                    >
                      <span className="font-bold text-accent">{m.value}</span>
                      <span className="text-normal">{m.label}</span>
                      <button
                        type="button"
                        onClick={() => setMetrics(metrics.filter((_, i) => i !== idx))}
                        className="ml-1 text-normal hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-site">
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
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Save size={14} className="mr-2" />
                  )}
                  {editingExperience ? "Update Experience" : "Create Experience"}
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
        title="Delete Experience"
        message="Are you sure you want to permanently delete this experience entry?"
      />
    </div>
  );
}
