"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  ExternalLink,
  FileCheck,
  Loader2,
  X,
  Save
} from "lucide-react";
import {
  getAdminCertifications,
  createAdminCertification,
  updateAdminCertification,
  deleteAdminCertification,
  reorderAdminCertifications
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
import { TCertification } from "@/types/portfolio";

export function CertificationManager() {
  const queryClient = useQueryClient();

  const { data: certifications = [], isLoading } = useQuery({
    queryKey: ["admin-certifications"],
    queryFn: getAdminCertifications
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");
  const [sortBy, setSortBy] = useState("order");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<TCertification | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialLink, setCredentialLink] = useState("");
  const [certificateFileUrl, setCertificateFileUrl] = useState("");

  const resetForm = () => {
    setEditingCert(null);
    setName("");
    setIssuingOrganization("");
    setIssueDate("");
    setCredentialId("");
    setCredentialLink("");
    setCertificateFileUrl("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (cert: TCertification) => {
    setEditingCert(cert);
    setName(cert.name || cert.title || "");
    setIssuingOrganization(cert.issuingOrganization || cert.issuer || "");
    setIssueDate(cert.issueDate || "");
    setCredentialId(cert.credentialId || "");
    setCredentialLink(cert.credentialLink || cert.credentialUrl || "");
    setCertificateFileUrl(cert.certificateFileUrl || cert.imageUrl || "");
    setIsModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: createAdminCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TCertification> }) =>
      updateAdminCertification(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      setDeleteTargetId(null);
    }
  });

  const reorderMutation = useMutation({
    mutationFn: reorderAdminCertifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuingOrganization.trim()) return;

    const payload: Partial<TCertification> = {
      name: name.trim(),
      title: name.trim(),
      issuingOrganization: issuingOrganization.trim(),
      issuer: issuingOrganization.trim(),
      issueDate: issueDate.trim() || null,
      credentialId: credentialId.trim() || null,
      credentialLink: credentialLink.trim() || null,
      credentialUrl: credentialLink.trim() || null,
      certificateFileUrl: certificateFileUrl.trim() || null,
      imageUrl: certificateFileUrl.trim() || null,
      order: editingCert ? editingCert.order : certifications.length + 1
    };

    if (editingCert) {
      updateMutation.mutate({ id: editingCert.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleToggleStatus = async (cert: TCertification, newState: boolean) => {
    await updateAdminCertification(cert.id, { isEnabled: newState });
    queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
  };

  const handleReorder = (newItems: TCertification[]) => {
    queryClient.setQueryData(["admin-certifications"], newItems);
    reorderMutation.mutate(newItems.map((item, idx) => ({ id: item.id, order: idx + 1 })));
  };

  const filteredCertifications = useMemo(() => {
    return certifications
      .filter((cert) => {
        const titleMatch = (cert.name || cert.title || "").toLowerCase().includes(searchQuery.toLowerCase());
        const orgMatch = (cert.issuingOrganization || cert.issuer || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSearch = titleMatch || orgMatch;

        const matchesStatus =
          statusFilter === "ALL"
            ? true
            : statusFilter === "ENABLED"
            ? cert.isEnabled
            : !cert.isEnabled;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
        return a.order - b.order;
      });
  }, [certifications, searchQuery, statusFilter, sortBy]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content Management"
        title="Certification Manager"
        description="Showcase professional vendor certificates, cloud credentials (AWS, GCP), and specialized licenses."
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
          { label: "Certification Name", value: "name" }
        ]}
        onAddNew={openCreateModal}
        addNewLabel="Add Certification"
        totalCount={certifications.length}
        filteredCount={filteredCertifications.length}
        placeholder="Search certifications or issuers..."
      />

      {filteredCertifications.length > 0 ? (
        <SortableList
          items={filteredCertifications}
          onReorder={handleReorder}
          renderItem={(cert) => {
            const certName = cert.name || cert.title;
            const certIssuer = cert.issuingOrganization || cert.issuer;
            const certBadge = cert.certificateFileUrl || cert.imageUrl;

            return (
              <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-(--color-accent)/40 transition">
                <div className="flex items-start gap-4">
                  {certBadge ? (
                    <img
                      src={certBadge}
                      alt={certName || "Certification"}
                      className="h-12 w-12 rounded-xl object-contain border border-site p-1 bg-card shrink-0"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-accent)/10 text-accent shrink-0">
                      <Award size={22} />
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-highlight">{certName}</h3>
                    <p className="text-sm font-semibold text-accent">{certIssuer}</p>

                    <div className="flex items-center gap-3 text-xs text-normal flex-wrap">
                      {cert.issueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> {cert.issueDate}
                        </span>
                      )}
                      {cert.credentialId && (
                        <span className="font-mono text-[11px] bg-white/5 border border-site px-2 py-0.5 rounded">
                          ID: {cert.credentialId}
                        </span>
                      )}
                      {(cert.credentialLink || cert.credentialUrl) && (
                        <a
                          href={cert.credentialLink || cert.credentialUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-accent hover:underline"
                        >
                          <ExternalLink size={12} /> Verify Credential
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <StatusToggle
                    isEnabled={cert.isEnabled}
                    onToggle={(newState) => handleToggleStatus(cert, newState)}
                  />

                  <button
                    type="button"
                    onClick={() => openEditModal(cert)}
                    className="rounded-xl border border-site p-2 text-normal hover:border-(--color-accent) hover:text-accent transition"
                    title="Edit certification"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(cert.id)}
                    className="rounded-xl border border-site p-2 text-normal hover:border-red-500 hover:text-red-400 transition"
                    title="Delete certification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            );
          }}
        />
      ) : (
        <Card className="p-12 text-center text-normal">
          <Award size={40} className="mx-auto mb-3 text-normal/50" />
          <p className="font-semibold text-highlight">No certifications found</p>
          <p className="text-xs text-normal mt-1">
            {searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your search criteria."
              : "Click 'Add Certification' to display your professional badges and credentials."}
          </p>
        </Card>
      )}

      {/* Certification Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-site bg-card p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-site pb-3">
              <h3 className="text-base font-bold text-highlight">
                {editingCert ? "Edit Certification" : "Add Certification"}
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
                <label className="text-xs font-semibold text-highlight">Certification Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect - Associate"
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  value={issuingOrganization}
                  onChange={(e) => setIssuingOrganization(e.target.value)}
                  placeholder="e.g. Amazon Web Services (AWS)"
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-highlight">Issue Date</label>
                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="e.g. Nov 2024"
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-highlight">Credential ID</label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. AWS-ASA-849204"
                    className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-highlight">Verification URL / Credential Link</label>
                <input
                  type="url"
                  value={credentialLink}
                  onChange={(e) => setCredentialLink(e.target.value)}
                  placeholder="https://www.credly.com/badges/..."
                  className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                />
              </div>

              <MediaUploader
                value={certificateFileUrl}
                onChange={setCertificateFileUrl}
                folder="certificates"
                label="Certificate Badge / Image"
                description="Upload badge logo or certificate image (PNG, WebP)"
              />

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
                  {editingCert ? "Update Certification" : "Add Certification"}
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
        title="Delete Certification"
        message="Are you sure you want to permanently delete this credential from your portfolio?"
      />
    </div>
  );
}
