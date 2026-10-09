import { useState } from 'react'
import { Download, FileUp, X } from 'lucide-react'
import { useAnimatedMount } from '../../../hooks/useAnimatedMount'

type ImportFailure = { row: number; field: string; message: string }
type ImportResult = {
  imported: number
  skipped: number
  defaultPassword?: string
  failures: ImportFailure[]
}

type TraineeImportModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (file: File) => Promise<ImportResult | undefined>
  isSubmitting: boolean
}

const TEMPLATE = [
  'fullName,email,phone,track',
  'Ada Obi,ada.obi@example.com,08011112222,new',
  'Bola Ade,bola.ade@example.com,08033334444,refresher',
].join('\n')

function downloadTemplate() {
  const blob = new Blob([TEMPLATE], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'trainees-import-template.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function TraineeImportModal({ open, onClose, onSubmit, isSubmitting }: TraineeImportModalProps) {
  const { mounted, phase } = useAnimatedMount(open)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)

  if (!mounted) return null

  const reset = () => {
    setFile(null)
    setResult(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    if (!file) return
    const res = await onSubmit(file)
    if (res) setResult(res)
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-[2px] ${phase === 'enter' ? 'animate-fade-in' : ''} ${phase === 'exit' ? 'animate-modal-exit' : ''}`}
      onClick={handleClose}
    >
      <div className="flex min-h-full items-center justify-center px-4 py-6">
        <div
          className={`max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)] ${phase === 'enter' ? 'animate-modal-enter' : 'animate-modal-exit'}`}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trainee-import-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 id="trainee-import-title" className="text-xl font-semibold text-brand">
                Import trainees
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Upload a CSV of full name, email and phone. They get the default password and
                onboard on first login.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close import dialog"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {result ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                Imported <span className="font-bold">{result.imported}</span>, skipped{' '}
                <span className="font-bold">{result.skipped}</span>.
                {result.defaultPassword ? (
                  <>
                    {' '}
                    Default password: <span className="font-mono font-semibold">{result.defaultPassword}</span>.
                  </>
                ) : null}
              </div>
              {result.failures.length > 0 ? (
                <div className="max-h-56 overflow-y-auto rounded-xl border border-rose-200 bg-rose-50/50">
                  <ul className="divide-y divide-rose-100 text-xs">
                    {result.failures.map((f, i) => (
                      <li key={i} className="flex gap-3 px-3 py-2 text-rose-700">
                        <span className="w-14 shrink-0 font-mono">{f.row ? `Row ${f.row}` : f.field}</span>
                        <span>{f.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <button
                type="button"
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Download CSV template
              </button>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-[#f8fbff] px-4 py-5 text-sm text-slate-600 transition hover:border-brand">
                <FileUp className="h-5 w-5 shrink-0 text-brand" />
                <span className="truncate">{file ? file.name : 'Choose a CSV file'}</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>

              <div>
                <p className="text-xs text-slate-500">
                  Include a <code>track</code> column (<span className="font-semibold">new</span> /{' '}
                  <span className="font-semibold">refresher</span>) in the file. Rows without one
                  default to new.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!file || isSubmitting}
                  className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Importing…' : 'Import'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TraineeImportModal
