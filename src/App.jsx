import React from 'react';
import TextPage from './pages/TextPage';
import { UIProvider } from './context/UIContext';

function App() {
  return (
    <UIProvider>
      <TextPage />
    </UIProvider>
  );
}

export default App;
