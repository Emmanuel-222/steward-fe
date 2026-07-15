import { useQuery } from '@tanstack/react-query'
import { getMyAttendance } from '../api'

function useMyAttendanceQuery() {
  return useQuery({
    queryKey: ['attendance', 'my'],
    queryFn: getMyAttendance,
  })
}

export default useMyAttendanceQuery
