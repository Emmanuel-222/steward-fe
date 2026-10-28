import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import DemoVideoSection from './DemoVideoSection'

describe('DemoVideoSection', () => {
  test('plays the narrated brag with a poster and captions', () => {
    const { container } = render(<DemoVideoSection />)
    const video = container.querySelector('video')
    expect(video?.getAttribute('src')).toBe('/brag.mp4')
    expect(video?.getAttribute('poster')).toBe('/brag-poster.jpg')
    expect(video?.hasAttribute('controls')).toBe(true)
    expect(video?.hasAttribute('autoplay')).toBe(false)
    const captions = container.querySelector('track[kind="captions"]')
    expect(captions?.getAttribute('src')).toBe('/brag.vtt')
    expect(captions?.hasAttribute('default')).toBe(false)
  })

  test('the section is the #demo anchor target', () => {
    const { container } = render(<DemoVideoSection />)
    expect(container.querySelector('#demo')).toBeTruthy()
  })
})
