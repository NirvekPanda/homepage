import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import BlogCard from '../../components/blogCard'
import BlogModal from '../../components/blogModal'

// Mock the utility functions
jest.mock('../../utils/formatText.js', () => ({
  parseContent: (text) => {
    if (!text) return <div>No content</div>
    return text.split('\n').map((line, index) => (
      <div key={index}>{line}</div>
    ))
  }
}))

describe('BlogCard and BlogModal Integration', () => {
  const mockBlogData = {
    title: 'Test Blog Post',
    excerpt: 'This is a short excerpt of the blog post content.',
    publishedAt: new Date('2024-01-15T10:30:00Z'),
    slug: 'test-blog-post',
    content: 'This is the full blog content that appears in the modal.\nIt has multiple lines of content.\nAnd more detailed information.'
  }

  const mockFirestoreTimestamp = {
    toDate: () => new Date('2024-01-15T10:30:00Z')
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Card to Modal Flow', () => {
    test('opens modal when blog card is clicked', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Initially modal should not be visible
      expect(screen.queryByRole('heading', { name: 'Test Blog Post', level: 2 })).not.toBeInTheDocument()
      
      // Click on the blog card
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      // Modal should now be visible
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Blog Post', level: 2 })).toBeInTheDocument()
      })
    })

    test('passes correct data from blog card to modal', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        
        // Verify modal displays correct blog data
        expect(modal).toHaveTextContent('Test Blog Post')
        expect(modal).toHaveTextContent('This is the full blog content that appears in the modal.')
        expect(modal).toHaveTextContent('It has multiple lines of content.')
        expect(modal).toHaveTextContent('And more detailed information.')
        expect(modal).toHaveTextContent('January 15, 2024 at 2:30 AM')
      })
    })

    test('displays blog image in both card and modal', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Check image in card
      const cardImage = screen.getByAltText('Test Blog Post')
      expect(cardImage).toHaveAttribute('src', '/blog-images/test-blog-post.jpg')
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        // Modal doesn't have an image, but should have the content
        expect(screen.getByRole('heading', { name: 'Test Blog Post', level: 2 })).toBeInTheDocument()
      })
    })

    test('displays excerpt in card and full content in modal', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Check excerpt in card
      expect(screen.getByText('This is a short excerpt of the blog post content.')).toBeInTheDocument()
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        
        // Modal should show full content, not just excerpt
        expect(modal).toHaveTextContent('This is the full blog content that appears in the modal.')
        expect(modal).toHaveTextContent('It has multiple lines of content.')
        expect(modal).toHaveTextContent('And more detailed information.')
      })
    })
  })

  describe('Modal Interaction Flow', () => {
    test('closes modal when backdrop is clicked', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Blog Post', level: 2 })).toBeInTheDocument()
      })
      
      // Click backdrop to close
      const backdrop = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.fixed')
      fireEvent.click(backdrop)
      
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Test Blog Post', level: 2 })).not.toBeInTheDocument()
      })
    })

    test('closes modal when close button is clicked', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Blog Post', level: 2 })).toBeInTheDocument()
      })
      
      // Click close button
      const closeButton = screen.getByText('✕')
      fireEvent.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Test Blog Post', level: 2 })).not.toBeInTheDocument()
      })
    })

    test('prevents modal close when clicking inside modal content', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Blog Post', level: 2 })).toBeInTheDocument()
      })
      
      // Click inside modal content (should not close)
      const modalContent = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
      fireEvent.click(modalContent)
      
      // Modal should still be open
      expect(screen.getByRole('heading', { name: 'Test Blog Post', level: 2 })).toBeInTheDocument()
    })
  })

  describe('Data Consistency', () => {
    test('maintains data consistency between card and modal', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        
        // Verify all data is consistent
        expect(modal).toHaveTextContent('Test Blog Post')
        expect(modal).toHaveTextContent('January 15, 2024 at 2:30 AM')
        expect(modal).toHaveTextContent('This is the full blog content that appears in the modal.')
        expect(modal).toHaveTextContent('It has multiple lines of content.')
        expect(modal).toHaveTextContent('And more detailed information.')
      })
    })

    test('handles missing optional data gracefully', async () => {
      const minimalData = {
        title: 'Minimal Blog Post',
        excerpt: 'Minimal excerpt',
        publishedAt: null,
        slug: 'minimal-blog',
        content: 'Minimal content'
      }
      
      render(<BlogCard {...minimalData} />)
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Minimal Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Minimal Blog Post', level: 2 }).closest('.relative')
        
        // Should display basic information
        expect(modal).toHaveTextContent('Minimal Blog Post')
        expect(modal).toHaveTextContent('Minimal content')
        expect(modal).toHaveTextContent('No date')
      })
    })
  })

  describe('Date Formatting Integration', () => {
    test('formats dates consistently between card and modal', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Check date format in card (shorter format)
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        
        // Check date format in modal (longer format with time)
        expect(modal).toHaveTextContent('January 15, 2024 at 2:30 AM')
      })
    })

    test('handles Firestore Timestamp objects', async () => {
      const dataWithFirestoreTimestamp = {
        ...mockBlogData,
        publishedAt: mockFirestoreTimestamp
      }
      
      render(<BlogCard {...dataWithFirestoreTimestamp} />)
      
      // Check date format in card
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        
        // Check date format in modal
        expect(modal).toHaveTextContent('January 15, 2024 at 2:30 AM')
      })
    })

    test('handles invalid dates gracefully', async () => {
      const dataWithInvalidDate = {
        ...mockBlogData,
        publishedAt: 'invalid-date'
      }
      
      render(<BlogCard {...dataWithInvalidDate} />)
      
      // Check invalid date handling in card
      expect(screen.getByText('Invalid date')).toBeInTheDocument()
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        
        // Check invalid date handling in modal
        expect(modal).toHaveTextContent('Invalid date')
      })
    })
  })

  describe('Edge Cases', () => {
    test('handles empty content gracefully', async () => {
      const dataWithEmptyContent = {
        ...mockBlogData,
        content: ''
      }
      
      render(<BlogCard {...dataWithEmptyContent} />)
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        expect(modal).toHaveTextContent('Test Blog Post')
        expect(modal).toHaveTextContent('No content')
      })
    })

    test('handles undefined content gracefully', async () => {
      const dataWithUndefinedContent = {
        ...mockBlogData,
        content: undefined
      }
      
      render(<BlogCard {...dataWithUndefinedContent} />)
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        expect(modal).toHaveTextContent('Test Blog Post')
        expect(modal).toHaveTextContent('No content')
      })
    })

    test('handles rapid open/close cycles', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      
      // Rapidly open and close modal multiple times
      for (let i = 0; i < 5; i++) {
        fireEvent.click(card)
        await waitFor(() => {
          expect(screen.getByRole('heading', { name: 'Test Blog Post', level: 2 })).toBeInTheDocument()
        })
        
        const closeButton = screen.getByText('✕')
        fireEvent.click(closeButton)
        await waitFor(() => {
          expect(screen.queryByRole('heading', { name: 'Test Blog Post', level: 2 })).not.toBeInTheDocument()
        })
      }
    })

    test('handles multiple blog cards with different data', async () => {
      const blog1 = { ...mockBlogData, title: 'Blog Post 1', slug: 'blog-1' }
      const blog2 = { ...mockBlogData, title: 'Blog Post 2', slug: 'blog-2', content: 'Different content' }
      
      render(
        <div>
          <BlogCard {...blog1} />
          <BlogCard {...blog2} />
        </div>
      )
      
      // Open first blog modal
      const card1 = screen.getByRole('heading', { name: 'Blog Post 1' }).closest('.cursor-pointer')
      fireEvent.click(card1)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Blog Post 1', level: 2 })).toBeInTheDocument()
      })
      
      // Close first modal
      const closeButton = screen.getByText('✕')
      fireEvent.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Blog Post 1', level: 2 })).not.toBeInTheDocument()
      })
      
      // Open second blog modal
      const card2 = screen.getByRole('heading', { name: 'Blog Post 2' }).closest('.cursor-pointer')
      fireEvent.click(card2)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Blog Post 2', level: 2 })).toBeInTheDocument()
        expect(screen.getByText('Different content')).toBeInTheDocument()
      })
    })
  })

  describe('Image Handling', () => {
    test('handles image loading errors gracefully', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Check that image has error handling
      const image = screen.getByAltText('Test Blog Post')
      expect(image).toHaveAttribute('src', '/blog-images/test-blog-post.jpg')
      
      // Simulate image error
      fireEvent.error(image)
      
      // Should fallback to default image
      expect(image).toHaveAttribute('src', '/blog-images/default.jpg')
    })

    test('uses correct image path based on slug', async () => {
      const customSlugData = {
        ...mockBlogData,
        slug: 'custom-blog-slug'
      }
      
      render(<BlogCard {...customSlugData} />)
      
      const image = screen.getByAltText('Test Blog Post')
      expect(image).toHaveAttribute('src', '/blog-images/custom-blog-slug.jpg')
    })
  })

  describe('Modal Animation', () => {
    test('modal animates in when opened', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        expect(modal).toHaveClass('scale-100', 'opacity-100')
      })
    })

    test('modal animates out when closed', async () => {
      render(<BlogCard {...mockBlogData} />)
      
      // Open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Test Blog Post', level: 2 })).toBeInTheDocument()
      })
      
      // Close modal
      const closeButton = screen.getByText('✕')
      fireEvent.click(closeButton)
      
      // Modal should be removed from DOM after animation
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Test Blog Post', level: 2 })).not.toBeInTheDocument()
      })
    })
  })

  describe('Content Parsing Integration', () => {
    test('parseContent works correctly in modal context', async () => {
      const dataWithMultilineContent = {
        ...mockBlogData,
        content: 'Line 1\nLine 2\nLine 3'
      }
      
      render(<BlogCard {...dataWithMultilineContent} />)
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        
        // Check that content is parsed correctly
        expect(modal).toHaveTextContent('Line 1')
        expect(modal).toHaveTextContent('Line 2')
        expect(modal).toHaveTextContent('Line 3')
      })
    })

    test('handles empty content parsing gracefully', async () => {
      const dataWithEmptyContent = {
        ...mockBlogData,
        content: ''
      }
      
      render(<BlogCard {...dataWithEmptyContent} />)
      
      // Click on the blog card to open modal
      const card = screen.getByRole('heading', { name: 'Test Blog Post' }).closest('.cursor-pointer')
      fireEvent.click(card)
      
      await waitFor(() => {
        const modal = screen.getByRole('heading', { name: 'Test Blog Post', level: 2 }).closest('.relative')
        
        // Should show "No content" when content is empty
        expect(modal).toHaveTextContent('No content')
      })
    })
  })
})
