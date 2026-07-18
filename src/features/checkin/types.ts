export type CheckInResponse = {
  stewardName: string
  isDuplicate?: boolean
}

export type QrTokenResponse = {
  token: string
  url: string
}
