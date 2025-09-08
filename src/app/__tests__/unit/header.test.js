import { render, screen } from '@testing-library/react'
import Header from '../../components/header'

// Mock the Nav component
jest.mock('../../components/nav', () => {
  return function MockNav() {
    return <div data-testid="nav">Navigation</div>
  }
})

// Mock the LocationTile component
jest.mock('../../components/locationTile', () => {
  return function MockLocationTile() {
    return (
      <div data-testid="location-tile">
        <div className="flex items-center space-x-2">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" className="text-[#F5ECD5]">
            <path d="M16,18a5,5,0,1,1,5-5A5.0057,5.0057,0,0,1,16,18Zm0-8a3,3,0,1,0,3,3A3.0033,3.0033,0,0,0,16,10Z"/>
            <path d="M16,30,7.5645,20.0513c-.0479-.0571-.3482-.4515-.3482-.4515A10.8888,10.8888,0,0,1,5,13a11,11,0,0,1,22,0,10.8844,10.8844,0,0,1-2.2148,6.5973l-.0015.0025s-.3.3944-.3447.4474ZM8.8125,18.395c.001.0007.2334.3082.2866.3744L16,26.9079l6.91-8.15c.0439-.0552.2783-.3649.2788-.3657A8.901,8.901,0,0,0,25,13,9,9,0,1,0,7,13a8.9054,8.9054,0,0,0,1.8125,5.395Z"/>
          </svg>
          <span className="text-[#F5ECD5] text-sm font-medium text-center">San Diego, CA</span>
        </div>
      </div>
    )
  }
})

// Mock the background updater hook
jest.mock('../../utils/backgroundUpdater', () => ({
  useBackgroundUpdater: () => ({
    backgroundUrl: 'https://example.com/image.jpg',
    isInitialized: true
  })
}))

describe('Header Component', () => {
  test('renders header with title and subtitle', () => {
    render(<Header />)
    
    expect(screen.getByText('Nirvek Pandey')).toBeInTheDocument()
    expect(screen.getByText('Aspiring Network Engineer')).toBeInTheDocument()
  })

  test('has correct header structure and classes', () => {
    render(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('py-5', 'px-10')
    
    const title = screen.getByText('Nirvek Pandey')
    expect(title).toHaveClass('text-4xl', 'sm:text-5xl')
    
    const subtitle = screen.getByText('Aspiring Network Engineer')
    expect(subtitle).toHaveClass('text-xl', 'sm:text-2xl', 'cursor-pointer')
  })

  test('includes navigation component', () => {
    render(<Header />)
    expect(screen.getByTestId('nav')).toBeInTheDocument()
  })

  test('includes location tile component', () => {
    render(<Header />)
    expect(screen.getByTestId('location-tile')).toBeInTheDocument()
    expect(screen.getByText('San Diego, CA')).toBeInTheDocument()
  })
})
