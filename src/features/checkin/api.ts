import api from '../../services/axios'
import type { CheckInResponse, QrTokenResponse } from './types'

export async function checkIn(token: string, email: string) {
  const { data } = await api.post('/attendance/check-in', { token, email })
  return data as CheckInResponse
}

export async function getQrToken(meetingId: string) {
  const { data } = await api.get(`/meetings/${meetingId}/qr-token`)
  return data as QrTokenResponse
}
