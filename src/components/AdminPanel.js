import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css'; // Make sure to create this CSS file

function AdminPanel() {
  const [activeGames, setActiveGames] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState('');

  useEffect(() => {
    fetchActiveGames();
    const interval = setInterval(fetchActiveGames, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchActiveGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/games/active');
      setActiveGames(response.data);
    } catch (error) {
      console.error('Error fetching active games:', error);
    }
  };

  const openConfirmModal = (gameId, outcome) => {
    setSelectedGame(gameId);
    setSelectedOutcome(outcome);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.post(`http://localhost:5000/api/games/${selectedGame}/${selectedOutcome}`);
      fetchActiveGames(); // Refresh the game list
      setModalOpen(false);
      
      // Send a message to the game page to refresh
      if (window.opener) {
        window.opener.postMessage({ type: 'REFRESH_GAME', gameId: selectedGame }, '*');
      }
    } catch (error) {
      console.error('Error setting game outcome:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h2 className='admin-style'>Admin Panel</h2>
      <div className="active-games">
        {activeGames.map((game) => (
          <div key={game._id} className="game-item">
            <span className='ID2'>Game ID: {game.gameId}</span>
            <span className='M2'>Mines: {game.mines}</span>
            
            <button className='userwin' onClick={() => openConfirmModal(game.gameId, 'win')}>Set Win</button>
            <button className='userloose1' onClick={() => openConfirmModal(game.gameId, 'lose')}>Set Lose</button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Action</h3>
            <p>Are you sure you want to set Game {selectedGame} to {selectedOutcome}?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleConfirm}>Confirm</button>
              <button className="cancel-btn" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;