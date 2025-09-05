import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Card from '../../components/card'
import CardModal from '../../components/cardModal'

// Mock the utility functions
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

describe('Card and CardModal Integration', () => {
  const mockProjectData = {
    name: 'Test Project',
    description: 'This is a test project description.\nIt has multiple lines of content.',
    languages: 'JavaScript, React, Node.js',
    image: '/test-image.jpg',
    link: 'https://demo.example.com',
    date: 'January 2024',
    code: true,
    github: 'https://github.com/test/project',
    demo: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Card to Modal Flow', () => {
    test('opens modal when card is clicked', async () => {
      render(<Card {...mockProjectData} />)
      
      // Initially modal should not be visible
      expect(screen.queryByRole('heading', { name: 'Test Project', level: 2 })).not.toBeInTheDocument()
      
      // Click on the card
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      // Modal should now be visible
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Project', level: 2 })).toBeInTheDocument()
      })
    })

    test('passes correct data from card to modal', async () => {
      render(<Card {...mockProjectData} />)
      
      // Click on the card to open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')
        
        // Verify modal displays correct project data
        expect(modal).toHaveTextContent('Test Project')
        expect(modal).toHaveTextContent('This is a test project description.')
        expect(modal).toHaveTextContent('It has multiple lines of content.')
        expect(modal).toHaveTextContent('January 2024')
      })
    })

    test('displays language tiles in both card and modal', async () => {
      render(<Card {...mockProjectData} />)
      
      // Check language tiles in card
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      
      // Click on the card to open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        // Check language tiles in modal
        const modal = screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')
        expect(modal).toHaveTextContent('JavaScript')
        expect(modal).toHaveTextContent('React')
        expect(modal).toHaveTextContent('Node.js')
      })
    })

    test('displays buttons in both card and modal', async () => {
      render(<Card {...mockProjectData} />)
      
      // Check buttons in card
      expect(screen.getByText('Demo')).toBeInTheDocument()
      expect(screen.getByText('Code')).toBeInTheDocument()
      
      // Click on the card to open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        // Check buttons in modal
        expect(screen.getByText('Example')).toBeInTheDocument()
        expect(screen.getByText('GitHub')).toBeInTheDocument()
      })
    })
  })

  describe('Modal Interaction Flow', () => {
    test('closes modal when backdrop is clicked', async () => {
      render(<Card {...mockProjectData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')).toBeInTheDocument()
      })
      
      // Click backdrop to close
      const backdrop = screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.fixed')
      fireEvent.click(backdrop)
      
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Test Project', level: 2 })).not.toBeInTheDocument()
      })
    })

    test('closes modal when close button is clicked', async () => {
      render(<Card {...mockProjectData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')).toBeInTheDocument()
      })
      
      // Click close button
      const closeButton = screen.getByText('✕')
      fireEvent.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Test Project', level: 2 })).not.toBeInTheDocument()
      })
    })

    test('prevents modal close when clicking inside modal content', async () => {
      render(<Card {...mockProjectData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')).toBeInTheDocument()
      })
      
      // Click inside modal content (should not close)
      const modalContent = screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')
      fireEvent.click(modalContent)
      
      // Modal should still be open
      expect(screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')).toBeInTheDocument()
    })
  })

  describe('Data Consistency', () => {
    test('maintains data consistency between card and modal', async () => {
      render(<Card {...mockProjectData} />)
      
      // Click on the card to open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')
        
        // Verify all data is consistent
        expect(modal).toHaveTextContent('Test Project')
        expect(modal).toHaveTextContent('January 2024')
        expect(modal).toHaveTextContent('This is a test project description.')
        expect(modal).toHaveTextContent('It has multiple lines of content.')
        
        // Verify language tiles are consistent
        expect(modal).toHaveTextContent('JavaScript')
        expect(modal).toHaveTextContent('React')
        expect(modal).toHaveTextContent('Node.js')
      })
    })

    test('handles missing optional data gracefully', async () => {
      const minimalData = {
        name: 'Minimal Project',
        description: 'Minimal description',
        languages: 'JavaScript',
        image: '',
        link: '',
        date: '',
        code: false,
        github: '',
        demo: false
      }
      
      render(<Card {...minimalData} />)
      
      // Click on the card to open modal
      const card = screen.getByRole('heading', { name: 'Minimal Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Minimal Project', level: 2 }).closest('.relative')
        
        // Should display basic information
        expect(modal).toHaveTextContent('Minimal Project')
        expect(modal).toHaveTextContent('Minimal description')
        expect(modal).toHaveTextContent('JavaScript')
        
        // Should not display buttons when demo/code are false
        expect(screen.queryByText('Demo')).not.toBeInTheDocument()
        expect(screen.queryByText('Code')).not.toBeInTheDocument()
        expect(screen.queryByText('Example')).not.toBeInTheDocument()
        expect(screen.queryByText('GitHub')).not.toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    test('handles empty languages string', async () => {
      const dataWithEmptyLanguages = {
        ...mockProjectData,
        languages: ''
      }
      
      render(<Card {...dataWithEmptyLanguages} />)
      
      // Click on the card to open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')
        expect(modal).toHaveTextContent('Test Project')
        // Should not crash with empty languages
      })
    })

    test('handles undefined description', async () => {
      const dataWithUndefinedDescription = {
        ...mockProjectData,
        description: undefined
      }
      
      render(<Card {...dataWithUndefinedDescription} />)
      
      // Click on the card to open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')
        expect(modal).toHaveTextContent('Test Project')
        // Should handle undefined description gracefully
      })
    })

    test('handles rapid open/close cycles', async () => {
      render(<Card {...mockProjectData} />)
      
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      
      // Rapidly open and close modal multiple times
      for (let i = 0; i < 5; i++) {
        fireEvent.click(card)
        await waitFor(() => {
          expect(screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')).toBeInTheDocument()
        })
        
        const closeButton = screen.getByText('✕')
        fireEvent.click(closeButton)
        await waitFor(() => {
          expect(screen.queryByRole('heading', { name: 'Test Project', level: 2 })).not.toBeInTheDocument()
        })
      }
    })

    test('handles multiple cards with different data', async () => {
      const project1 = { ...mockProjectData, name: 'Project 1' }
      const project2 = { ...mockProjectData, name: 'Project 2', languages: 'Python, Django' }
      
      render(
        <div>
          <Card {...project1} />
          <Card {...project2} />
        </div>
      )
      
      // Open first project modal
      const card1 = screen.getByRole('heading', { name: 'Project 1' }).closest('.cursor-pointer')
      fireEvent.click(card1)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Project 1', level: 2 })).toBeInTheDocument()
      })
      
      // Close first modal
      const closeButton = screen.getByText('✕')
      fireEvent.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Project 1', level: 2 })).not.toBeInTheDocument()
      })
      
      // Open second project modal
      const card2 = screen.getByRole('heading', { name: 'Project 2' }).closest('.cursor-pointer')
      fireEvent.click(card2)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Project 2', level: 2 }).closest('.relative')
        expect(modal).toBeInTheDocument()
        expect(modal).toHaveTextContent('Python')
        expect(modal).toHaveTextContent('Django')
      })
    })
  })

  describe('Button Interaction', () => {
    test('prevents card click when clicking on buttons', async () => {
      render(<Card {...mockProjectData} />)
      
      // Click on Demo button (should not open modal)
      const demoButton = screen.getByText('Demo')
      fireEvent.click(demoButton)
      
      // Modal should not be open
      expect(screen.queryByRole('heading', { name: 'Test Project', level: 2 })).not.toBeInTheDocument()
      
      // Click on Code button (should not open modal)
      const codeButton = screen.getByText('Code')
      fireEvent.click(codeButton)
      
      // Modal should not be open
      expect(screen.queryByRole('heading', { name: 'Test Project', level: 2 })).not.toBeInTheDocument()
    })

    test('prevents modal close when clicking on modal buttons', async () => {
      render(<Card {...mockProjectData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')).toBeInTheDocument()
      })
      
      // Click on modal buttons (should not close modal)
      const exampleButton = screen.getByText('Example')
      fireEvent.click(exampleButton)
      
      // Modal should still be open
      expect(screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')).toBeInTheDocument()
      
      const githubButton = screen.getByText('GitHub')
      fireEvent.click(githubButton)
      
      // Modal should still be open
      expect(screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')).toBeInTheDocument()
    })
  })

  describe('Modal Animation', () => {
    test('modal animates in when opened', async () => {
      render(<Card {...mockProjectData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')
        expect(modal).toHaveClass('scale-100', 'opacity-100')
      })
    })

    test('modal animates out when closed', async () => {
      render(<Card {...mockProjectData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Project' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Project', level: 2 }).closest('.relative')).toBeInTheDocument()
      })
      
      // Close modal
      const closeButton = screen.getByText('✕')
      fireEvent.click(closeButton)
      
      // Modal should be removed from DOM after animation
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Test Project', level: 2 })).not.toBeInTheDocument()
      })
    })
  })
})
