import toast from 'react-hot-toast'
import { AlertTriangle } from 'lucide-react'

export function useToast() {
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success',
  ) => {
    if (type === 'success') toast.success(message)
    else if (type === 'error') toast.error(message)
    else if (type === 'warning') {
      toast(message, {
        icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
        style: {
          background: '#fef3c7',
          color: '#92400e',
          border: '1px solid #fcd34d',
        },
      })
    } else toast(message)
  }

  return { showToast }
}