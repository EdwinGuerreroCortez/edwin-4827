import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ThemeProvider applies the global Snail Racing design system */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline normalises browser defaults and applies MUI background */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
