import { render as rtlRender } from '@testing-library/react'
import { ThemeProvider } from '../../utils/context'
import { MemoryRouter } from 'react-router-dom'

export function render(ui, options) {
  function Wrapper({ children }) {
    return (
      <MemoryRouter {...options}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </MemoryRouter>
    )
  }
  rtlRender(ui, { wrapper: Wrapper })
}
