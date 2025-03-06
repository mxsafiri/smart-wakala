import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from './components/common/ErrorBoundary';

// Add console logging to help debug
console.log('Environment variables loaded:', {
  nodeEnv: process.env.NODE_ENV,
  hasFirebaseConfig: !!process.env.REACT_APP_FIREBASE_API_KEY
});

// Error handler for React 18's new root API
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Render the app with error handling
const renderApp = () => {
  try {
    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <Provider store={store}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    // Render a fallback UI if the main app fails to render
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; background-color: #f7fafc; padding: 20px;">
          <div style="background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 500px; width: 100%;">
            <h1 style="color: #e53e3e; margin-bottom: 1rem;">Something went wrong</h1>
            <p style="color: #4a5568; margin-bottom: 1rem;">
              We encountered an error while loading the application. Please try refreshing the page.
            </p>
            <p style="color: #718096; font-size: 0.875rem; margin-bottom: 1rem;">
              Error details: ${error instanceof Error ? error.message : String(error)}
            </p>
            <button onclick="window.location.reload()" style="background-color: #4299e1; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; border: none; cursor: pointer;">
              Refresh Page
            </button>
          </div>
        </div>
      `;
    }
  }
};

renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
