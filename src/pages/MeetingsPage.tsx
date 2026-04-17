import { CalendarDays, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import MeetingCard from "../components/pages/meetings/MeetingCard";
import MeetingScheduleCard from "../components/pages/meetings/MeetingScheduleCard";
import MeetingsTabs from "../components/pages/meetings/MeetingsTabs";
import ScheduleMeetingModal from "../components/pages/meetings/ScheduleMeetingModal";
import DashboardPageHeader from "../components/shared/DashboardPageHeader";
import FloatingActionButton from "../components/shared/FloatingActionButton";
import useCreateMeetingMutation from "../features/meetings/hooks/useCreateMeetingMutation";
import useDeleteMeetingMutation from "../features/meetings/hooks/useDeleteMeetingMutation";
import useMeetingsQuery from "../features/meetings/hooks/useMeetingsQuery";
import useUpdateMeetingMutation from "../features/meetings/hooks/useUpdateMeetingMutation";
import type {
  CreateMeetingValues,
  Meeting,
  UpdateMeetingValues,
} from "../features/meetings/types";

const tabs = ["All Meetings", "Upcoming", "Ongoing", "Completed", "Archived"];

function MeetingsPage() {
  const [activeTab, setActiveTab] = useState("All Meetings");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [deletingMeeting, setDeletingMeeting] = useState<Meeting | null>(null);
  const meetingsQuery = useMeetingsQuery();
  const createMeetingMutation = useCreateMeetingMutation();
  const updateMeetingMutation = useUpdateMeetingMutation();
  const deleteMeetingMutation = useDeleteMeetingMutation();
  const meetings = meetingsQuery.data ?? [];
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
    await createMeetingMutation.mutateAsync(values);
  };

  const handleUpdateMeeting = async (values: UpdateMeetingValues) => {
    if (!editingMeeting) {
      return;
    }

    await updateMeetingMutation.mutateAsync({
      id: editingMeeting.id,
      payload: values,
    });
  };

  const handleDeleteMeeting = async () => {
    if (!deletingMeeting) {
      return;
    }

    await deleteMeetingMutation.mutateAsync(deletingMeeting.id);
    setDeletingMeeting(null);
  };

  return (
    <>
      <div className="space-y-8">
        <DashboardPageHeader
          eyebrow="Overview"
          title="Manage Ledger Sessions"
          actions={
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f2d52] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-[#173c67]"
            >
              <Plus className="h-4 w-4" />
              Create Meeting
            </button>
          }
        />

        <section className="space-y-4">
          <MeetingsTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {meetingsQuery.isLoading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              Loading meetings...
            </div>
          ) : meetingsQuery.isError ? (
            <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              Unable to load meetings right now.
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="grid gap-5 xl:grid-cols-3">
              <div className="xl:col-span-2 rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <p className="text-lg font-semibold text-[#0f2d52]">
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
                  />
                ))}
                <MeetingScheduleCard
                  onClick={() => setIsScheduleModalOpen(true)}
                />
              </div>
            </>
          )}
        </section>

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
