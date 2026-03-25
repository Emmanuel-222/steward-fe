import { useState } from "react";
import { ChevronDown, Eye, EyeClosed, Info, X } from "lucide-react";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
};

function AddUserModal({ open, onClose }: AddUserModalProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-3 py-4 backdrop-blur-[2px] sm:px-4 sm:py-6"
      onClick={onClose}
    >
      <div
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:max-h-[calc(100vh-3rem)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="add-user-title"
              className="text-xl font-semibold text-[#0f2d52]"
            >
              Add New User
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Enrol a new member into the digital registry.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close add user dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          noValidate
          className="mt-5 space-y-4 sm:mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            onClose();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Full Name
              </span>
              <input
                type="text"
                placeholder="e.g. Julian Pierce"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Email Address
              </span>
              <input
                type="email"
                placeholder="name@steward.org"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Phone Number
              </span>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Security Password
              </span>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Create a secure password"
                  className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                >
                  {isPasswordVisible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeClosed className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Department
              </span>
              <div className="relative">
                <select className="h-11 w-full appearance-none rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]">
                  <option>Select Department</option>
                  <option>Hospitality</option>
                  <option>Logistics</option>
                  <option>Ushering</option>
                  <option>Pastoral Care</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                System Role
              </span>
              <div className="relative">
                <select className="h-11 w-full appearance-none rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]">
                  <option>Assign Role</option>
                  <option>Steward</option>
                  <option>Leader</option>
                  <option>Pastor</option>
                  <option>Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </label>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-[#f3f7fd] px-4 py-3 text-xs leading-5 text-slate-500">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5d74a2]" />
            <p>
              Newly added users will receive an automated invitation email to
              verify their identity and finalize their secure access profile.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#0f2d52] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173c67] sm:w-auto"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;
