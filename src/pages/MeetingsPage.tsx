import { CalendarDays, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MeetingCard from "../components/pages/meetings/MeetingCard";
import MeetingScheduleCard from "../components/pages/meetings/MeetingScheduleCard";
import MeetingsTabs from "../components/pages/meetings/MeetingsTabs";
import Pagination from "../components/ui/Pagination";
import ScheduleMeetingModal from "../components/pages/meetings/ScheduleMeetingModal";
import DashboardPageHeader from "../components/shared/DashboardPageHeader";
import FloatingActionButton from "../components/shared/FloatingActionButton";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import useCreateMeetingMutation from "../features/meetings/hooks/useCreateMeetingMutation";
import useDeleteMeetingMutation from "../features/meetings/hooks/useDeleteMeetingMutation";
import useMeetingsQuery from "../features/meetings/hooks/useMeetingsQuery";
import useUpdateMeetingMutation from "../features/meetings/hooks/useUpdateMeetingMutation";
import useAuth from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import type { PaginationData } from "../types";
import type {
  CreateMeetingValues,
  Meeting,
  UpdateMeetingValues,
} from "../features/meetings/types";

const DEFAULT_PAGE_SIZE = 10;
const tabs = ["All Meetings", "Upcoming", "Ongoing", "Completed", "Archived"];

function MeetingsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("All Meetings");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [deletingMeeting, setDeletingMeeting] = useState<Meeting | null>(null);
  const meetingsQuery = useMeetingsQuery(page, pageSize);
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const resetPage = useCallback(() => setPage(1), []);

  const createMeetingMutation = useCreateMeetingMutation();
  const updateMeetingMutation = useUpdateMeetingMutation();
  const deleteMeetingMutation = useDeleteMeetingMutation();

  const meetingsQueryData = meetingsQuery.data;
  const meetings = (Array.isArray(meetingsQueryData)
    ? meetingsQueryData
    : (meetingsQueryData as { items?: Meeting[] } | null)?.items ?? []
  ).sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime(),
  );
  const pagination = !Array.isArray(meetingsQueryData)
    ? (meetingsQueryData as { pagination?: PaginationData } | null)?.pagination ?? null
    : null;

  const filteredMeetings =
    activeTab === "All Meetings"
      ? meetings
      : meetings.filter(
          (meeting) => meeting.status === activeTab.replace("All ", ""),
        );

  useEffect(() => {
    if (!isScheduleModalOpen && !deletingMeeting) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsScheduleModalOpen(false);
        setEditingMeeting(null);
        setDeletingMeeting(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deletingMeeting, isScheduleModalOpen]);

  const handleCreateMeeting = async (values: CreateMeetingValues) => {
    try {
      await createMeetingMutation.mutateAsync(values);
      showToast("Meeting scheduled successfully", "success");
      setIsScheduleModalOpen(false);
      meetingsQuery.refetch();
    } catch {
      showToast("Failed to schedule meeting", "error");
    }
  };

  const handleUpdateMeeting = async (values: UpdateMeetingValues) => {
    if (!editingMeeting) return;

    try {
      await updateMeetingMutation.mutateAsync({
        id: editingMeeting.id,
        payload: values,
      });
      showToast("Meeting details updated", "success");
      setIsScheduleModalOpen(false);
      setEditingMeeting(null);
      meetingsQuery.refetch();
    } catch {
      showToast("Failed to update meeting", "error");
    }
  };

  const handleDeleteMeeting = async () => {
    if (!deletingMeeting) return;

    try {
      await deleteMeetingMutation.mutateAsync(deletingMeeting.id);
      showToast("Meeting session deleted", "success");
      setDeletingMeeting(null);
      meetingsQuery.refetch();
    } catch {
      showToast("Failed to delete meeting", "error");
    }
  };
  const handleAction = (meeting: Meeting) => {
    navigate(`/dashboard/attendance/${meeting.id}`);
  };
  return (
    <>
      <div className="space-y-8">
        <DashboardPageHeader
          eyebrow="Overview"
          title="Manage Ledger Sessions"
          actions={
            isAdmin && (
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-brand-hover"
              >
                <Plus className="h-4 w-4" />
                Create Meeting
              </button>
            )
          }
        />

        <section className="space-y-4">
          <MeetingsTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tab) => { setActiveTab(tab); resetPage() }}
          />

          {meetingsQuery.isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-card border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                  <Skeleton className="mb-3 h-4 w-20" />
                  <Skeleton className="mb-2 h-6 w-40" />
                  <Skeleton className="mb-4 h-3 w-32" />
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : meetingsQuery.isError ? (
            <ErrorState
              message="Unable to load meetings right now."
              onRetry={() => meetingsQuery.refetch()}
            />
          ) : filteredMeetings.length === 0 ? (
            <div className="grid gap-5 xl:grid-cols-3">
              <div className="xl:col-span-2 rounded-card border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <p className="text-lg font-semibold text-brand">
                  No meetings found for {activeTab.toLowerCase()}.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Create your first meeting to start tracking attendance.
                </p>
              </div>
              <MeetingScheduleCard
                onClick={() => setIsScheduleModalOpen(true)}
              />
            </div>
          ) : (
            <>
              <div className="grid gap-5 xl:grid-cols-3">
                {filteredMeetings.slice(0, 3).map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onEdit={(selectedMeeting) => {
                      setEditingMeeting(selectedMeeting);
                      setIsScheduleModalOpen(true);
                    }}
                    onDelete={setDeletingMeeting}
                    onAction={handleAction}
                  />
                ))}
              </div>

              <div className="grid gap-5 xl:grid-cols-3">
                {filteredMeetings.slice(3).map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onEdit={(selectedMeeting) => {
                      setEditingMeeting(selectedMeeting);
                      setIsScheduleModalOpen(true);
                    }}
                    onDelete={setDeletingMeeting}
                    onAction={handleAction}
                  />
                ))}
                <MeetingScheduleCard
                  onClick={() => setIsScheduleModalOpen(true)}
                />
              </div>
            </>
          )}
        </section>

        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
          />
        )}

        <FloatingActionButton
          icon={CalendarDays}
          label="Schedule meeting"
          onClick={() => setIsScheduleModalOpen(true)}
        />
      </div>

      {editingMeeting ? (
        <ScheduleMeetingModal
          open={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setEditingMeeting(null);
          }}
          onSubmit={handleUpdateMeeting}
          isSubmitting={updateMeetingMutation.isPending}
          mode="edit"
          meeting={editingMeeting}
        />
      ) : (
        <ScheduleMeetingModal
          open={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setEditingMeeting(null);
          }}
          onSubmit={handleCreateMeeting}
          isSubmitting={createMeetingMutation.isPending}
          mode="create"
          meeting={null}
        />
      )}

      {deletingMeeting ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-[2px]"
          onClick={() => setDeletingMeeting(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 text-center shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-meeting-title"
          >
            <h3
              id="delete-meeting-title"
              className="text-2xl font-semibold text-slate-900"
            >
              Delete Meeting
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {deletingMeeting.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDeletingMeeting(null)}
                className="rounded-xl bg-[#eef3ff] px-4 py-3 text-sm font-semibold text-[#4f6b9a] transition hover:bg-[#e4ebfb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMeeting}
                disabled={deleteMeetingMutation.isPending}
                className="rounded-xl bg-[#d92d20] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b42318] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleteMeetingMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MeetingsPage;


