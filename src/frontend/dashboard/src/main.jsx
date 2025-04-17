import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SettingsProvider } from './context/SettingsContext.jsx'
import './index.css'
import App from './App.jsx'
import 'jquery';
import 'bootstrap';
import 'admin-lte';
import 'admin-lte/dist/css/adminlte.min.css';

createRoot(document.getElementById('root')).render(
  <SettingsProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </SettingsProvider>,
)
