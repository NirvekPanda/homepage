import { render, screen, fireEvent } from '@testing-library/react'
import Nav from '../../components/nav'

// Mock usePathname hook
const mockUsePathname = jest.fn()
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: '#resume' },
  { name: 'Contact', href: '#contact' }
]

describe('Nav Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
    mockPush.mockClear()
  })

  test('renders all navigation items with correct links', () => {
    render(<Nav />)

    // Desktop and mobile navs each render every item
    navItems.forEach(({ name, href }) => {
      const links = screen.getAllByRole('link', { name })
      expect(links).toHaveLength(2)
      links.forEach(link => expect(link).toHaveAttribute('href', href))
    })
  })

  test('applies active styling to the current section', () => {
    render(<Nav />)

    // Scroll-spy starts on the "home" section
    screen.getAllByRole('link', { name: 'Home' }).forEach(link => {
      expect(link).toHaveClass('shadow-lg')
    })
    screen.getAllByRole('link', { name: 'Projects' }).forEach(link => {
      expect(link).not.toHaveClass('shadow-lg')
    })
  })

  test('has desktop and mobile navigation landmarks', () => {
    render(<Nav />)

    const [desktopNav, mobileNav] = screen.getAllByRole('navigation')
    expect(desktopNav).toHaveClass('hidden', 'lg:flex', 'sticky')
    expect(mobileNav).toHaveClass('fixed', 'bottom-0', 'lg:hidden')
  })

  test('scrolls to the section when on the home page', () => {
    const section = document.createElement('section')
    section.id = 'projects'
    section.scrollIntoView = jest.fn()
    document.body.appendChild(section)

    render(<Nav />)
    fireEvent.click(screen.getAllByRole('link', { name: 'Projects' })[0])

    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(mockPush).not.toHaveBeenCalled()
    section.remove()
  })

  test('navigates home to the section when on another page', () => {
    mockUsePathname.mockReturnValue('/blog')
    render(<Nav />)

    fireEvent.click(screen.getAllByRole('link', { name: 'Projects' })[0])
    expect(mockPush).toHaveBeenCalledWith('/#projects')
  })
})
