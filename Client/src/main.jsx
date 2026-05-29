import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import App from './app/App.jsx'

/**
 * Root entry point.
 * Wraps the entire application in the Redux Provider so that all components
 * have access to the global auth store.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
