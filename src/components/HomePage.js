import React from 'react';
import { Link } from 'react-router-dom';
// import './App.css'; // Make sure to import your CSS file

function HomePage() {
  return (
    
    <div>
      
      <h1 className="sliding-text">Welcome to AquaMines💎</h1>
        <div id='middle'>
          <Link to="/game" className="start-game-btn1">Start Game</Link>
        </div>
        
 
      
        {/* <h6 className="footer">WizCodes © 2024</h6> */}
    </div>
    
  );
}

export default HomePage;
