import React, { Suspense, lazy } from 'react';
import './App.css';
import Home from './components/homepage/Home';

// Lazy load the MorseCode component
const MorseCode = lazy(() => import('./components/morse/Morse'));

function App() {
  return (
    <div className="App">
      <Home />
      <Suspense fallback={<div>Loading Morse Code Component...</div>}>
        <MorseCode />
      </Suspense>
    </div>
  );
}

export default App;
