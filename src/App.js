import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/wizard" element={<AdminPanelRoute />} />
        </Routes>
      </div>
    </Router>
  );
}

function AdminPanelRoute() {
  const hash = window.location.hash;
  if (hash === '#1293') {
    return <AdminPanel />;
  } else {
    return <Navigate to="/" />;
  }
}

export default App;