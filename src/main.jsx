import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.jsx'

const app = (
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
const root = document.getElementById('root');
if (root.dataset.prerendered) hydrateRoot(root, app);
else createRoot(root).render(app);
