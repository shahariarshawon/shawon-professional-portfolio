"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Globe,
  Palette,
  Link as LinkIcon,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
  getAdminFooterLinks,
  createAdminFooterLink,
  updateAdminFooterLink,
  deleteAdminFooterLink,
  reorderAdminFooterLinks,
  type TFooterLinkPayload
} from "@/lib/admin-api";
import type { TFooterLink } from "@/types/portfolio";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SortableList } from "@/components/admin/cms/sortable-list";
import { StatusToggle } from "@/components/admin/cms/status-toggle";
import { ConfirmDialog } from "@/components/admin/cms/confirm-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";

export function SettingsManager() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: getAdminSiteSettings
  });

  const { data: footerLinks = [], isLoading: isFooterLoading } = useQuery({
    queryKey: ["admin-footer-links"],
    queryFn: getAdminFooterLinks
  });

  const [activeTab, setActiveTab] = useState<"general" | "seo" | "branding" | "footer">("general");

  // Form Fields
  const [siteTitle, setSiteTitle] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywordsInput, setSeoKeywordsInput] = useState("");
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [accentColor, setAccentColor] = useState("#599692");
  const [backgroundColor, setBackgroundColor] = useState("#11172a");
  const [normalTextColor, setNormalTextColor] = useState("#626c7d");
  const [highlightedTextColor, setHighlightedTextColor] = useState("#dfe5ec");

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Footer Link Modal
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
  const [editingFooterLink, setEditingFooterLink] = useState<TFooterLink | null>(null);
  const [footerLabel, setFooterLabel] = useState("");
  const [footerHref, setFooterHref] = useState("");
  const [deleteFooterTargetId, setDeleteFooterTargetId] = useState<string | null>(null);

  // Load the saved settings into the editable form whenever a new copy arrives.
  // Adjusting state during render (instead of in an effect) avoids a second,
  // cascading render pass: https://react.dev/learn/you-might-not-need-an-effect
  const [loadedSettings, setLoadedSettings] = useState(settings);
  if (settings && settings !== loadedSettings) {
    setLoadedSettings(settings);
    setSiteTitle(settings.siteTitle || "");
    setSeoTitle(settings.seoTitle || "");
    setSeoDescription(settings.seoDescription || "");
    setSeoKeywords(settings.seoKeywords || []);
    setAccentColor(settings.accentColor || "#599692");
    setBackgroundColor(settings.backgroundColor || "#11172a");
    setNormalTextColor(settings.normalTextColor || "#626c7d");
    setHighlightedTextColor(settings.highlightedTextColor || "#dfe5ec");
  }

  const updateSettingsMutation = useMutation({
    mutationFn: updateAdminSiteSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  });

  /* ---------------- Footer Link Mutations ---------------- */

  const createFooterMutation = useMutation({
    mutationFn: createAdminFooterLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-footer-links"] });
      setIsFooterModalOpen(false);
      setFooterLabel("");
      setFooterHref("");
    }
  });

  const updateFooterMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TFooterLinkPayload> }) =>
      updateAdminFooterLink(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-footer-links"] });
      setIsFooterModalOpen(false);
      setEditingFooterLink(null);
      setFooterLabel("");
      setFooterHref("");
    }
  });

  const deleteFooterMutation = useMutation({
    mutationFn: deleteAdminFooterLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-footer-links"] });
      setDeleteFooterTargetId(null);
    }
  });

  const reorderFooterMutation = useMutation({
    mutationFn: reorderAdminFooterLinks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-footer-links"] });
    }
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      siteTitle: siteTitle.trim(),
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
      seoKeywords,
      accentColor,
      backgroundColor,
      normalTextColor,
      highlightedTextColor
    });
  };

  const handleAddKeyword = () => {
    if (seoKeywordsInput.trim()) {
      const words = seoKeywordsInput
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0 && !seoKeywords.includes(k));
      setSeoKeywords([...seoKeywords, ...words]);
      setSeoKeywordsInput("");
    }
  };

  const handleRemoveKeyword = (word: string) => {
    setSeoKeywords(seoKeywords.filter((k) => k !== word));
  };

  const handleSaveFooterLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerLabel.trim() || !footerHref.trim()) return;

    if (editingFooterLink) {
      updateFooterMutation.mutate({
        id: editingFooterLink.id,
        payload: { label: footerLabel.trim(), href: footerHref.trim() }
      });
    } else {
      createFooterMutation.mutate({
        label: footerLabel.trim(),
        href: footerHref.trim(),
        order: footerLinks.length + 1
      });
    }
  };

  const handleToggleFooterStatus = async (link: TFooterLink, newState: boolean) => {
    await updateAdminFooterLink(link.id, { isEnabled: newState });
    queryClient.invalidateQueries({ queryKey: ["admin-footer-links"] });
  };

  const handleReorderFooter = (newItems: TFooterLink[]) => {
    queryClient.setQueryData(["admin-footer-links"], newItems);
    reorderFooterMutation.mutate(newItems.map((item, idx) => ({ id: item.id, order: idx + 1 })));
  };

  if (isSettingsLoading || isFooterLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          eyebrow="Configuration"
          title="Settings & SEO Manager"
          description="Manage site metadata, OpenGraph search optimization, theme design tokens, and footer links."
        />

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 animate-in fade-in">
              <CheckCircle2 size={16} /> Saved!
            </span>
          )}

          <Button
            type="button"
            onClick={handleSaveSettings}
            disabled={updateSettingsMutation.isPending}
            className="flex items-center gap-2 bg-(--color-accent) text-white rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            {updateSettingsMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-site pb-3">
        {(
          [
            { id: "general", label: "General & Identity", icon: Globe },
            { id: "seo", label: "SEO & Social Sharing", icon: Globe },
            { id: "branding", label: "Theme Palette Tokens", icon: Palette },
            { id: "footer", label: `Footer Links (${footerLinks.length})`, icon: LinkIcon }
          ] satisfies { id: typeof activeTab; label: string; icon: typeof Globe }[]
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-(--color-accent) text-white"
                  : "text-normal hover:text-highlight"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: General */}
      {activeTab === "general" && (
        <Card className="p-6 space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-highlight">Website Identity</h3>

          <div>
            <label className="text-xs font-semibold text-highlight">Site Title / Brand Name *</label>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="e.g. Shawon | Senior Backend Engineer"
              className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
            />
          </div>
        </Card>
      )}

      {/* Tab 2: SEO */}
      {activeTab === "seo" && (
        <Card className="p-6 space-y-5 max-w-2xl">
          <h3 className="text-base font-bold text-highlight">Search Engine Optimization</h3>

          <div>
            <label className="text-xs font-semibold text-highlight">SEO Title Template</label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="AL Shahariar Arafat Shawon | Senior Backend & Distributed Systems Engineer"
              className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-highlight">Meta Description</label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Concise overview of engineering expertise, technologies, and career focus for search engines..."
              className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-highlight">SEO Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={seoKeywordsInput}
                onChange={(e) => setSeoKeywordsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="Add keyword (e.g. Backend Developer, Go, Redis, System Design)..."
                className="flex-1 rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
              />
              <Button
                type="button"
                onClick={handleAddKeyword}
                className="bg-(--color-accent) text-white rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {seoKeywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-site px-2.5 py-1 text-xs text-highlight"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-normal hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Branding */}
      {activeTab === "branding" && (
        <Card className="p-6 space-y-5 max-w-2xl">
          <h3 className="text-base font-bold text-highlight">Design Color Tokens</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-highlight">Primary Accent Color</label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-12 rounded-lg border border-site cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-highlight">Dark Background Color</label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-9 w-12 rounded-lg border border-site cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-highlight">Normal Text Muted Color</label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="color"
                  value={normalTextColor}
                  onChange={(e) => setNormalTextColor(e.target.value)}
                  className="h-9 w-12 rounded-lg border border-site cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={normalTextColor}
                  onChange={(e) => setNormalTextColor(e.target.value)}
                  className="flex-1 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-highlight">Highlighted Heading Color</label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="color"
                  value={highlightedTextColor}
                  onChange={(e) => setHighlightedTextColor(e.target.value)}
                  className="h-9 w-12 rounded-lg border border-site cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={highlightedTextColor}
                  onChange={(e) => setHighlightedTextColor(e.target.value)}
                  className="flex-1 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight font-mono"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Footer */}
      {activeTab === "footer" && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-highlight">Footer Navigation Links</span>
            <Button
              type="button"
              onClick={() => {
                setEditingFooterLink(null);
                setFooterLabel("");
                setFooterHref("");
                setIsFooterModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-(--color-accent) text-white rounded-xl px-3 py-1.5 text-xs font-semibold"
            >
              <Plus size={14} /> Add Footer Link
            </Button>
          </div>

          {footerLinks.length > 0 ? (
            <SortableList
              items={footerLinks}
              onReorder={handleReorderFooter}
              renderItem={(link) => (
                <Card className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-highlight">{link.label}</p>
                    <p className="text-[11px] text-normal font-mono">{link.href}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusToggle
                      isEnabled={link.isEnabled}
                      onToggle={(newState) => handleToggleFooterStatus(link, newState)}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setEditingFooterLink(link);
                        setFooterLabel(link.label);
                        setFooterHref(link.href);
                        setIsFooterModalOpen(true);
                      }}
                      className="rounded-xl border border-site p-1.5 text-normal hover:text-accent"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteFooterTargetId(link.id)}
                      className="rounded-xl border border-site p-1.5 text-normal hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              )}
            />
          ) : (
            <Card className="p-8 text-center text-normal">
              <p className="text-xs">No footer links configured yet.</p>
            </Card>
          )}
        </div>
      )}

      {/* Footer Link Modal */}
      {isFooterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-site bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-site pb-3">
              <h3 className="text-sm font-bold text-highlight">
                {editingFooterLink ? "Edit Footer Link" : "Add Footer Link"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFooterModalOpen(false)}
                className="text-normal hover:text-highlight"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFooterLink} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-highlight">Label *</label>
                <input
                  type="text"
                  required
                  value={footerLabel}
                  onChange={(e) => setFooterLabel(e.target.value)}
                  placeholder="e.g. GitHub"
                  className="mt-1 w-full rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">URL / Href *</label>
                <input
                  type="text"
                  required
                  value={footerHref}
                  onChange={(e) => setFooterHref(e.target.value)}
                  placeholder="e.g. https://github.com/shahariarshawon or #projects"
                  className="mt-1 w-full rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-site">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFooterModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createFooterMutation.isPending || updateFooterMutation.isPending}
                  className="bg-(--color-accent) text-white rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  Save Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Footer Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteFooterTargetId)}
        onClose={() => setDeleteFooterTargetId(null)}
        onConfirm={() => {
          if (deleteFooterTargetId) deleteFooterMutation.mutate(deleteFooterTargetId);
        }}
        title="Delete Footer Link"
        message="Are you sure you want to remove this footer link?"
      />
    </div>
  );
}
