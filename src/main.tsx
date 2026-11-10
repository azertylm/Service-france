import '../static/staticApi';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {AppShell} from '@alphabette/shell';
import '@alphabette/shell/style.css';
import App from './App.tsx';
import './index.css';

/** Identité de l'application dans la double barre Alphabette (DON, BIG…). */
const APP = {
  key: 'france-service',
  name: 'Service France',
  tagline: 'Vos papiers et vos démarches, expliqués simplement',
  accent: '#1d4ed8',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppShell app={APP}>
      <App />
    </AppShell>
  </StrictMode>,
);
