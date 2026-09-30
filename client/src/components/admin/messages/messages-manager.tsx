"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  Trash2
} from "lucide-react";
import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  deleteAdminMessage,
  getAdminMessages,
  markAdminMessageAsRead,
  markAdminMessageAsUnread,
  TMessageStatusFilter
} from "@/lib/admin-api";
import { getErrorMessage } from "@/lib/get-error-message";
import { cn } from "@/lib/utils";

export function MessagesManager() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] =
    useState<TMessageStatusFilter>("ALL");

  const messagesQuery = useQuery({
    queryKey: ["admin-messages", statusFilter],
    queryFn: () => getAdminMessages(statusFilter)
  });

  const invalidateMessages = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin-messages"]
      }),
      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard-overview"]
      })
    ]);
  };

  const markReadMutation = useMutation({
    mutationFn: markAdminMessageAsRead,
    onSuccess: invalidateMessages
  });

  const markUnreadMutation = useMutation({
    mutationFn: markAdminMessageAsUnread,
    onSuccess: invalidateMessages
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminMessage,
    onSuccess: invalidateMessages
  });

  const isActionLoading =
    markReadMutation.isPending ||
    markUnreadMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Messages"
        title="Contact Message Manager"
        description="View contact form submissions, mark messages as read or unread, and delete old messages."
      />

      <Card className="p-5">
        <div className="flex flex-wrap gap-3">
          {(["ALL", "UNREAD", "READ"] as TMessageStatusFilter[]).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  statusFilter === status
                    ? "border-(--color-accent) bg-(--color-accent) text-white"
                    : "border-site text-normal hover:border-(--color-accent) hover:text-highlight"
                )}
              >
                {status}
              </button>
            )
          )}
        </div>
      </Card>

      {messagesQuery.isLoading ? <LoadingState /> : null}

      {messagesQuery.isError ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-highlight">
            Could not load messages
          </h2>
          <p className="mt-2 text-sm text-normal">
            {getErrorMessage(messagesQuery.error)}
          </p>
        </Card>
      ) : null}

      {markReadMutation.error ||
      markUnreadMutation.error ||
      deleteMutation.error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {getErrorMessage(
            markReadMutation.error ||
              markUnreadMutation.error ||
              deleteMutation.error
          )}
        </div>
      ) : null}

      {!messagesQuery.isLoading && messagesQuery.data?.length === 0 ? (
        <Card className="p-10 text-center">
          <Inbox className="mx-auto text-accent" size={42} />
          <h2 className="mt-4 text-xl font-bold text-highlight">
            No messages found
          </h2>
          <p className="mt-2 text-sm text-normal">
            Contact messages will appear here after visitors submit the form.
          </p>
        </Card>
      ) : null}

      <div className="space-y-5">
        {messagesQuery.data?.map((message) => (
          <Card key={message.id} className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-highlight">
                    {message.name}
                  </h2>

                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      message.status === "UNREAD"
                        ? "bg-(--color-accent)/10 text-accent"
                        : "bg-white/5 text-normal"
                    )}
                  >
                    {message.status}
                  </span>
                </div>

                <a
                  href={`mailto:${message.email}`}
                  className="mt-2 inline-flex items-center gap-2 break-all text-sm text-normal hover:text-accent"
                >
                  <Mail size={16} />
                  {message.email}
                </a>

                {message.subject ? (
                  <p className="mt-4 text-sm font-semibold text-highlight">
                    Subject: {message.subject}
                  </p>
                ) : null}

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-normal">
                  {message.message}
                </p>

                <p className="mt-4 text-xs text-normal">
                  Received: {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                {message.status === "UNREAD" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isActionLoading}
                    onClick={() => markReadMutation.mutate(message.id)}
                  >
                    {markReadMutation.isPending ? (
                      <Loader2 className="mr-2 animate-spin" size={15} />
                    ) : (
                      <CheckCircle2 className="mr-2" size={15} />
                    )}
                    Mark Read
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isActionLoading}
                    onClick={() => markUnreadMutation.mutate(message.id)}
                  >
                    {markUnreadMutation.isPending ? (
                      <Loader2 className="mr-2 animate-spin" size={15} />
                    ) : (
                      <MailOpen className="mr-2" size={15} />
                    )}
                    Mark Unread
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isActionLoading}
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this message?"
                    );

                    if (confirmed) {
                      deleteMutation.mutate(message.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="mr-2 animate-spin" size={15} />
                  ) : (
                    <Trash2 className="mr-2" size={15} />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}