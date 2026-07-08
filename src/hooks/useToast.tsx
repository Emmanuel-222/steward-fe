import toast from 'react-hot-toast'

export function useToast() {
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (type === 'success') toast.success(message)
    else if (type === 'error') toast.error(message)
    else toast(message)
  }

  return { showToast }
}
