import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DesignSystemProvider } from '@strapi/design-system';
// import '@strapi/design-system/styles';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DesignSystemProvider>
      <App />
    </DesignSystemProvider>
  </StrictMode>
);
