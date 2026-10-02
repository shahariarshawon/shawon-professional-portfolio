"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Wrench,
  Plus,
  Trash2,
  Edit2,
  Star,
  Loader2,
  X,
  Save,
  Eye
} from "lucide-react";
import {
  getAdminProjects,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  reorderAdminProjects,
  type TProjectPayload
} from "@/lib/admin-api";

type TProjectTab = "general" | "links" | "media" | "casestudy" | "features";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SearchFilterBar } from "@/components/admin/cms/search-filter-bar";
import { SortableList } from "@/components/admin/cms/sortable-list";
import { StatusToggle } from "@/components/admin/cms/status-toggle";
import { ConfirmDialog } from "@/components/admin/cms/confirm-dialog";
import { MediaUploader } from "@/components/admin/cms/media-uploader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import {
  TProject,
  TProjectImage
} from "@/types/portfolio";
import { SafeImage } from "@/components/ui/safe-image";

export function ProjectsManager() {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: getAdminProjects
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ENABLED" | "DISABLED">("ALL");
  const [sortBy, setSortBy] = useState("order");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TProjectTab>("general");
  const [editingProject, setEditingProject] = useState<TProject | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [techStackInput, setTechStackInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);

  // Links
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [clientGithubLink, setClientGithubLink] = useState("");
  const [backendGithubLink, setBackendGithubLink] = useState("");
  const [demoCredentials, setDemoCredentials] = useState("");

  // Case study
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState("");
  const [architectureDiagram, setArchitectureDiagram] = useState("");

  // Relational items
  const [images, setImages] = useState<TProjectImage[]>([]);
  const [features, setFeatures] = useState<{ title?: string; text: string; type?: string }[]>([]);
  const [challenges, setChallenges] = useState<{ challenge: string; solution?: string }[]>([]);
  const [resultsList, setResultsList] = useState<{ metric: string; label: string; description?: string }[]>([]);

  // New item draft inputs
  const [newImageDraft, setNewImageDraft] = useState({ url: "", altText: "" });
  const [newFeatureDraft, setNewFeatureDraft] = useState({ title: "", text: "", type: "backend" });
  const [newChallengeDraft, setNewChallengeDraft] = useState({ challenge: "", solution: "" });
  const [newResultDraft, setNewResultDraft] = useState({ metric: "", label: "", description: "" });

  const resetForm = () => {
    setEditingProject(null);
    setName("");
    setSlug("");
    setShortDescription("");
    setFullDescription("");
    setPurpose("");
    setTargetUsers("");
    setIsFeatured(false);
    setTechStack([]);
    setTechStackInput("");
    setLiveLink("");
    setGithubLink("");
    setClientGithubLink("");
    setBackendGithubLink("");
    setDemoCredentials("");
    setProblem("");
    setSolution("");
    setResults("");
    setArchitectureDiagram("");
    setImages([]);
    setFeatures([]);
    setChallenges([]);
    setResultsList([]);
    setActiveTab("general");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (proj: TProject) => {
    setEditingProject(proj);
    setName(proj.name || "");
    setSlug(proj.slug || "");
    setShortDescription(proj.shortDescription || "");
    setFullDescription(proj.fullDescription || "");
    setPurpose(proj.purpose || "");
    setTargetUsers(proj.targetUsers || "");
    setIsFeatured(proj.isFeatured || false);
    setTechStack(proj.techStack || []);
    setLiveLink(proj.liveLink || "");
    setGithubLink(proj.githubLink || "");
    setClientGithubLink(proj.clientGithubLink || "");
    setBackendGithubLink(proj.backendGithubLink || "");
    setDemoCredentials(proj.demoCredentials || "");
    setProblem(proj.problem || "");
    setSolution(proj.solution || "");
    setResults(proj.results || "");
    setArchitectureDiagram(proj.architectureDiagram || "");
    setImages(proj.images || []);
    setFeatures((proj.features || []).map((f) => ({ title: f.title || "", text: f.text, type: f.type || "general" })));
    setChallenges((proj.challenges || []).map((c) => ({ challenge: c.challenge, solution: c.solution || "" })));
    setResultsList((proj.resultsList || []).map((r) => ({ metric: r.metric, label: r.label, description: r.description || "" })));
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: createAdminProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TProjectPayload }) =>
      updateAdminProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setDeleteTargetId(null);
    }
  });

  const reorderMutation = useMutation({
    mutationFn: reorderAdminProjects,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    }
  });

  const handleAddTechTag = () => {
    if (techStackInput.trim()) {
      const tags = techStackInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && !techStack.includes(t));
      setTechStack([...techStack, ...tags]);
      setTechStackInput("");
    }
  };

  const handleRemoveTechTag = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: TProjectPayload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim() || null,
      purpose: purpose.trim() || null,
      targetUsers: targetUsers.trim() || null,
      isFeatured,
      techStack,
      liveLink: liveLink.trim() || null,
      githubLink: githubLink.trim() || null,
      clientGithubLink: clientGithubLink.trim() || null,
      backendGithubLink: backendGithubLink.trim() || null,
      demoCredentials: demoCredentials.trim() || null,
      problem: problem.trim() || null,
      solution: solution.trim() || null,
      results: results.trim() || null,
      architectureDiagram: architectureDiagram.trim() || null,
      images: images.map((img, i) => ({
        url: img.url,
        altText: img.altText || name,
        fileType: "IMAGE",
        order: i + 1
      })),
      features: features.map((f, i) => ({
        title: f.title || null,
        text: f.text,
        type: f.type || "general",
        order: i + 1
      })),
      challenges: challenges.map((c, i) => ({
        challenge: c.challenge,
        solution: c.solution || null,
        order: i + 1
      })),
      resultsList: resultsList.map((r, i) => ({
        metric: r.metric,
        label: r.label,
        description: r.description || null,
        order: i + 1
      }))
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleToggleStatus = async (proj: TProject, newState: boolean) => {
    await updateAdminProject(proj.id, { isEnabled: newState });
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
  };

  const handleToggleFeatured = async (proj: TProject) => {
    await updateAdminProject(proj.id, { isFeatured: !proj.isFeatured });
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
  };

  const handleReorder = (newItems: TProject[]) => {
    queryClient.setQueryData(["admin-projects"], newItems);
    reorderMutation.mutate(newItems.map((item, idx) => ({ id: item.id, order: idx + 1 })));
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((proj) => {
        const matchesSearch =
          proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proj.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (proj.techStack && proj.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesStatus =
          statusFilter === "ALL"
            ? true
            : statusFilter === "ENABLED"
            ? proj.isEnabled
            : !proj.isEnabled;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        return a.order - b.order;
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content Management"
        title="Project Management CMS"
        description="Curate portfolio showcase projects with screenshots, case studies, architecture diagrams, and tech stacks."
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
          { label: "Project Name", value: "name" },
          { label: "Newest First", value: "newest" }
        ]}
        onAddNew={openCreateModal}
        addNewLabel="Add Project"
        totalCount={projects.length}
        filteredCount={filteredProjects.length}
        placeholder="Search projects or tech stacks..."
      />

      {filteredProjects.length > 0 ? (
        <SortableList
          items={filteredProjects}
          onReorder={handleReorder}
          renderItem={(proj) => {
            const thumbnail = proj.images?.[0]?.url;

            return (
              <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-(--color-accent)/40 transition">
                <div className="flex items-start gap-4">
                  {thumbnail ? (
                    <SafeImage
                      src={thumbnail}
                      alt={proj.name}
                      className="h-16 w-24 rounded-xl object-cover border border-site bg-card shrink-0"
                    />
                  ) : (
                    <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-(--color-accent)/10 text-accent shrink-0">
                      <Wrench size={22} />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-highlight">{proj.name}</h3>
                      {proj.isFeatured && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold">
                          <Star size={11} className="fill-amber-400" /> Featured
                        </span>
                      )}
                      <span className="text-xs text-normal font-mono">/{proj.slug}</span>
                    </div>

                    <p className="text-xs text-normal line-clamp-1">{proj.shortDescription}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(proj.techStack || []).slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-white/5 border border-site px-2 py-0.5 text-[10px] text-highlight"
                        >
                          {tech}
                        </span>
                      ))}
                      {(proj.techStack || []).length > 5 && (
                        <span className="text-[10px] text-normal">
                          +{proj.techStack.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(proj)}
                    className={`rounded-xl border p-2 transition ${
                      proj.isFeatured
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                        : "border-site text-normal hover:text-amber-400"
                    }`}
                    title="Toggle featured status"
                  >
                    <Star size={16} className={proj.isFeatured ? "fill-amber-400" : ""} />
                  </button>

                  <StatusToggle
                    isEnabled={proj.isEnabled}
                    onToggle={(newState) => handleToggleStatus(proj, newState)}
                  />

                  <a
                    href={`/projects/${proj.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-site p-2 text-normal hover:border-(--color-accent) hover:text-accent transition"
                    title="View public case study"
                  >
                    <Eye size={16} />
                  </a>

                  <button
                    type="button"
                    onClick={() => openEditModal(proj)}
                    className="rounded-xl border border-site p-2 text-normal hover:border-(--color-accent) hover:text-accent transition"
                    title="Edit project"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(proj.id)}
                    className="rounded-xl border border-site p-2 text-normal hover:border-red-500 hover:text-red-400 transition"
                    title="Delete project"
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
          <Wrench size={40} className="mx-auto mb-3 text-normal/50" />
          <p className="font-semibold text-highlight">No projects found</p>
          <p className="text-xs text-normal mt-1">
            {searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your search criteria."
              : "Click 'Add Project' to create your first portfolio case study."}
          </p>
        </Card>
      )}

      {/* Project Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl border border-site bg-card p-6 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-site pb-4">
              <div>
                <h3 className="text-lg font-bold text-highlight">
                  {editingProject ? `Edit: ${editingProject.name}` : "Create New Project"}
                </h3>
                <p className="text-xs text-normal">
                  Configure project metadata, screenshots, architecture, and case study results.
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

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-site pb-3 overflow-x-auto">
              {(
                [
                  { id: "general", label: "General & Story" },
                  { id: "links", label: "Links & Repos" },
                  { id: "media", label: `Media (${images.length})` },
                  { id: "casestudy", label: "Architecture & Results" },
                  { id: "features", label: `Features (${features.length})` }
                ] satisfies { id: TProjectTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "bg-(--color-accent) text-white"
                      : "text-normal hover:text-highlight"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* TAB 1: General Info */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-highlight">Project Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Distributed Task Queue Engine"
                        className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-highlight">
                        URL Slug (leave blank to auto-generate)
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g. distributed-task-queue"
                        className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-highlight">Short Pitch / Summary *</label>
                    <textarea
                      rows={2}
                      required
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="One or two sentences summarizing the project for cards and search..."
                      className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-highlight">Full Description</label>
                    <textarea
                      rows={4}
                      value={fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                      placeholder="Detailed breakdown of the project architecture, features, and capabilities..."
                      className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-highlight">Purpose / Mission</label>
                      <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="Why was this built? (e.g. High-concurrency job scheduling)"
                        className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-highlight">Target Audience</label>
                      <input
                        type="text"
                        value={targetUsers}
                        onChange={(e) => setTargetUsers(e.target.value)}
                        placeholder="e.g. Enterprise microservices, DevOps teams"
                        className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Tech Stack Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-highlight">Tech Stack Tags</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={techStackInput}
                        onChange={(e) => setTechStackInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTechTag();
                          }
                        }}
                        placeholder="Type technologies (comma-separated or press Enter)..."
                        className="flex-1 rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTechTag}
                        className="bg-(--color-accent) text-white rounded-xl px-4 py-2 text-xs font-semibold"
                      >
                        Add Tag
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {techStack.map((tech) => (
                        <span
                          key={tech}
                          className="flex items-center gap-1.5 rounded-lg bg-(--color-accent)/10 border border-(--color-accent)/30 px-2.5 py-1 text-xs font-medium text-accent"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTechTag(tech)}
                            className="text-accent/60 hover:text-accent"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-highlight cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="h-4 w-4 rounded accent-(--color-accent)"
                      />
                      Feature this project on portfolio homepage
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: Links & Access */}
              {activeTab === "links" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-highlight">Live Application Link</label>
                      <input
                        type="url"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                        placeholder="https://app.yourproject.com"
                        className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-highlight">Primary GitHub Link</label>
                      <input
                        type="url"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/user/repo"
                        className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-highlight">Frontend / Client GitHub Repo</label>
                      <input
                        type="url"
                        value={clientGithubLink}
                        onChange={(e) => setClientGithubLink(e.target.value)}
                        placeholder="https://github.com/user/frontend-repo"
                        className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-highlight">Backend / API GitHub Repo</label>
                      <input
                        type="url"
                        value={backendGithubLink}
                        onChange={(e) => setBackendGithubLink(e.target.value)}
                        placeholder="https://github.com/user/backend-repo"
                        className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-highlight">Demo Credentials / Test Logins</label>
                    <textarea
                      rows={2}
                      value={demoCredentials}
                      onChange={(e) => setDemoCredentials(e.target.value)}
                      placeholder="e.g. Email: demo@example.com / Password: Password123!"
                      className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: Screenshots & Media */}
              {activeTab === "media" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-site bg-(--color-background)/40 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-highlight">Add Screenshot / Image</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <MediaUploader
                        value={newImageDraft.url}
                        onChange={(url) => setNewImageDraft((prev) => ({ ...prev, url }))}
                        folder="projects"
                        label="Screenshot Upload"
                        description="App dashboard, architecture diagram, UI preview"
                      />
                      <div className="flex flex-col justify-end space-y-2">
                        <label className="text-xs font-semibold text-highlight">Alt Text / Caption</label>
                        <input
                          type="text"
                          value={newImageDraft.altText}
                          onChange={(e) => setNewImageDraft((prev) => ({ ...prev, altText: e.target.value }))}
                          placeholder="e.g. Analytics dashboard view with dark mode"
                          className="w-full rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                        />
                        <Button
                          type="button"
                          disabled={!newImageDraft.url}
                          onClick={() => {
                            if (newImageDraft.url) {
                              const imgItem: TProjectImage = {
                                id: `img-${Date.now()}`,
                                url: newImageDraft.url,
                                altText: newImageDraft.altText || name,
                                fileType: "IMAGE",
                                order: images.length + 1
                              };
                              setImages([...images, imgItem]);
                              setNewImageDraft({ url: "", altText: "" });
                            }
                          }}
                          className="bg-(--color-accent) text-white rounded-xl py-2 text-xs font-semibold"
                        >
                          <Plus size={14} className="mr-1" /> Add to Gallery
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image list */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-highlight">Project Gallery ({images.length})</label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {images.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          className="relative flex items-center gap-3 rounded-2xl border border-site bg-(--color-background)/40 p-2.5"
                        >
                          <SafeImage
                            src={img.url}
                            alt={img.altText || ""}
                            className="h-16 w-24 object-cover rounded-xl border border-site shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-highlight truncate">
                              {idx === 0 ? "★ Thumbnail (Cover)" : `Image #${idx + 1}`}
                            </p>
                            <p className="text-[11px] text-normal truncate">{img.altText || "No caption"}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            className="p-1.5 text-normal hover:text-red-400"
                            title="Remove image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Case Study & Architecture */}
              {activeTab === "casestudy" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-highlight">Problem Statement</label>
                    <textarea
                      rows={3}
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="What friction, latency, or business bottlenecks did this project address?"
                      className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-highlight">Engineering Solution</label>
                    <textarea
                      rows={3}
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="How did your software design resolve the bottlenecks? (e.g. Caching, Pub/Sub, sharding)"
                      className="mt-1.5 w-full rounded-xl border border-site bg-(--color-background)/60 p-2.5 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                    />
                  </div>

                  <div>
                    <MediaUploader
                      value={architectureDiagram}
                      onChange={setArchitectureDiagram}
                      folder="projects"
                      label="System Design / Architecture Diagram"
                      description="Upload visual flow or architecture schema"
                    />
                  </div>

                  {/* Quantitative Results */}
                  <div className="space-y-3 border-t border-site pt-3">
                    <label className="text-xs font-semibold text-highlight">Measurable Impact / Benchmarks</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newResultDraft.metric}
                        onChange={(e) => setNewResultDraft((prev) => ({ ...prev, metric: e.target.value }))}
                        placeholder="Metric (e.g. 99.99%)"
                        className="w-32 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newResultDraft.label}
                        onChange={(e) => setNewResultDraft((prev) => ({ ...prev, label: e.target.value }))}
                        placeholder="Label (e.g. Uptime Guaranteed)"
                        className="flex-1 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newResultDraft.metric && newResultDraft.label) {
                            setResultsList([...resultsList, { ...newResultDraft }]);
                            setNewResultDraft({ metric: "", label: "", description: "" });
                          }
                        }}
                        className="bg-(--color-accent) text-white rounded-xl px-3 py-2 text-xs font-semibold shrink-0"
                      >
                        <Plus size={14} /> Add Result
                      </Button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {resultsList.map((resItem, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl border border-site bg-(--color-background)/40 p-2.5 text-xs text-highlight"
                        >
                          <div>
                            <span className="font-bold text-accent mr-1.5">{resItem.metric}</span>
                            <span className="text-normal">{resItem.label}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setResultsList(resultsList.filter((_, i) => i !== idx))}
                            className="text-normal hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Features & Challenges */}
              {activeTab === "features" && (
                <div className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-highlight">Feature Highlights</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newFeatureDraft.title}
                        onChange={(e) => setNewFeatureDraft((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Title (e.g. Distributed Lock Manager)"
                        className="w-48 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newFeatureDraft.text}
                        onChange={(e) => setNewFeatureDraft((p) => ({ ...p, text: e.target.value }))}
                        placeholder="Description of the feature implementation..."
                        className="flex-1 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                      <select
                        value={newFeatureDraft.type}
                        onChange={(e) => setNewFeatureDraft((p) => ({ ...p, type: e.target.value }))}
                        className="w-28 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      >
                        <option value="backend">Backend</option>
                        <option value="frontend">Frontend</option>
                        <option value="database">Database</option>
                        <option value="devops">DevOps</option>
                      </select>
                      <Button
                        type="button"
                        onClick={() => {
                          if (newFeatureDraft.text) {
                            setFeatures([...features, { ...newFeatureDraft }]);
                            setNewFeatureDraft({ title: "", text: "", type: "backend" });
                          }
                        }}
                        className="bg-(--color-accent) text-white rounded-xl px-3 py-2 text-xs font-semibold shrink-0"
                      >
                        <Plus size={14} /> Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl border border-site bg-(--color-background)/40 p-2.5 text-xs text-highlight"
                        >
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-accent uppercase font-semibold">
                              {feat.type}
                            </span>
                            {feat.title && <span className="font-semibold text-highlight">{feat.title}:</span>}
                            <span className="text-normal">{feat.text}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                            className="text-normal hover:text-red-400 shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges & Solutions */}
                  <div className="space-y-3 border-t border-site pt-4">
                    <label className="text-xs font-semibold text-highlight">Engineering Challenges & Solutions</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newChallengeDraft.challenge}
                        onChange={(e) => setNewChallengeDraft((p) => ({ ...p, challenge: e.target.value }))}
                        placeholder="Challenge (e.g. Race conditions during atomic increments)"
                        className="flex-1 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newChallengeDraft.solution}
                        onChange={(e) => setNewChallengeDraft((p) => ({ ...p, solution: e.target.value }))}
                        placeholder="Solution (e.g. Leveraged Redis Lua scripts for atomic locks)"
                        className="flex-1 rounded-xl border border-site bg-(--color-background)/60 p-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newChallengeDraft.challenge) {
                            setChallenges([...challenges, { ...newChallengeDraft }]);
                            setNewChallengeDraft({ challenge: "", solution: "" });
                          }
                        }}
                        className="bg-(--color-accent) text-white rounded-xl px-3 py-2 text-xs font-semibold shrink-0"
                      >
                        <Plus size={14} /> Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {challenges.map((c, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between rounded-xl border border-site bg-(--color-background)/40 p-2.5 text-xs text-highlight"
                        >
                          <div>
                            <p className="font-semibold text-red-300">Challenge: {c.challenge}</p>
                            {c.solution && <p className="text-emerald-300 mt-0.5">Solution: {c.solution}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => setChallenges(challenges.filter((_, i) => i !== idx))}
                            className="text-normal hover:text-red-400 shrink-0 ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
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
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <Save size={14} className="mr-1.5" />
                  )}
                  {editingProject ? "Update Project" : "Create Project"}
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
        title="Delete Project"
        message="Are you sure you want to permanently delete this project case study? This cannot be undone."
      />
    </div>
  );
}
