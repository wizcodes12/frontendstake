import React from 'react';
import { Link } from 'react-router-dom';
// import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to Stake Mines Clone</h1>
      <Link to="/game" className="start-game-btn">Start Game</Link>
    </div>
  );
}

export default HomePage;