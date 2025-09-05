import { render, screen } from '@testing-library/react'
import Footer from '../../components/footer'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, ...props }) {
    return <img src={src} alt={alt} width={width} height={height} {...props} />
  }
})

describe('Footer Component', () => {
  test('renders all social links with correct attributes', () => {
    render(<Footer />)
    
    const socialLinks = [
      { name: /linkedin/i, href: 'https://www.linkedin.com/in/nirvekpandey/' },
      { name: /github/i, href: 'https://github.com/NirvekPanda' },
      { name: /resume/i, href: '/Nirvek_Pandey_Resume.pdf' }
    ]
    
    socialLinks.forEach(({ name, href }) => {
      const link = screen.getByRole('link', { name })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
    
    // Resume link has additional download attribute
    const resumeLink = screen.getByRole('link', { name: /resume/i })
    expect(resumeLink).toHaveAttribute('download')
  })

  test('renders all icons with correct attributes', () => {
    render(<Footer />)
    
    const icons = [
      { alt: 'File icon', src: '/globe.svg' },
      { alt: 'Window icon', src: '/window.svg' },
      { alt: 'Resume icon', src: '/file.svg' }
    ]
    
    icons.forEach(({ alt, src }) => {
      const icon = screen.getByAltText(alt)
      expect(icon).toHaveAttribute('src', src)
      expect(icon).toHaveAttribute('width', '16')
      expect(icon).toHaveAttribute('height', '16')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  test('has correct structure and classes', () => {
    render(<Footer />)
    
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('flex', 'gap-6', 'flex-wrap', 'items-center', 'justify-center')
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveClass('hover:underline', 'hover:underline-offset-4')
    })
  })
})
