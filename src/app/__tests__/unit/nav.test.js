import { render, screen } from '@testing-library/react'
import Nav from '../../components/nav'

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

describe('Nav Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  test('renders all navigation items with correct links', () => {
    render(<Nav />)
    
    const navItems = [
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/projects' },
      { name: 'Blog', href: '/blog' },
      { name: 'Resume', href: '/resume' },
      { name: 'Contact Me', href: '/contact' }
    ]
    
    navItems.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', href)
    })
  })

  test('applies active styling to current page', () => {
    mockUsePathname.mockReturnValue('/projects')
    render(<Nav />)
    
    const activeLink = screen.getByRole('link', { name: 'Projects' })
    expect(activeLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
    
    const inactiveLink = screen.getByRole('link', { name: 'Home' })
    expect(inactiveLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
  })

  test('has correct structure and classes', () => {
    render(<Nav />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('w-full', 'max-w-[580px]', 'mx-auto', 'flex', 'justify-center', 'mt-2')
    
    const innerContainer = nav.firstChild
    expect(innerContainer).toHaveClass('bg-slate-800', 'rounded-lg', 'p-1', 'flex', 'space-x-1')
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveClass('px-6', 'py-3', 'rounded-md', 'font-medium', 'transition-all', 'duration-200', 'whitespace-nowrap', 'flex-shrink-0')
    })
  })
})
