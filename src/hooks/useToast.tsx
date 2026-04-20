import type { PropsWithChildren } from 'react'
import { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type })
    setIsVisible(true)
    setTimeout(() => {
      setIsVisible(false)
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isVisible && toast && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4">
          <div className={[
            'rounded-2xl px-6 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md',
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 
            toast.type === 'error' ? 'bg-rose-500 text-white' : 
            'bg-[#0f2d52] text-white'
          ].join(' ')}>
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
