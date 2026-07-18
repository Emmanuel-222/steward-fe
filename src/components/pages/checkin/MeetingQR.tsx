import { QRCodeSVG } from 'qrcode.react'
import { QrCode, RefreshCw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import useQrTokenQuery from '../../../features/checkin/hooks/useQrTokenQuery'
import type { Meeting } from '../../../features/meetings/types'

type MeetingQRProps = {
  meeting: Meeting
}

function MeetingQR({ meeting }: MeetingQRProps) {
  const [isOpen, setIsOpen] = useState(false)
  const qrQuery = useQrTokenQuery(meeting.id, isOpen)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (meeting.status !== 'Ongoing') return null

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_8px_25px_rgba(15,23,42,0.05)] transition hover:bg-slate-50"
      >
        <QrCode className="h-4 w-4" />
        QR Check-in
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          ref={modalRef}
        >
          <div
            className="relative flex w-full max-w-sm flex-col items-center rounded-3xl bg-white px-8 pb-10 pt-9 shadow-[0_40px_120px_rgba(15,23,42,0.2)] animate-modal-enter"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="QR check-in code"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-serif text-[20px] font-semibold text-brand">
              {meeting.title}
            </h2>

            <div className="mt-6 flex flex-col items-center gap-3">
              {qrQuery.isLoading ? (
                <div className="flex h-64 w-64 items-center justify-center rounded-2xl bg-slate-50">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
                </div>
              ) : qrQuery.data ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                  <QRCodeSVG
                    value={qrQuery.data.url}
                    level="H"
                    size={240}
                  />
                </div>
              ) : (
                <div className="flex h-64 w-64 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-400">
                  Failed to load
                </div>
              )}

              <button
                type="button"
                onClick={() => qrQuery.refetch()}
                disabled={qrQuery.isFetching}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${qrQuery.isFetching ? 'animate-spin' : ''}`}
                />
                Refresh Code
              </button>
            </div>

            <p className="mt-6 max-w-56 text-center text-[11px] leading-relaxed text-slate-400">
              Stewards scan this QR at the entrance to sign in with their email.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default MeetingQR
