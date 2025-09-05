import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CardModal from '../../components/cardModal'

// Mock the dependencies
jest.mock('../../utils/imageUtils.js', () => ({
  getProjectImageSrc: (image, name) => image || `/project-images/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`
}))

jest.mock('../../utils/formatText.js', () => ({
  parseContent: (text) => {
    if (!text) return <div>No content</div>
    return text.split('\n').map((line, index) => (
      <div key={index}>{line}</div>
    ))
  }
}))

jest.mock('../../components/button.js', () => {
  return function MockLinkButton({ text, link, className }) {
    return <a href={link} className={className}>{text}</a>
  }
})

describe('CardModal and LanguageTile Integration', () => {
  const mockProjectData = {
    isOpen: true,
    onClose: jest.fn(),
    name: 'Test Project',
    description: 'A test project description\nWith multiple lines',
    image: 'test-image.jpg',
    link: 'https://example.com',
    date: '2024-01-01',
    code: true,
    demo: true,
    github: 'https://github.com/test',
    languages: ['JavaScript', 'React', 'Node.js']
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('LanguageTile Rendering in Modal', () => {
    test('renders language tiles with correct languages in modal', () => {
      render(<CardModal {...mockProjectData} />)
      
      // Check that all language tiles are rendered in modal
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })

    test('language tiles have correct styling in modal context', () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      const nodeTile = screen.getByText('Node.js')
      
      // Check that tiles have correct base classes
      expect(jsTile).toHaveClass('px-3', 'py-1', 'text-white', 'text-sm', 'rounded-md', 'cursor-pointer')
      expect(reactTile).toHaveClass('px-3', 'py-1', 'text-white', 'text-sm', 'rounded-md', 'cursor-pointer')
      expect(nodeTile).toHaveClass('px-3', 'py-1', 'text-white', 'text-sm', 'rounded-md', 'cursor-pointer')
    })

    test('language tiles show popover on hover in modal', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      
      // Hover over JavaScript tile
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
        expect(screen.getByText('a dynamic, weakly typed programming language primarily used to add interactivity to websites.')).toBeInTheDocument()
      })
    })

    test('language tiles hide popover on mouse leave in modal', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      
      // Hover over JavaScript tile
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
      })
      
      // Mouse leave
      fireEvent.mouseLeave(jsTile)
      
      await waitFor(() => {
        expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
      })
    })

    test('language tiles have correct colors for known languages in modal', () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      const nodeTile = screen.getByText('Node.js')
      
      // Check that tiles have correct color classes
      expect(jsTile).toHaveClass('bg-yellow-600')
      expect(reactTile).toHaveClass('bg-orange-500')
      expect(nodeTile).toHaveClass('bg-lime-600')
    })

    test('language tiles handle unknown languages gracefully in modal', () => {
      const dataWithUnknownLanguage = {
        ...mockProjectData,
        languages: ['UnknownLanguage', 'JavaScript']
      }
      
      render(<CardModal {...dataWithUnknownLanguage} />)
      
      expect(screen.getByText('UnknownLanguage')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      
      // Unknown language should have default gray color
      const unknownTile = screen.getByText('UnknownLanguage')
      expect(unknownTile).toHaveClass('bg-gray-500')
    })
  })

  describe('LanguageTile Popover Content in Modal', () => {
    test('popover shows correct title and description for JavaScript in modal', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
        expect(screen.getByText('a dynamic, weakly typed programming language primarily used to add interactivity to websites.')).toBeInTheDocument()
      })
    })

    test('popover shows correct title and description for React in modal', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const reactTile = screen.getByText('React')
      fireEvent.mouseEnter(reactTile)
      
      await waitFor(() => {
        expect(screen.getByText('Component Library')).toBeInTheDocument()
        expect(screen.getByText('a JavaScript library used for building user interfaces.')).toBeInTheDocument()
      })
    })

    test('popover shows correct title and description for Node.js in modal', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const nodeTile = screen.getByText('Node.js')
      fireEvent.mouseEnter(nodeTile)
      
      await waitFor(() => {
        expect(screen.getByText('Server-Side JavaScript')).toBeInTheDocument()
        expect(screen.getByText('a JavaScript runtime built on Chrome\'s V8 JavaScript engine.')).toBeInTheDocument()
      })
    })

    test('popover shows default content for unknown languages in modal', async () => {
      const dataWithUnknownLanguage = {
        ...mockProjectData,
        languages: ['UnknownLanguage']
      }
      
      render(<CardModal {...dataWithUnknownLanguage} />)
      
      const unknownTile = screen.getByText('UnknownLanguage')
      fireEvent.mouseEnter(unknownTile)
      
      await waitFor(() => {
        expect(screen.getByText('Unknown')).toBeInTheDocument()
        expect(screen.getByText('No information available for this tool.')).toBeInTheDocument()
      })
    })
  })

  describe('LanguageTile Layout in Modal', () => {
    test('language tiles are properly positioned in modal layout', () => {
      render(<CardModal {...mockProjectData} />)
      
      const languageContainer = screen.getByText('JavaScript').closest('.flex.flex-wrap.gap-2')
      expect(languageContainer).toHaveClass('flex', 'flex-wrap', 'gap-2')
    })

    test('language tiles wrap properly when there are many languages in modal', () => {
      const dataWithManyLanguages = {
        ...mockProjectData,
        languages: ['JavaScript', 'React', 'Node.js', 'Python', 'Django', 'Flask', 'HTML', 'CSS']
      }
      
      render(<CardModal {...dataWithManyLanguages} />)
      
      const languageContainer = screen.getByText('JavaScript').closest('.flex.flex-wrap.gap-2')
      expect(languageContainer).toHaveClass('flex-wrap')
      
      // All languages should be present
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      expect(screen.getByText('Python')).toBeInTheDocument()
      expect(screen.getByText('Django')).toBeInTheDocument()
      expect(screen.getByText('Flask')).toBeInTheDocument()
      expect(screen.getByText('HTML')).toBeInTheDocument()
      expect(screen.getByText('CSS')).toBeInTheDocument()
    })

    test('language tiles are positioned correctly relative to modal content', () => {
      render(<CardModal {...mockProjectData} />)
      
      const modalContent = screen.getByText('Test Project').closest('.relative')
      const languageContainer = screen.getByText('JavaScript').closest('.flex.flex-wrap.gap-2')
      
      // Language container should be within modal content
      expect(modalContent).toContainElement(languageContainer)
    })
  })

  describe('Modal Interaction with LanguageTiles', () => {
    test('language tile hover does not interfere with modal functionality', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      
      // Hover over language tile
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
      })
      
      // Modal should still be open and functional
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText('A test project description')).toBeInTheDocument()
    })

    test('modal close button works when language tiles are hovered', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const closeButton = screen.getByText('✕')
      
      // Hover over language tile
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
      })
      
      // Click close button
      fireEvent.click(closeButton)
      
      expect(mockProjectData.onClose).toHaveBeenCalledTimes(1)
    })

    test('modal backdrop click works when language tiles are hovered', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const backdrop = screen.getByText('Test Project').closest('.fixed')
      
      // Hover over language tile
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
      })
      
      // Click backdrop
      fireEvent.click(backdrop)
      
      expect(mockProjectData.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    test('handles empty languages array', () => {
      const dataWithEmptyLanguages = {
        ...mockProjectData,
        languages: []
      }
      
      render(<CardModal {...dataWithEmptyLanguages} />)
      
      // Should not render any language tiles
      expect(screen.queryByText('JavaScript')).not.toBeInTheDocument()
      expect(screen.queryByText('React')).not.toBeInTheDocument()
      expect(screen.queryByText('Node.js')).not.toBeInTheDocument()
    })

    test('handles single language in modal', () => {
      const dataWithSingleLanguage = {
        ...mockProjectData,
        languages: ['JavaScript']
      }
      
      render(<CardModal {...dataWithSingleLanguage} />)
      
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.queryByText('React')).not.toBeInTheDocument()
      expect(screen.queryByText('Node.js')).not.toBeInTheDocument()
    })

    test('handles rapid hover interactions in modal', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      
      // Rapidly hover over different tiles
      fireEvent.mouseEnter(jsTile)
      fireEvent.mouseLeave(jsTile)
      fireEvent.mouseEnter(reactTile)
      fireEvent.mouseLeave(reactTile)
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
      })
    })

    test('handles multiple language tiles with different popover content', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      
      // Hover over JavaScript
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
      })
      
      // Mouse leave JavaScript and hover over React
      fireEvent.mouseLeave(jsTile)
      fireEvent.mouseEnter(reactTile)
      
      await waitFor(() => {
        expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
        expect(screen.getByText('Component Library')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility in Modal Context', () => {
    test('language tiles are accessible in modal context', () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      const nodeTile = screen.getByText('Node.js')
      
      // Tiles should be focusable
      expect(jsTile).toHaveAttribute('class', expect.stringContaining('cursor-pointer'))
      expect(reactTile).toHaveAttribute('class', expect.stringContaining('cursor-pointer'))
      expect(nodeTile).toHaveAttribute('class', expect.stringContaining('cursor-pointer'))
    })

    test('popover content is accessible in modal context', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        const popover = screen.getByText('Web Development').closest('.absolute.z-10')
        expect(popover).toHaveClass('absolute', 'z-10')
        // Popover should be accessible via screen reader
        expect(popover).toBeInTheDocument()
      })
    })

    test('language tiles maintain accessibility when modal is closed', () => {
      const { rerender } = render(<CardModal {...mockProjectData} />)
      
      // Initially modal is open
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      
      // Close modal
      rerender(<CardModal {...mockProjectData} isOpen={false} />)
      
      // Language tiles should not be in DOM when modal is closed
      expect(screen.queryByText('JavaScript')).not.toBeInTheDocument()
    })
  })

  describe('Negative Test Cases', () => {
    test('language tiles should not show popover when not hovered in modal', () => {
      render(<CardModal {...mockProjectData} />)
      
      // Popover should not be visible initially
      expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
      expect(screen.queryByText('Component Library')).not.toBeInTheDocument()
      expect(screen.queryByText('Server-Side JavaScript')).not.toBeInTheDocument()
    })

    test('language tiles should not show popover for empty languages array in modal', () => {
      const dataWithEmptyLanguages = {
        ...mockProjectData,
        languages: []
      }
      
      render(<CardModal {...dataWithEmptyLanguages} />)
      
      // Should not show any popover content
      expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
      expect(screen.queryByText('Unknown')).not.toBeInTheDocument()
    })

    test('language tiles should not have incorrect colors in modal context', () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      const nodeTile = screen.getByText('Node.js')
      
      // JavaScript should not have React or Node.js colors
      expect(jsTile).not.toHaveClass('bg-orange-500', 'bg-lime-600')
      // React should not have JavaScript or Node.js colors
      expect(reactTile).not.toHaveClass('bg-yellow-600', 'bg-lime-600')
      // Node.js should not have JavaScript or React colors
      expect(nodeTile).not.toHaveClass('bg-yellow-600', 'bg-orange-500')
    })

    test('popover should not persist after mouse leave in modal', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      
      // Hover to show popover
      fireEvent.mouseEnter(jsTile)
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
      })
      
      // Mouse leave should hide popover
      fireEvent.mouseLeave(jsTile)
      await waitFor(() => {
        expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
      })
    })

    test('language tiles should not interfere with modal close functionality', () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      
      // Clicking language tile should not close modal
      fireEvent.click(jsTile)
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.queryByTestId('card-modal')).toBeInTheDocument()
    })

    test('popover should not show for non-existent language data in modal', async () => {
      const dataWithInvalidLanguage = {
        ...mockProjectData,
        languages: ['NonExistentLanguage']
      }
      
      render(<CardModal {...dataWithInvalidLanguage} />)
      
      const invalidTile = screen.getByText('NonExistentLanguage')
      fireEvent.mouseEnter(invalidTile)
      
      await waitFor(() => {
        // Should show default content, not specific language content
        expect(screen.getByText('Unknown')).toBeInTheDocument()
        expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
      })
    })

    test('multiple popovers should not be visible simultaneously in modal', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      
      // Hover over JavaScript
      fireEvent.mouseEnter(jsTile)
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
      })
      
      // Hover over React without leaving JavaScript first
      fireEvent.mouseEnter(reactTile)
      
      // Should not show both popovers
      await waitFor(() => {
        expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
        expect(screen.getByText('Component Library')).toBeInTheDocument()
      })
    })

    test('language tiles should not render with incorrect structure in modal', () => {
      render(<CardModal {...mockProjectData} />)
      
      const languageContainer = screen.getByText('JavaScript').closest('.flex.flex-wrap.gap-2')
      
      // Should not have incorrect classes
      expect(languageContainer).not.toHaveClass('flex-col', 'grid', 'inline-flex')
      expect(languageContainer).not.toHaveClass('justify-start', 'justify-end')
    })

    test('popover should not have incorrect positioning classes in modal', async () => {
      render(<CardModal {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        const popover = screen.getByText('Web Development').closest('.absolute.z-10')
        
        // Should not have incorrect positioning
        expect(popover).not.toHaveClass('relative', 'static', 'fixed')
        expect(popover).not.toHaveClass('top-0', 'left-0', 'right-0')
      })
    })

    test('language tiles should not be visible when modal is closed', () => {
      const { rerender } = render(<CardModal {...mockProjectData} isOpen={false} />)
      
      // Language tiles should not be in DOM when modal is closed
      expect(screen.queryByText('JavaScript')).not.toBeInTheDocument()
      expect(screen.queryByText('React')).not.toBeInTheDocument()
      expect(screen.queryByText('Node.js')).not.toBeInTheDocument()
    })

    test('popover should not be visible when modal is closed', () => {
      const { rerender } = render(<CardModal {...mockProjectData} isOpen={false} />)
      
      // Popover content should not be in DOM when modal is closed
      expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
      expect(screen.queryByText('Component Library')).not.toBeInTheDocument()
    })
  })
})
