import { render, screen, fireEvent } from '@testing-library/react'
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

describe('Nav and LinkButton Integration', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
    jest.clearAllMocks()
  })

  describe('Navigation Link Rendering', () => {
    test('renders all navigation links with correct structure', () => {
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

    test('navigation links have correct base styling classes', () => {
      render(<Nav />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('px-6', 'py-3', 'rounded-md', 'font-medium', 'transition-all', 'duration-200', 'whitespace-nowrap', 'flex-shrink-0')
      })
    })

    test('navigation container has correct structure and classes', () => {
      render(<Nav />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('w-full', 'max-w-[580px]', 'mx-auto', 'flex', 'justify-center', 'mt-2')
      
      const innerContainer = nav.firstChild
      expect(innerContainer).toHaveClass('bg-slate-800', 'rounded-lg', 'p-1', 'flex', 'space-x-1', 'overflow-x-auto', 'scrollbar-hide')
    })
  })

  describe('Active State Management', () => {
    test('applies active styling to current page', () => {
      mockUsePathname.mockReturnValue('/projects')
      render(<Nav />)
      
      const activeLink = screen.getByRole('link', { name: 'Projects' })
      expect(activeLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
      
      const inactiveLink = screen.getByRole('link', { name: 'Home' })
      expect(inactiveLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
    })

    test('applies active styling to home page when on root', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Nav />)
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
      
      const inactiveLink = screen.getByRole('link', { name: 'Projects' })
      expect(inactiveLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
    })

    test('applies active styling to blog page', () => {
      mockUsePathname.mockReturnValue('/blog')
      render(<Nav />)
      
      const blogLink = screen.getByRole('link', { name: 'Blog' })
      expect(blogLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
      
      const inactiveLink = screen.getByRole('link', { name: 'Home' })
      expect(inactiveLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
    })

    test('applies active styling to resume page', () => {
      mockUsePathname.mockReturnValue('/resume')
      render(<Nav />)
      
      const resumeLink = screen.getByRole('link', { name: 'Resume' })
      expect(resumeLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
      
      const inactiveLink = screen.getByRole('link', { name: 'Home' })
      expect(inactiveLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
    })

    test('applies active styling to contact page', () => {
      mockUsePathname.mockReturnValue('/contact')
      render(<Nav />)
      
      const contactLink = screen.getByRole('link', { name: 'Contact Me' })
      expect(contactLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
      
      const inactiveLink = screen.getByRole('link', { name: 'Home' })
      expect(inactiveLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
    })
  })

  describe('Link Interaction and Functionality', () => {
    test('navigation links are clickable and functional', () => {
      render(<Nav />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
        expect(link.textContent).toBeTruthy()
      })
    })

    test('navigation links maintain hover states', () => {
      mockUsePathname.mockReturnValue('/projects')
      render(<Nav />)
      
      const inactiveLink = screen.getByRole('link', { name: 'Home' })
      expect(inactiveLink).toHaveClass('hover:bg-slate-700')
    })

    test('navigation links handle click events', () => {
      render(<Nav />)
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const projectsLink = screen.getByRole('link', { name: 'Projects' })
      
      // Click events should not throw errors
      expect(() => {
        fireEvent.click(homeLink)
        fireEvent.click(projectsLink)
      }).not.toThrow()
    })
  })

  describe('Responsive Design', () => {
    test('navigation has responsive classes for different screen sizes', () => {
      render(<Nav />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('w-full', 'max-w-[580px]', 'mx-auto')
      
      const innerContainer = nav.firstChild
      expect(innerContainer).toHaveClass('overflow-x-auto', 'scrollbar-hide')
    })

    test('navigation links maintain responsive behavior', () => {
      render(<Nav />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('whitespace-nowrap', 'flex-shrink-0')
      })
    })
  })

  describe('Accessibility', () => {
    test('navigation has proper ARIA roles and structure', () => {
      render(<Nav />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(5)
    })

    test('navigation links have proper accessibility attributes', () => {
      render(<Nav />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
        expect(link.textContent).toBeTruthy()
      })
    })

    test('navigation maintains accessibility with different active states', () => {
      mockUsePathname.mockReturnValue('/projects')
      render(<Nav />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(5)
    })
  })

  describe('Edge Cases', () => {
    test('handles unknown path gracefully', () => {
      mockUsePathname.mockReturnValue('/unknown-path')
      render(<Nav />)
      
      // All links should be inactive
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
      })
    })

    test('handles empty path gracefully', () => {
      mockUsePathname.mockReturnValue('')
      render(<Nav />)
      
      // All links should be inactive
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
      })
    })

    test('handles null path gracefully', () => {
      mockUsePathname.mockReturnValue(null)
      render(<Nav />)
      
      // All links should be inactive
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
      })
    })

    test('handles rapid path changes', () => {
      const { rerender } = render(<Nav />)
      
      // Change path multiple times
      mockUsePathname.mockReturnValue('/projects')
      rerender(<Nav />)
      
      mockUsePathname.mockReturnValue('/blog')
      rerender(<Nav />)
      
      mockUsePathname.mockReturnValue('/contact')
      rerender(<Nav />)
      
      // Should handle rapid changes without errors
      const contactLink = screen.getByRole('link', { name: 'Contact Me' })
      expect(contactLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
    })
  })

  describe('Performance', () => {
    test('navigation renders efficiently', () => {
      render(<Nav />)
      
      // Should render without errors
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getAllByRole('link')).toHaveLength(5)
    })

    test('navigation maintains performance with multiple instances', () => {
      render(
        <div>
          <Nav />
          <Nav />
        </div>
      )
      
      // Both navigation instances should render independently
      const navs = screen.getAllByRole('navigation')
      expect(navs).toHaveLength(2)
      
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(10) // 5 links per nav
    })
  })

  describe('LinkButton Integration', () => {
    test('navigation links behave like LinkButton components', () => {
      render(<Nav />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        // Should have LinkButton-like styling
        expect(link).toHaveClass('px-6', 'py-3', 'rounded-md', 'font-medium', 'transition-all', 'duration-200')
      })
    })

    test('navigation links have consistent styling with LinkButton', () => {
      render(<Nav />)
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const projectsLink = screen.getByRole('link', { name: 'Projects' })
      
      // Both should have same base classes
      expect(homeLink).toHaveClass('px-6', 'py-3', 'rounded-md', 'font-medium', 'transition-all', 'duration-200')
      expect(projectsLink).toHaveClass('px-6', 'py-3', 'rounded-md', 'font-medium', 'transition-all', 'duration-200')
    })

    test('navigation links maintain LinkButton-like behavior on hover', () => {
      mockUsePathname.mockReturnValue('/projects')
      render(<Nav />)
      
      const inactiveLink = screen.getByRole('link', { name: 'Home' })
      
      // Should have hover effects similar to LinkButton
      expect(inactiveLink).toHaveClass('hover:bg-slate-700')
    })
  })

  describe('Negative Test Cases', () => {
    test('navigation should not show incorrect active states', () => {
      mockUsePathname.mockReturnValue('/projects')
      render(<Nav />)
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const projectsLink = screen.getByRole('link', { name: 'Projects' })
      
      // Home should not be active when on projects page
      expect(homeLink).not.toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
      expect(homeLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
      
      // Projects should be active
      expect(projectsLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
    })

    test('navigation should not have incorrect link attributes', () => {
      render(<Nav />)
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const projectsLink = screen.getByRole('link', { name: 'Projects' })
      
      // Should not have incorrect href attributes
      expect(homeLink).not.toHaveAttribute('href', '/wrong-home')
      expect(projectsLink).not.toHaveAttribute('href', '/wrong-projects')
      
      // Should have correct href attributes
      expect(homeLink).toHaveAttribute('href', '/')
      expect(projectsLink).toHaveAttribute('href', '/projects')
    })

    test('navigation should not have incorrect styling classes', () => {
      render(<Nav />)
      
      const nav = screen.getByRole('navigation')
      const innerContainer = nav.firstChild
      
      // Should not have incorrect classes
      expect(nav).not.toHaveClass('flex-col', 'grid', 'inline-flex')
      expect(innerContainer).not.toHaveClass('flex-col', 'grid', 'inline-flex')
    })

    test('navigation links should not have incorrect base classes', () => {
      render(<Nav />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        // Should not have incorrect classes
        expect(link).not.toHaveClass('px-4', 'py-2') // Different button sizing
        expect(link).not.toHaveClass('text-sm', 'text-xs') // Different text sizing
        expect(link).not.toHaveClass('bg-red-500', 'bg-blue-500') // Different colors
      })
    })

    test('navigation should not render with incorrect responsive behavior', () => {
      render(<Nav />)
      
      const nav = screen.getByRole('navigation')
      const innerContainer = nav.firstChild
      
      // Should not have incorrect responsive classes
      expect(nav).not.toHaveClass('hidden', 'md:block')
      expect(innerContainer).not.toHaveClass('flex-col', 'md:flex-row')
    })

    test('navigation should not have incorrect accessibility attributes', () => {
      render(<Nav />)
      
      const nav = screen.getByRole('navigation')
      const links = screen.getAllByRole('link')
      
      // Navigation should not have incorrect role
      expect(nav).not.toHaveAttribute('role', 'menu')
      expect(nav).not.toHaveAttribute('role', 'toolbar')
      
      // Links should not have incorrect attributes
      links.forEach(link => {
        expect(link).not.toHaveAttribute('role', 'button')
        expect(link).not.toHaveAttribute('type', 'button')
      })
    })

    test('navigation should not show multiple active states', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Nav />)
      
      const links = screen.getAllByRole('link')
      const activeLinks = links.filter(link => 
        link.classList.contains('bg-[#F5ECD5]')
      )
      
      // Should only have one active link
      expect(activeLinks).toHaveLength(1)
    })

    test('navigation should not have incorrect spacing classes', () => {
      render(<Nav />)
      
      const innerContainer = screen.getByRole('navigation').firstChild
      
      // Should not have incorrect spacing
      expect(innerContainer).not.toHaveClass('space-y-1', 'space-y-2')
      expect(innerContainer).not.toHaveClass('gap-2', 'gap-4')
    })

    test('navigation should not render with incorrect overflow behavior', () => {
      render(<Nav />)
      
      const innerContainer = screen.getByRole('navigation').firstChild
      
      // Should not have incorrect overflow classes
      expect(innerContainer).not.toHaveClass('overflow-hidden', 'overflow-visible')
      expect(innerContainer).not.toHaveClass('overflow-y-auto', 'overflow-x-hidden')
    })

    test('navigation should not have incorrect focus behavior', () => {
      render(<Nav />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        // Should not have incorrect focus classes
        expect(link).not.toHaveClass('focus:outline-none')
        expect(link).not.toHaveClass('focus:ring-0')
        expect(link).not.toHaveClass('focus:border-0')
      })
    })
  })
})
