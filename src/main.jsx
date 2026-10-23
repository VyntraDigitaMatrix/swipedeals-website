import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { WishlistProvider } from './hooks/useWishlist'
import { NotificationProvider } from './hooks/useNotifications'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <WishlistProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </WishlistProvider>
    </BrowserRouter>
  </StrictMode>,
)
