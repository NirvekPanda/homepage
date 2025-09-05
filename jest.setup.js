require('@testing-library/jest-dom')

// // Suppress jsdom navigation warnings and React act warnings
// const originalError = console.error
// console.error = (...args) => {
//   const firstArg = args[0]
//   let message = ''
  
//   if (typeof firstArg === 'string') {
//     message = firstArg
//   } else if (firstArg && firstArg.message) {
//     message = firstArg.message
//   } else if (firstArg && firstArg.type === 'not implemented') {
//     message = 'Not implemented: navigation'
//   }
  
//   if (message.includes('Not implemented: navigation') || 
//       message.includes('navigation (except hash changes)') ||
//       message.includes('An update to ImageCarousel inside a test was not wrapped in act') ||
//       message.includes('was not wrapped in act')) {
//     return
//   }
//   originalError.call(console, ...args)
// }

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Firebase
jest.mock('./src/app/firebaseConfig', () => ({
  auth: { onAuthStateChanged: jest.fn() },
  googleProvider: {},
  firestore: {},
  db: {},
}))
