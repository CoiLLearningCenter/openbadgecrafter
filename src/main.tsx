// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'   // <- this must point to App.tsx

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
