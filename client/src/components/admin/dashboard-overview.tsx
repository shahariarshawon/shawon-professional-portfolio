"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  FileText,
  Inbox,
  Layers3,
  MessageSquareText,
  Sparkles,
  Wrench,
  Award,
  Users,
  Eye,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { LoadingState } from "@/components/shared/loading-state";
import { Card } from "@/components/ui/card";
import { getDashboardOverview } from "@/lib/admin-api";
import { useQuery } from "@tanstack/react-query";

export function DashboardOverview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: getDashboardOverview
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-bold text-highlight">
          Could not load dashboard
        </h2>
        <p className="mt-2 text-sm text-normal">
          Make sure the backend server is running and you are logged in.
        </p>
      </Card>
    );
  }

  const totals = data.totals;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Portfolio Platform Overview"
        description="Monitor portfolio traffic, content modules, recruiter messages, and real-time activity."
      />

      {/* Analytics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Projects"
          value={totals.projects}
          icon={Wrench}
          description="Total showcase case studies"
        />

        <AdminStatCard
          title="Total Visitors"
          value={totals.visitors || 0}
          icon={Users}
          description="Unique visitor sessions"
        />

        <AdminStatCard
          title="Page Views"
          value={totals.pageViews || 0}
          icon={Eye}
          description="Total site interactions"
        />

        <AdminStatCard
          title="Unread Messages"
          value={totals.unreadMessages}
          icon={Inbox}
          description="Recruiter & client inboxes"
        />

        <AdminStatCard
          title="Work Experience"
          value={totals.experiences}
          icon={BriefcaseBusiness}
          description="Career milestones"
        />

        <AdminStatCard
          title="Technical Skills"
          value={totals.skills}
          icon={Sparkles}
          description="Skills & technologies"
        />

        <AdminStatCard
          title="Certifications"
          value={totals.certifications || 0}
          icon={Award}
          description="Verified credentials"
        />

        <AdminStatCard
          title="Services"
          value={totals.services}
          icon={Layers3}
          description="Client offerings"
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-highlight flex items-center gap-2">
          <Activity size={16} className="text-accent" /> Quick Management Hub
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Hero Intro", href: "/admin/hero", desc: "Tagline, bio, resume download" },
            { label: "About Section", href: "/admin/about", desc: "Story, tech focus, quick facts" },
            { label: "Project CMS", href: "/admin/projects", desc: "Add case studies, diagrams" },
            { label: "Experience", href: "/admin/experience", desc: "Job history & metrics" },
            { label: "Skills & Stack", href: "/admin/skills", desc: "Categories & proficiencies" },
            { label: "Certifications", href: "/admin/certifications", desc: "Badges & credentials" },
            { label: "Services", href: "/admin/services", desc: "Engineering consulting" },
            { label: "SEO & Settings", href: "/admin/settings", desc: "Theme tokens & footer links" }
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between rounded-2xl border border-site bg-card p-4 hover:border-(--color-accent)/40 hover:bg-(--color-accent)/5 transition group"
            >
              <div>
                <p className="text-xs font-bold text-highlight group-hover:text-accent transition">
                  {action.label}
                </p>
                <p className="text-[11px] text-normal mt-0.5">{action.desc}</p>
              </div>
              <ArrowRight size={14} className="text-normal group-hover:translate-x-1 group-hover:text-accent transition shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-site pb-3">
            <h2 className="text-base font-bold text-highlight flex items-center gap-2">
              <MessageSquareText size={18} className="text-accent" />
              Recent Inquiries
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              View All ({totals.messages})
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentMessages && data.recentMessages.length > 0 ? (
              data.recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-2xl border border-site bg-(--color-background)/40 p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-highlight text-xs">{message.name}</p>
                      <p className="text-[11px] text-normal">{message.email}</p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        message.status === "NEW" || message.status === "UNREAD"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {message.status}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-xs text-normal leading-5">
                    {message.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-normal text-center py-6">No recent messages yet.</p>
            )}
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-site pb-3">
            <h2 className="text-base font-bold text-highlight flex items-center gap-2">
              <Clock size={18} className="text-accent" />
              Recent Activity Timeline
            </h2>
            <span className="text-xs text-normal">Audit Log</span>
          </div>

          <div className="space-y-3">
            {data.recentActivities && data.recentActivities.length > 0 ? (
              data.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 rounded-xl border border-site bg-(--color-background)/30 p-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--color-accent)/10 text-accent shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-highlight">
                        {act.action} {act.entity}
                      </span>
                      <span className="text-[10px] text-normal whitespace-nowrap">
                        {new Date(act.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    {act.details && (
                      <p className="text-[11px] text-normal truncate mt-0.5">{act.details}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-normal text-center py-6">No admin actions recorded yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Featured Projects Highlight */}
      {data.popularProjects && data.popularProjects.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-site pb-3">
            <h2 className="text-base font-bold text-highlight flex items-center gap-2">
              <Wrench size={18} className="text-accent" />
              Featured Showcase Projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              Manage Projects <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.popularProjects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl border border-site bg-(--color-background)/40 p-3.5 space-y-2 flex flex-col justify-between"
              >
                <div>
                  {proj.images?.[0]?.url && (
                    <img
                      src={proj.images[0].url}
                      alt={proj.name}
                      className="h-24 w-full object-cover rounded-xl border border-site mb-2"
                    />
                  )}
                  <h4 className="text-xs font-bold text-highlight truncate">{proj.name}</h4>
                  <p className="text-[11px] text-normal line-clamp-2 mt-0.5">
                    {proj.shortDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-site">
                  <span className="text-[10px] font-mono text-accent">/{proj.slug}</span>
                  <a
                    href={`/projects/${proj.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-normal hover:text-highlight"
                    title="View case study"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}