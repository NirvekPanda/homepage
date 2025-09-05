const { render } = require('@testing-library/react')

describe('Jest Setup', () => {
  test('Testing environment is working', () => {
    expect(render).toBeDefined()
  })
})
