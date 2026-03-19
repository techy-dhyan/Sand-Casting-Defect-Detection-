import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="app-container">
      <header className="app-header animate-fade-in">
        <h1 className="main-title text-gradient">
          Smart Foundry AI System
        </h1>
        <p className="subtitle">
          AI-powered predictive and automated inspection system for Industry 4.0 manufacturing.
        </p>
      </header>
      
      <main className="app-main animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
