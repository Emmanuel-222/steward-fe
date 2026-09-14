export type CheckInResponse = {
  stewardName: string
  isDuplicate?: boolean
  status?: 'present' | 'late'
}

export type QrTokenResponse = {
  token: string
  url: string
}
