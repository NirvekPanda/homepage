import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import Resume from '../../resume/page'
import Header from '../../components/header'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const mockUsePathname = usePathname

describe('Resume Page Integration', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/resume')
  })

  describe('Header and Navigation Integration', () => {
    test('Header renders with navigation on resume page', () => {
      render(
        <>
          <Header />
          <Resume />
        </>
      )
      
      // Header should be present
      expect(screen.getByRole('banner')).toBeInTheDocument()
      
      // Navigation should be present
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    test('Resume navigation link is active when on resume page', () => {
      render(
        <>
          <Header />
          <Resume />
        </>
      )
      
      const resumeLink = screen.getByRole('link', { name: 'Resume' })
      expect(resumeLink).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
    })

    test('Other navigation links are inactive on resume page', () => {
      render(
        <>
          <Header />
          <Resume />
        </>
      )
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const projectsLink = screen.getByRole('link', { name: 'Projects' })
      const blogLink = screen.getByRole('link', { name: 'Blog' })
      const contactLink = screen.getByRole('link', { name: 'Contact Me' })
      
      expect(homeLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
      expect(projectsLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
      expect(blogLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
      expect(contactLink).toHaveClass('text-[#FFFAEC]', 'hover:bg-slate-700')
    })

    test('Navigation links have correct href attributes', () => {
      render(
        <>
          <Header />
          <Resume />
        </>
      )
      
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
      expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
      expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute('href', '/resume')
      expect(screen.getByRole('link', { name: 'Contact Me' })).toHaveAttribute('href', '/contact')
    })
  })

  describe('Resume Download Button Integration', () => {
    test('Download button renders with correct styling', () => {
      render(<Resume />)
      
      const downloadButton = screen.getByRole('link', { name: 'Download Resume' })
      expect(downloadButton).toHaveClass(
        'px-6', 'py-3', 'rounded-md', 'font-medium',
        'transition-all', 'duration-200',
        'bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg',
        'hover:bg-[#E6D4B8]', 'mt-6'
      )
    })

    test('Download button has correct href and download attributes', () => {
      render(<Resume />)
      
      const downloadButton = screen.getByRole('link', { name: 'Download Resume' })
      expect(downloadButton).toHaveAttribute('href', '/Nirvek_Pandey_Resume.pdf')
      expect(downloadButton).toHaveAttribute('download')
    })

    test('Download button is accessible', () => {
      render(<Resume />)
      
      const downloadButton = screen.getByRole('link', { name: 'Download Resume' })
      expect(downloadButton).toBeInTheDocument()
      expect(downloadButton.textContent).toBe('Download Resume')
    })
  })

  describe('PDF Viewer Integration', () => {
    test('PDF viewer renders with iframe', () => {
      render(<Resume />)
      
      // Should show iframe directly
      const iframe = document.querySelector('iframe')
      expect(iframe).toBeInTheDocument()
      expect(iframe.tagName).toBe('IFRAME')
    })

    test('PDF iframe has correct attributes', () => {
      render(<Resume />)
      
      const iframe = document.querySelector('iframe')
      expect(iframe).toHaveAttribute('src', '/Nirvek_Pandey_Resume.pdf')
      expect(iframe).toHaveClass('w-full', 'max-w-5xl', 'h-[80vh]', 'border', 'border-gray-500', 'rounded-lg')
    })

    test('PDF iframe fallback content is accessible', () => {
      render(<Resume />)
      
      const iframe = document.querySelector('iframe')
      expect(iframe).toHaveTextContent('Your browser does not support PDFs.')
      
      const fallbackLink = screen.getByRole('link', { name: 'Download instead' })
      expect(fallbackLink).toHaveAttribute('href', '/Nirvek_Pandey_Resume.pdf')
      expect(fallbackLink).toHaveAttribute('download')
    })

    test('PDF viewer container has correct styling', () => {
      render(<Resume />)
      
      const iframe = document.querySelector('iframe')
      const container = iframe.closest('div')
      expect(container).toHaveClass(
        'flex', 'flex-col', 'items-center', 'justify-center',
        'min-h-screen', 'text-white', 'p-4', '-mt-12'
      )
    })
  })

  describe('Layout and Styling Integration', () => {
    test('Download button container has correct styling', () => {
      render(<Resume />)
      
      const downloadButton = screen.getByRole('link', { name: 'Download Resume' })
      const container = downloadButton.closest('div')
      expect(container).toHaveClass('flex', 'flex-col', 'items-center')
    })

    test('Overall page structure is correct', () => {
      render(<Resume />)
      
      // Should have download button container
      expect(screen.getByRole('link', { name: 'Download Resume' }).closest('div')).toHaveClass('flex', 'flex-col', 'items-center')
      
      // Should have PDF viewer container
      const iframe = document.querySelector('iframe')
      expect(iframe.closest('div')).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-screen', 'text-white', 'p-4', '-mt-12')
    })

    test('Page maintains consistent color scheme', () => {
      render(<Resume />)
      
      // Download button should use the site's color scheme
      const downloadButton = screen.getByRole('link', { name: 'Download Resume' })
      expect(downloadButton).toHaveClass('bg-[#F5ECD5]', 'text-gray-900')
      
      // PDF viewer container should use white text
      const iframe = document.querySelector('iframe')
      const pdfContainer = iframe.closest('div')
      expect(pdfContainer).toHaveClass('text-white')
    })
  })

  describe('User Interaction Integration', () => {
    test('Download button hover effect works', () => {
      render(<Resume />)
      
      const downloadButton = screen.getByRole('link', { name: 'Download Resume' })
      expect(downloadButton).toHaveClass('hover:bg-[#E6D4B8]')
    })

    test('Navigation links maintain hover effects', () => {
      render(
        <>
          <Header />
          <Resume />
        </>
      )
      
      const inactiveLinks = [
        screen.getByRole('link', { name: 'Home' }),
        screen.getByRole('link', { name: 'Projects' }),
        screen.getByRole('link', { name: 'Blog' }),
        screen.getByRole('link', { name: 'Contact Me' })
      ]
      
      inactiveLinks.forEach(link => {
        expect(link).toHaveClass('hover:bg-slate-700')
      })
    })

    test('PDF viewer loads without errors', () => {
      render(<Resume />)
      
      // Should show iframe directly
      const iframe = document.querySelector('iframe')
      expect(iframe).toBeInTheDocument()
      expect(iframe.tagName).toBe('IFRAME')
    })
  })

  describe('Accessibility Integration', () => {
    test('All interactive elements are accessible', () => {
      render(
        <>
          <Header />
          <Resume />
        </>
      )
      
      // Navigation links
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Contact Me' })).toBeInTheDocument()
      
      // Download button
      expect(screen.getByRole('link', { name: 'Download Resume' })).toBeInTheDocument()
    })

    test('PDF viewer is accessible', () => {
      render(<Resume />)
      
      const iframe = document.querySelector('iframe')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('src', '/Nirvek_Pandey_Resume.pdf')
    })

    test('Fallback content is accessible', () => {
      render(<Resume />)
      
      const fallbackLink = screen.getByRole('link', { name: 'Download instead' })
      expect(fallbackLink).toBeInTheDocument()
      expect(fallbackLink).toHaveAttribute('href', '/Nirvek_Pandey_Resume.pdf')
      expect(fallbackLink).toHaveAttribute('download')
    })
  })

  describe('Negative Test Cases', () => {
    test('Download button should not have incorrect href', () => {
      render(<Resume />)
      
      const downloadButton = screen.getByRole('link', { name: 'Download Resume' })
      expect(downloadButton).not.toHaveAttribute('href', '/wrong-resume.pdf')
      expect(downloadButton).not.toHaveAttribute('href', '')
    })

    test('PDF iframe should not have incorrect src', () => {
      render(<Resume />)
      
      const iframe = document.querySelector('iframe')
      expect(iframe).not.toHaveAttribute('src', '/wrong-resume.pdf')
      expect(iframe).not.toHaveAttribute('src', '')
    })

    test('Navigation should not show incorrect active states', () => {
      render(
        <>
          <Header />
          <Resume />
        </>
      )
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const projectsLink = screen.getByRole('link', { name: 'Projects' })
      
      // Other links should not be active
      expect(homeLink).not.toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
      expect(projectsLink).not.toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
    })

    test('PDF viewer should render iframe', () => {
      render(<Resume />)
      
      // Should show iframe
      const iframe = document.querySelector('iframe')
      expect(iframe).toBeInTheDocument()
      expect(iframe.tagName).toBe('IFRAME')
    })

    test('Download button should not have incorrect styling classes', () => {
      render(<Resume />)
      
      const downloadButton = screen.getByRole('link', { name: 'Download Resume' })
      
      // Should not have incorrect classes
      expect(downloadButton).not.toHaveClass('bg-red-500', 'bg-blue-500')
      expect(downloadButton).not.toHaveClass('text-white', 'text-black')
      expect(downloadButton).not.toHaveClass('px-4', 'py-2')
    })

    test('PDF viewer should not have incorrect dimensions', () => {
      render(<Resume />)
      
      const iframe = document.querySelector('iframe')
      
      // Should not have incorrect dimensions
      expect(iframe).not.toHaveClass('w-1/2', 'h-1/2')
      expect(iframe).not.toHaveClass('max-w-sm', 'max-w-md')
      expect(iframe).not.toHaveClass('h-screen', 'h-96')
    })

    test('Navigation should not have incorrect link attributes', () => {
      render(
        <>
          <Header />
          <Resume />
        </>
      )
      
      const links = screen.getAllByRole('link')
      const navLinks = links.filter(link => 
        ['Home', 'Projects', 'Blog', 'Resume', 'Contact Me'].includes(link.textContent)
      )
      
      navLinks.forEach(link => {
        // Should not have incorrect attributes
        expect(link).not.toHaveAttribute('target', '_blank')
        expect(link).not.toHaveAttribute('download')
        expect(link).not.toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    test('PDF viewer container should not have incorrect layout classes', () => {
      render(<Resume />)
      
      const iframe = document.querySelector('iframe')
      const container = iframe.closest('div')
      
      // Should not have incorrect layout classes
      expect(container).not.toHaveClass('flex-row', 'grid', 'inline-flex')
      expect(container).not.toHaveClass('justify-start', 'justify-end')
      expect(container).not.toHaveClass('items-start', 'items-end')
    })

    test('Download button should not interfere with PDF viewer', () => {
      render(<Resume />)
      
      const downloadButton = screen.getByRole('link', { name: 'Download Resume' })
      
      // Clicking download button should not affect PDF viewer
      fireEvent.click(downloadButton)
      
      const iframe = document.querySelector('iframe')
      expect(iframe).toBeInTheDocument()
    })

    test('PDF viewer should not render with incorrect border styling', () => {
      render(<Resume />)
      
      const iframe = document.querySelector('iframe')
      
      // Should not have incorrect border classes
      expect(iframe).not.toHaveClass('border-2', 'border-4')
      expect(iframe).not.toHaveClass('border-red-500', 'border-blue-500')
      expect(iframe).not.toHaveClass('border-solid', 'border-dashed')
    })
  })
})
