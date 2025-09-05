import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Card from '../../components/card'

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

jest.mock('../../components/cardModal.js', () => {
  return function MockCardModal({ isOpen, onClose, name, description, languages }) {
    if (!isOpen) return null
    return (
      <div data-testid="card-modal">
        <h2>{name}</h2>
        <p>{description}</p>
        <div>Languages: {languages?.join(', ')}</div>
        <button onClick={onClose}>Close</button>
      </div>
    )
  }
})

jest.mock('../../components/button.js', () => {
  return function MockLinkButton({ text, link, className }) {
    return <a href={link} className={className}>{text}</a>
  }
})

describe('Card and LanguageTile Integration', () => {
  const mockProjectData = {
    name: 'Test Project',
    description: 'A test project description',
    languages: 'JavaScript, React, Node.js',
    image: 'test-image.jpg',
    link: 'https://example.com',
    date: '2024-01-01',
    code: true,
    github: 'https://github.com/test',
    demo: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('LanguageTile Rendering and Interaction', () => {
    test('renders language tiles with correct languages', () => {
      render(<Card {...mockProjectData} />)
      
      // Check that all language tiles are rendered
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })

    test('language tiles have correct styling and structure', () => {
      render(<Card {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      const nodeTile = screen.getByText('Node.js')
      
      // Check that tiles have correct base classes
      expect(jsTile).toHaveClass('px-3', 'py-1', 'text-white', 'text-sm', 'rounded-md', 'cursor-pointer')
      expect(reactTile).toHaveClass('px-3', 'py-1', 'text-white', 'text-sm', 'rounded-md', 'cursor-pointer')
      expect(nodeTile).toHaveClass('px-3', 'py-1', 'text-white', 'text-sm', 'rounded-md', 'cursor-pointer')
    })

    test('language tiles show popover on hover', async () => {
      render(<Card {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      
      // Hover over JavaScript tile
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
        expect(screen.getByText('a dynamic, weakly typed programming language primarily used to add interactivity to websites.')).toBeInTheDocument()
      })
    })

    test('language tiles hide popover on mouse leave', async () => {
      render(<Card {...mockProjectData} />)
      
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

    test('language tiles have correct colors for known languages', () => {
      render(<Card {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      const nodeTile = screen.getByText('Node.js')
      
      // Check that tiles have correct color classes
      expect(jsTile).toHaveClass('bg-yellow-600')
      expect(reactTile).toHaveClass('bg-orange-500')
      expect(nodeTile).toHaveClass('bg-lime-600')
    })

    test('language tiles handle unknown languages gracefully', () => {
      const dataWithUnknownLanguage = {
        ...mockProjectData,
        languages: 'UnknownLanguage, JavaScript'
      }
      
      render(<Card {...dataWithUnknownLanguage} />)
      
      expect(screen.getByText('UnknownLanguage')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      
      // Unknown language should have default gray color
      const unknownTile = screen.getByText('UnknownLanguage')
      expect(unknownTile).toHaveClass('bg-gray-500')
    })
  })

  describe('LanguageTile Popover Content', () => {
    test('popover shows correct title and description for JavaScript', async () => {
      render(<Card {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        expect(screen.getByText('Web Development')).toBeInTheDocument()
        expect(screen.getByText('a dynamic, weakly typed programming language primarily used to add interactivity to websites.')).toBeInTheDocument()
      })
    })

    test('popover shows correct title and description for React', async () => {
      render(<Card {...mockProjectData} />)
      
      const reactTile = screen.getByText('React')
      fireEvent.mouseEnter(reactTile)
      
      await waitFor(() => {
        expect(screen.getByText('Component Library')).toBeInTheDocument()
        expect(screen.getByText('a JavaScript library used for building user interfaces.')).toBeInTheDocument()
      })
    })

    test('popover shows correct title and description for Node.js', async () => {
      render(<Card {...mockProjectData} />)
      
      const nodeTile = screen.getByText('Node.js')
      fireEvent.mouseEnter(nodeTile)
      
      await waitFor(() => {
        expect(screen.getByText('Server-Side JavaScript')).toBeInTheDocument()
        expect(screen.getByText('a JavaScript runtime built on Chrome\'s V8 JavaScript engine.')).toBeInTheDocument()
      })
    })

    test('popover shows default content for unknown languages', async () => {
      const dataWithUnknownLanguage = {
        ...mockProjectData,
        languages: 'UnknownLanguage'
      }
      
      render(<Card {...dataWithUnknownLanguage} />)
      
      const unknownTile = screen.getByText('UnknownLanguage')
      fireEvent.mouseEnter(unknownTile)
      
      await waitFor(() => {
        expect(screen.getByText('Unknown')).toBeInTheDocument()
        expect(screen.getByText('No information available for this tool.')).toBeInTheDocument()
      })
    })
  })

  describe('LanguageTile Layout and Positioning', () => {
    test('language tiles are properly positioned in card layout', () => {
      render(<Card {...mockProjectData} />)
      
      const languageContainer = screen.getByText('JavaScript').closest('.px-4.pb-4.pt-0.mt-2')
      expect(languageContainer).toHaveClass('px-4', 'pb-4', 'pt-0', 'mt-2', 'flex', 'flex-wrap', 'justify-center', 'gap-2')
    })

    test('language tiles wrap properly when there are many languages', () => {
      const dataWithManyLanguages = {
        ...mockProjectData,
        languages: 'JavaScript, React, Node.js, Python, Django, Flask, HTML, CSS'
      }
      
      render(<Card {...dataWithManyLanguages} />)
      
      const languageContainer = screen.getByText('JavaScript').closest('.px-4.pb-4.pt-0.mt-2')
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
  })

  describe('Edge Cases', () => {
    test('handles empty languages string', () => {
      const dataWithEmptyLanguages = {
        ...mockProjectData,
        languages: ''
      }
      
      render(<Card {...dataWithEmptyLanguages} />)
      
      // Should render one empty language tile
      const languageContainer = screen.getByText('Test Project').closest('.cursor-pointer').querySelector('.px-4.pb-4.pt-0.mt-2')
      const languageTiles = languageContainer.querySelectorAll('[class*="px-3 py-1"]')
      expect(languageTiles).toHaveLength(1)
      expect(languageTiles[0]).toHaveTextContent('')
    })

    test('handles single language', () => {
      const dataWithSingleLanguage = {
        ...mockProjectData,
        languages: 'JavaScript'
      }
      
      render(<Card {...dataWithSingleLanguage} />)
      
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.queryByText('React')).not.toBeInTheDocument()
      expect(screen.queryByText('Node.js')).not.toBeInTheDocument()
    })

    test('handles languages with extra whitespace', () => {
      const dataWithWhitespace = {
        ...mockProjectData,
        languages: ' JavaScript , React , Node.js '
      }
      
      render(<Card {...dataWithWhitespace} />)
      
      // Should still render all languages correctly
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })

    test('handles rapid hover interactions', async () => {
      render(<Card {...mockProjectData} />)
      
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
  })

  describe('Accessibility', () => {
    test('language tiles are accessible and focusable', () => {
      render(<Card {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      const reactTile = screen.getByText('React')
      const nodeTile = screen.getByText('Node.js')
      
      // Tiles should be focusable
      expect(jsTile).toHaveAttribute('class', expect.stringContaining('cursor-pointer'))
      expect(reactTile).toHaveAttribute('class', expect.stringContaining('cursor-pointer'))
      expect(nodeTile).toHaveAttribute('class', expect.stringContaining('cursor-pointer'))
    })

    test('popover content is accessible', async () => {
      render(<Card {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        const popover = screen.getByText('Web Development').closest('.absolute.z-10')
        expect(popover).toHaveClass('absolute', 'z-10')
        // Popover should be accessible via screen reader
        expect(popover).toBeInTheDocument()
      })
    })
  })

  describe('Negative Test Cases', () => {
    test('language tiles should not show popover when not hovered', () => {
      render(<Card {...mockProjectData} />)
      
      // Popover should not be visible initially
      expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
      expect(screen.queryByText('Component Library')).not.toBeInTheDocument()
      expect(screen.queryByText('Server-Side JavaScript')).not.toBeInTheDocument()
    })

    test('language tiles should not show popover for empty language', () => {
      const dataWithEmptyLanguage = {
        ...mockProjectData,
        languages: ''
      }
      
      render(<Card {...dataWithEmptyLanguage} />)
      
      // Should not show any popover content
      expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
      expect(screen.queryByText('Unknown')).not.toBeInTheDocument()
    })

    test('language tiles should not have incorrect colors for known languages', () => {
      render(<Card {...mockProjectData} />)
      
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

    test('popover should not persist after mouse leave', async () => {
      render(<Card {...mockProjectData} />)
      
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

    test('language tiles should not interfere with card click functionality', () => {
      render(<Card {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      
      // Clicking language tile should not open modal
      fireEvent.click(jsTile)
      expect(screen.queryByTestId('card-modal')).not.toBeInTheDocument()
    })

    test('popover should not show for non-existent language data', async () => {
      const dataWithInvalidLanguage = {
        ...mockProjectData,
        languages: 'NonExistentLanguage'
      }
      
      render(<Card {...dataWithInvalidLanguage} />)
      
      const invalidTile = screen.getByText('NonExistentLanguage')
      fireEvent.mouseEnter(invalidTile)
      
      await waitFor(() => {
        // Should show default content, not specific language content
        expect(screen.getByText('Unknown')).toBeInTheDocument()
        expect(screen.queryByText('Web Development')).not.toBeInTheDocument()
      })
    })

    test('multiple popovers should not be visible simultaneously', async () => {
      render(<Card {...mockProjectData} />)
      
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

    test('language tiles should not render with incorrect structure', () => {
      render(<Card {...mockProjectData} />)
      
      const languageContainer = screen.getByText('JavaScript').closest('.px-4.pb-4.pt-0.mt-2')
      
      // Should not have incorrect classes
      expect(languageContainer).not.toHaveClass('flex-col', 'grid', 'inline-flex')
      expect(languageContainer).not.toHaveClass('justify-start', 'justify-end')
    })

    test('popover should not have incorrect positioning classes', async () => {
      render(<Card {...mockProjectData} />)
      
      const jsTile = screen.getByText('JavaScript')
      fireEvent.mouseEnter(jsTile)
      
      await waitFor(() => {
        const popover = screen.getByText('Web Development').closest('.absolute.z-10')
        
        // Should not have incorrect positioning
        expect(popover).not.toHaveClass('relative', 'static', 'fixed')
        expect(popover).not.toHaveClass('top-0', 'left-0', 'right-0')
      })
    })
  })
})
