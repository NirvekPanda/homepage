import { render, screen } from '@testing-library/react'
import Header from '../../components/header'

// Mock usePathname hook
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('Header + Nav Integration', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  test('renders complete header with navigation', () => {
    render(<Header />)
    
    // Check header elements
    expect(screen.getByText('Nirvek Pandey')).toBeInTheDocument()
    expect(screen.getByText('Aspiring Network Engineer')).toBeInTheDocument()
    
    // Check navigation elements
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact Me' })).toBeInTheDocument()
  })

  test('navigation reflects current page correctly', () => {
    mockUsePathname.mockReturnValue('/blog')
    render(<Header />)
    
    // Blog link should be active
    const blogLink = screen.getByRole('link', { name: 'Blog' })
    expect(blogLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
    
    // Other links should be inactive
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
  })

  test('all navigation links are accessible', () => {
    render(<Header />)
    
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
    
    // Each link should have proper accessibility attributes
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
      expect(link.textContent).toBeTruthy()
    })
  })

  test('responsive design classes are applied', () => {
    render(<Header />)
    
    // Header responsive classes
    const title = screen.getByText('Nirvek Pandey')
    expect(title).toHaveClass('text-4xl', 'sm:text-5xl')
    
    // Nav responsive classes
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('w-full', 'max-w-[580px]', 'mx-auto')
  })
})
