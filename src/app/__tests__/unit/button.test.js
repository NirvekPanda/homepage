import { render, screen } from '@testing-library/react'
import LinkButton from '../../components/button'

describe('LinkButton Component', () => {
  test('renders with text and link', () => {
    render(<LinkButton text="Test Button" link="/test" />)
    
    const button = screen.getByRole('link', { name: 'Test Button' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/test')
  })

  test('applies active styling when isActive is true', () => {
    render(<LinkButton text="Active Button" link="/active" isActive={true} />)
    
    const button = screen.getByRole('link', { name: 'Active Button' })
    expect(button).toHaveClass('bg-[#F5ECD5]', 'text-gray-900', 'shadow-lg')
  })

  test('applies inactive styling when isActive is false', () => {
    render(<LinkButton text="Inactive Button" link="/inactive" isActive={false} />)
    
    const button = screen.getByRole('link', { name: 'Inactive Button' })
    expect(button).toHaveClass('bg-slate-700/50', 'text-gray-300')
  })

  test('applies custom className', () => {
    render(<LinkButton text="Custom Button" link="/custom" className="custom-class" />)
    
    const button = screen.getByRole('link', { name: 'Custom Button' })
    expect(button).toHaveClass('custom-class')
  })
})
