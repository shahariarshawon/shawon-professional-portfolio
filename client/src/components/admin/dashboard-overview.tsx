"use client";

import {
  BriefcaseBusiness,
  FileText,
  Inbox,
  Layers3,
  MessageSquareText,
  Sparkles,
  Wrench
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
        title="Portfolio Admin Overview"
        description="Monitor portfolio content, messages, projects, resume status, and editable site sections from one place."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard
          title="Projects"
          value={totals.projects}
          icon={Wrench}
          description="Total portfolio projects"
        />

        <AdminStatCard
          title="Skills"
          value={totals.skills}
          icon={Sparkles}
          description="Total technical skills"
        />

        <AdminStatCard
          title="Messages"
          value={totals.messages}
          icon={MessageSquareText}
          description="Total contact messages"
        />

        <AdminStatCard
          title="Unread Messages"
          value={totals.unreadMessages}
          icon={Inbox}
          description="Messages needing attention"
        />

        <AdminStatCard
          title="Experience"
          value={totals.experiences}
          icon={BriefcaseBusiness}
          description="Work experience records"
        />

        <AdminStatCard
          title="Services"
          value={totals.services}
          icon={Layers3}
          description="Service items"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
              <FileText size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-highlight">
                Resume Status
              </h2>

              {data.resumeStatus ? (
                <div className="mt-4 space-y-2 text-sm text-normal">
                  <p>
                    <span className="font-semibold text-highlight">
                      Title:
                    </span>{" "}
                    {data.resumeStatus.title}
                  </p>
                  <p>
                    <span className="font-semibold text-highlight">
                      Target:
                    </span>{" "}
                    {data.resumeStatus.targetRole}
                  </p>
                  <p>
                    <span className="font-semibold text-highlight">
                      Updated:
                    </span>{" "}
                    {new Date(data.resumeStatus.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-normal">
                  No active resume found.
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-highlight">Recent Messages</h2>

          <div className="mt-5 space-y-4">
            {data.recentMessages.length ? (
              data.recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-2xl border border-site bg-(--color-background)/40 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-highlight">
                        {message.name}
                      </p>
                      <p className="text-xs text-normal">{message.email}</p>
                    </div>

                    <span className="rounded-full bg-(--color-accent)/10 px-3 py-1 text-xs font-semibold text-accent">
                      {message.status}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-normal">
                    {message.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-normal">No recent messages yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}