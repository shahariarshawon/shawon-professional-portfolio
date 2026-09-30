"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  User,
  Info,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { getAdminAbout, updateAdminAbout } from "@/lib/admin-api";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaUploader } from "@/components/admin/cms/media-uploader";
import { SortableList } from "@/components/admin/cms/sortable-list";
import { StatusToggle } from "@/components/admin/cms/status-toggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { TAboutSection, TQuickFact } from "@/types/portfolio";

export function AboutManager() {
  const queryClient = useQueryClient();

  const { data: about, isLoading } = useQuery({
    queryKey: ["admin-about"],
    queryFn: getAdminAbout
  });

  const [formData, setFormData] = useState<Partial<TAboutSection>>({
    currentStatus: "",
    programmingJourney: "",
    workEnjoyment: "",
    backendInterest: "",
    futurePlan: "",
    personality: "",
    hobbies: "",
    imageUrl: "",
    quickFacts: []
  });

  const [newFact, setNewFact] = useState({ label: "", value: "" });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (about) {
      setFormData({
        currentStatus: about.currentStatus || "",
        programmingJourney: about.programmingJourney || "",
        workEnjoyment: about.workEnjoyment || "",
        backendInterest: about.backendInterest || "",
        futurePlan: about.futurePlan || "",
        personality: about.personality || "",
        hobbies: about.hobbies || "",
        imageUrl: about.imageUrl || "",
        quickFacts: about.quickFacts || []
      });
    }
  }, [about]);

  const updateMutation = useMutation({
    mutationFn: updateAdminAbout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-about"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  });

  const handleInputChange = (field: keyof TAboutSection, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleAddQuickFact = () => {
    if (!newFact.label.trim() || !newFact.value.trim()) return;

    const currentFacts = formData.quickFacts || [];
    const fact: TQuickFact = {
      id: `temp-${Date.now()}`,
      label: newFact.label.trim(),
      value: newFact.value.trim(),
      order: currentFacts.length + 1,
      isEnabled: true
    };

    setFormData((prev) => ({
      ...prev,
      quickFacts: [...(prev.quickFacts || []), fact]
    }));

    setNewFact({ label: "", value: "" });
  };

  const handleRemoveQuickFact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      quickFacts: (prev.quickFacts || []).filter((_, i) => i !== index)
    }));
  };

  const handleToggleFact = (index: number, newState: boolean) => {
    const updated = [...(formData.quickFacts || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], isEnabled: newState };
      setFormData((prev) => ({ ...prev, quickFacts: updated }));
    }
  };

  const handleReorderFacts = (reordered: TQuickFact[]) => {
    setFormData((prev) => ({ ...prev, quickFacts: reordered }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          eyebrow="Content Management"
          title="About Section Manager"
          description="Edit your background story, technical focus, personal philosophy, profile photo, and quick facts."
        />

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 animate-in fade-in">
              <CheckCircle2 size={16} /> Saved!
            </span>
          )}

          <Button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 bg-(--color-accent) hover:opacity-90 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition"
          >
            {updateMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Bio Sections */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="text-base font-bold text-highlight flex items-center gap-2">
              <User size={18} className="text-accent" />
              Core Narrative
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-highlight">Current Status</label>
                <textarea
                  rows={3}
                  value={formData.currentStatus || ""}
                  onChange={(e) => handleInputChange("currentStatus", e.target.value)}
                  placeholder="e.g. Currently working as a Software Engineer specializing in scalable backend systems..."
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-3 text-sm text-highlight placeholder:text-normal focus:border-(--color-accent) focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Programming Journey</label>
                <textarea
                  rows={4}
                  value={formData.programmingJourney || ""}
                  onChange={(e) => handleInputChange("programmingJourney", e.target.value)}
                  placeholder="How you began programming, foundational learning, early milestones..."
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-3 text-sm text-highlight placeholder:text-normal focus:border-(--color-accent) focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Backend Interest & Technical Focus</label>
                <textarea
                  rows={4}
                  value={formData.backendInterest || ""}
                  onChange={(e) => handleInputChange("backendInterest", e.target.value)}
                  placeholder="Why backend architecture excites you, distributed systems, database optimization..."
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-3 text-sm text-highlight placeholder:text-normal focus:border-(--color-accent) focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Work Enjoyment & Engineering Culture</label>
                <textarea
                  rows={3}
                  value={formData.workEnjoyment || ""}
                  onChange={(e) => handleInputChange("workEnjoyment", e.target.value)}
                  placeholder="What keeps you energized, clean code, mentorship, collaboration..."
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-3 text-sm text-highlight placeholder:text-normal focus:border-(--color-accent) focus:outline-none transition"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-highlight">Future Aspirations</label>
                  <textarea
                    rows={3}
                    value={formData.futurePlan || ""}
                    onChange={(e) => handleInputChange("futurePlan", e.target.value)}
                    placeholder="Future tech interests, cloud architecture, system design goals..."
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-3 text-sm text-highlight placeholder:text-normal focus:border-(--color-accent) focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-highlight">Personality & Hobbies</label>
                  <textarea
                    rows={3}
                    value={formData.personality || ""}
                    onChange={(e) => handleInputChange("personality", e.target.value)}
                    placeholder="Work ethos, personal traits, favorite hobbies..."
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-3 text-sm text-highlight placeholder:text-normal focus:border-(--color-accent) focus:outline-none transition"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Facts Section with DnD */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-highlight flex items-center gap-2">
                  <Sparkles size={18} className="text-accent" />
                  Quick Facts & Highlights
                </h2>
                <p className="text-xs text-normal mt-0.5">
                  Drag and drop to reorder facts shown on the public about section.
                </p>
              </div>
            </div>

            {/* Add Fact Form */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center rounded-2xl border border-site bg-(--color-background)/40 p-4">
              <input
                type="text"
                value={newFact.label}
                onChange={(e) => setNewFact((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="Label (e.g. Experience)"
                className="flex-1 rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
              />
              <input
                type="text"
                value={newFact.value}
                onChange={(e) => setNewFact((prev) => ({ ...prev, value: e.target.value }))}
                placeholder="Value (e.g. 3+ Years Production)"
                className="flex-1 rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
              />
              <Button
                type="button"
                onClick={handleAddQuickFact}
                className="shrink-0 flex items-center gap-1.5 bg-(--color-accent) text-white rounded-xl px-4 py-2 text-xs font-semibold"
              >
                <Plus size={14} /> Add Fact
              </Button>
            </div>

            {/* Quick Facts Sortable List */}
            {formData.quickFacts && formData.quickFacts.length > 0 ? (
              <SortableList
                items={formData.quickFacts}
                onReorder={handleReorderFacts}
                renderItem={(fact, index) => (
                  <div className="flex items-center justify-between rounded-xl border border-site bg-(--color-background)/40 p-3 hover:border-(--color-accent)/40 transition">
                    <div>
                      <p className="text-xs font-semibold text-highlight">{fact.label}</p>
                      <p className="text-xs text-normal mt-0.5">{fact.value}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusToggle
                        isEnabled={fact.isEnabled}
                        onToggle={(newState) => handleToggleFact(index, newState)}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveQuickFact(index)}
                        className="p-1 text-normal hover:text-red-400 transition"
                        title="Delete fact"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              />
            ) : (
              <p className="text-xs text-normal text-center py-4">No quick facts added yet.</p>
            )}
          </Card>
        </div>

        {/* Sidebar / Media */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-bold text-highlight flex items-center gap-2">
              <Info size={18} className="text-accent" />
              About Photo
            </h2>

            <MediaUploader
              value={formData.imageUrl}
              onChange={(url) => handleInputChange("imageUrl", url)}
              folder="about"
              label="Profile Photo"
              description="High resolution portrait (PNG, JPG, WebP)"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
