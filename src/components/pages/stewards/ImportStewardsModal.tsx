import { Download, FileUp, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAnimatedMount } from '../../../hooks/useAnimatedMount'
import type { ImportResult } from '../../../features/stewards/types'
import { DEPARTMENTS } from '../../../constants/departments'

const MAX_FILE_SIZE = 1024 * 1024

const SAMPLE_NAMES = [
  'Chiamaka Okafor',
  'Tobi Adeleke',
  'Kehinde Balogun',
  'Ngozi Eze',
  'Emeka Obi',
  'Fumni Alabi',
  'Bolanle Adeyemi',
  'Ifeanyi Nwosu',
  'Zainab Abdullahi',
  'Segun Ogunleye',
  'Amaka Nnamdi',
  'Tunde Akin',
] as const

function departmentSlug(department: string) {
  return department
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildTemplateCsv() {
  const rows = DEPARTMENTS.map((department, index) => {
    const email = `${departmentSlug(department)}@example.com`
    const phone = `+2348012345${String(index + 1).padStart(3, '0')}`
    const birthday = index % 2 === 0 ? '25/12/1995' : ''
    const role = index === 0 ? 'Leader' : index === 1 ? 'Pastor' : ''
    return [SAMPLE_NAMES[index], email, phone, department, birthday, role].join(',')
  })

  return ['fullName,email,phone,department,birthday,role', ...rows].join('\n')
}

function downloadTemplate() {
  const blob = new Blob([buildTemplateCsv()], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'stewards-import-template.csv'
  link.click()
  URL.revokeObjectURL(url)
}

type ImportStewardsModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (file: File) => Promise<ImportResult | undefined>
  isSubmitting: boolean
}

type ImportStatus = 'idle' | 'uploading' | 'done'

function ImportStewardsModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: ImportStewardsModalProps) {
  const { mounted, phase } = useAnimatedMount(open)
  const [status, setStatus] = useState<ImportStatus>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const resetAll = useCallback(() => {
    setStatus('idle')
    setSelectedFile(null)
    setFileError('')
    setSubmitError('')
    setResult(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  const handleClose = useCallback(() => {
    resetAll()
    onClose()
  }, [onClose, resetAll])

  useEffect(() => {
    if (!mounted) return undefined
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose, mounted])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setFileError('')
    if (!file) {
      setSelectedFile(null)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null)
      setFileError('This file is larger than 1MB. Please choose a smaller CSV file.')
      return
    }
    setSelectedFile(file)
  }

  const handleSubmitFile = async () => {
    if (!selectedFile || isSubmitting || fileError) return
    setSubmitError('')
    setStatus('uploading')
    try {
      const nextResult = await onSubmit(selectedFile)
      setResult(nextResult ?? null)
      setStatus('done')
    } catch {
      setSubmitError('Import failed. Please check the file and try again.')
      setStatus('idle')
    }
  }

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-[2px] ${phase === 'enter' ? 'animate-fade-in' : ''} ${phase === 'exit' ? 'animate-modal-exit' : ''}`}
      onClick={handleClose}
    >
      <div className="flex min-h-full items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
      <div
        className={`max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:max-h-[calc(100vh-3rem)] sm:p-6 ${phase === 'enter' ? 'animate-modal-enter' : 'animate-modal-exit'}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-stewards-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="import-stewards-title" className="text-xl font-semibold text-brand">
              Import Stewards from CSV
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Bulk-enrol members into the digital registry.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close import stewards dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === 'done' && result ? (
          <div className="mt-5 space-y-4 sm:mt-6">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {result.imported} user(s) imported successfully
              {result.skipped > 0 ? `, ${result.skipped} row(s) skipped` : ''}.
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Imported users log in with the default password: {result.defaultPassword}
              {' \u2014 '}ask them to change it after first login.
            </div>
            {result.failures.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-rose-200">
                <p className="border-b border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {result.failures.length} row(s) were skipped:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-rose-50/60 text-xs uppercase tracking-[0.15em] text-rose-600">
                        <th className="px-4 py-2 font-semibold">Row</th>
                        <th className="px-4 py-2 font-semibold">Field</th>
                        <th className="px-4 py-2 font-semibold">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.failures.map((failure) => (
                        <tr
                          key={`${failure.row}-${failure.field}`}
                          className="border-t border-rose-100 text-slate-600"
                        >
                          <td className="px-4 py-2.5">{failure.row}</td>
                          <td className="px-4 py-2.5">{failure.field}</td>
                          <td className="px-4 py-2.5">{failure.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={resetAll}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 sm:w-auto"
              >
                Import Another File
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4 sm:mt-6">
            <p className="text-sm leading-6 text-slate-500">
              Upload a CSV file containing steward records to create multiple users at
              once. The first row must contain the column headers and every other row is
              a new steward. The template has one sample row per department — replace them
              with your stewards and delete the rows you do not need.
            </p>

            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-slate-100"
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </button>

            <div>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                id="import-stewards-file"
                className="sr-only"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <label
                htmlFor="import-stewards-file"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#d8e2f0] bg-[#f3f7fd] px-4 py-4 text-sm transition ${selectedFile ? 'text-slate-700' : 'text-slate-500'} ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'hover:border-brand'}`}
              >
                <FileUp className="h-4 w-4 shrink-0 text-brand" />
                <span className="truncate">
                  {selectedFile ? selectedFile.name : 'Choose a CSV file to upload'}
                </span>
              </label>
              <p className="mt-1.5 text-xs text-slate-400">
                Accepts .csv files up to 1MB. Required columns: fullName, email, phone,
                department, birthday. Failure row numbers match your spreadsheet (header
                is row 1, first steward row 2).
              </p>
            </div>

            {fileError ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {fileError}
              </p>
            ) : null}
            {submitError ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFile}
                disabled={!selectedFile || isSubmitting || Boolean(fileError)}
                className="w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isSubmitting ? 'Importing...' : 'Upload & Import'}
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default ImportStewardsModal
