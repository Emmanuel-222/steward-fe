import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import DemoVideoSection from './DemoVideoSection'

describe('DemoVideoSection', () => {
  test('plays the rendered demo with a poster and captions', () => {
    const { container } = render(<DemoVideoSection />)
    const video = container.querySelector('video')
    expect(video?.getAttribute('src')).toBe('/demo.mp4')
    expect(video?.getAttribute('poster')).toBe('/demo-poster.jpg')
    expect(video?.hasAttribute('controls')).toBe(true)
    expect(video?.hasAttribute('autoplay')).toBe(false)
    expect(container.querySelector('track[kind="captions"]')).toBeTruthy()
    expect(container.querySelector('track[kind="captions"]')?.hasAttribute('default')).toBe(false)
  })

  test('the section is the #demo anchor target', () => {
    const { container } = render(<DemoVideoSection />)
    expect(container.querySelector('#demo')).toBeTruthy()
  })
})
