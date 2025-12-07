// ============================================
// Application Entry Point
// Wraps app with providers for global state
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ErrorBoundary } from './components/index.js';
import { ToastProvider, ConfigProvider, ModalProvider } from './context/index.js';

/**
 * AppProviders - Wraps the app with all necessary context providers
 * Order matters: innermost providers can access outer ones
 */
const AppProviders = ({ children }) => (
  <ConfigProvider>
    <ToastProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </ToastProvider>
  </ConfigProvider>
);

/**
 * Root application with error boundary and providers
 */
const Root = () => (
  <React.StrictMode>
    <AppProviders>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AppProviders>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
