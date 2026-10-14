import { afterEach, expect, test } from 'vitest'
import api from './axios'

const originalAdapter = api.defaults.adapter

afterEach(() => {
  api.defaults.adapter = originalAdapter
})

function capture(handler: (config: { data?: unknown; params?: unknown }) => void) {
  api.defaults.adapter = async (config) => {
    handler(config)
    return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
  }
}

function parseBody(raw: unknown) {
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

test('trims whitespace from strings in the request body', async () => {
  let body: unknown
  capture((config) => {
    body = config.data
  })

  await api.post('/training/cohorts', { name: ' 2026 Intake ', weekCount: 12 })

  expect(parseBody(body)).toEqual({ name: '2026 Intake', weekCount: 12 })
})

test('leaves password fields untrimmed in the request body', async () => {
  let body: unknown
  capture((config) => {
    body = config.data
  })

  await api.post('/auth/login', { email: ' a@b.com ', password: ' hunter2 ' })

  expect(parseBody(body)).toEqual({ email: 'a@b.com', password: ' hunter2 ' })
})

test('trims whitespace from query params', async () => {
  let params: unknown
  capture((config) => {
    params = config.params
  })

  await api.get('/stewards', { params: { search: '  tobi  ' } })

  expect(params).toEqual({ search: 'tobi' })
})
