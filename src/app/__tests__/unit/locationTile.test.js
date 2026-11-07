import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import LocationTile from '../../components/locationTile'

let mockLocationData = null

jest.mock('../../utils/backgroundUpdater', () => ({
  API_BASE: 'https://image-api.example/api/v1',
  useBackgroundUpdater: () => ({ locationData: mockLocationData }),
}))

const paris = {
  id: 'img-paris',
  name: 'Paris, France',
  city: 'Paris',
  country: 'France',
  latitude: 48.8566,
  longitude: 2.3522,
}

const tokyo = {
  id: 'img-tokyo',
  name: 'Tokyo, Japan',
  city: 'Tokyo',
  country: 'Japan',
  latitude: 35.6762,
  longitude: 139.6503,
}

const hover = (el) => fireEvent.mouseEnter(el)
const unhover = (el) => fireEvent.mouseLeave(el)

describe('LocationTile map preview', () => {
  beforeEach(() => {
    mockLocationData = paris
  })

  test('does not request the map until hovered', () => {
    render(<LocationTile />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test('shows the map for the current image id on hover and hides it on leave', () => {
    render(<LocationTile />)
    const tag = screen.getByRole('button')

    hover(tag)
    const img = screen.getByAltText('Map of Paris, France')
    expect(img).toHaveAttribute('src', 'https://image-api.example/api/v1/images/map/img-paris?w=240&h=240')
    expect(img).not.toHaveAttribute('crossorigin')
    expect(tag).toHaveAttribute('aria-expanded', 'true')

    unhover(tag)
    expect(tag).toHaveAttribute('aria-expanded', 'false')
  })

  test('fades the map in once it loads', () => {
    render(<LocationTile />)
    hover(screen.getByRole('button'))
    const img = screen.getByAltText('Map of Paris, France')
    expect(img).toHaveClass('opacity-0')
    fireEvent.load(img)
    expect(img).toHaveClass('opacity-100')
  })

  test('opens on keyboard focus and closes on blur', () => {
    render(<LocationTile />)
    const tag = screen.getByRole('button')
    expect(tag).toHaveAttribute('tabIndex', '0')

    act(() => tag.focus())
    expect(tag).toHaveAttribute('aria-expanded', 'true')
    act(() => tag.blur())
    expect(tag).toHaveAttribute('aria-expanded', 'false')
  })

  test('opens on tap and closes on a tap outside', () => {
    render(<LocationTile />)
    const tag = screen.getByRole('button')

    fireEvent.click(tag)
    expect(tag).toHaveAttribute('aria-expanded', 'true')

    fireEvent.pointerDown(document.body)
    expect(tag).toHaveAttribute('aria-expanded', 'false')
  })

  test('switches to the new map when the background changes while open', () => {
    const { rerender } = render(<LocationTile />)
    hover(screen.getByRole('button'))
    fireEvent.load(screen.getByAltText('Map of Paris, France'))

    mockLocationData = tokyo
    rerender(<LocationTile />)

    expect(screen.queryByAltText('Map of Paris, France')).not.toBeInTheDocument()
    const img = screen.getByAltText('Map of Tokyo, Japan')
    expect(img.getAttribute('src')).toContain('/images/map/img-tokyo?')
    expect(img).toHaveClass('opacity-0')
  })

  test('does not load a map for a new background while closed', () => {
    const { rerender } = render(<LocationTile />)
    const tag = screen.getByRole('button')
    hover(tag)
    unhover(tag)

    mockLocationData = tokyo
    rerender(<LocationTile />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test.each([
    ['no location', { id: 'x', name: 'Unknown Location' }],
    ['0,0 coordinates', { ...paris, latitude: 0, longitude: 0 }],
    ['no id', { ...paris, id: undefined }],
  ])('offers no popover for an image with %s', (_, data) => {
    mockLocationData = data
    render(<LocationTile />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByTestId('location-map-popover')).not.toBeInTheDocument()
  })

  test('hides the popover entirely if the map fails to load', () => {
    render(<LocationTile />)
    hover(screen.getByRole('button'))
    fireEvent.error(screen.getByAltText('Map of Paris, France'))
    expect(screen.queryByTestId('location-map-popover')).not.toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test('falls back to generic alt text without city and country', () => {
    mockLocationData = { ...paris, city: undefined, country: undefined }
    render(<LocationTile />)
    hover(screen.getByRole('button'))
    expect(screen.getByAltText('Map of photo location')).toBeInTheDocument()
  })
})
