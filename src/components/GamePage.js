import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import imageA from './blue.png'; // Replace with your image path
import imageB from './bomb.png'; // Replace with your image path

function GamePage() {
  const [mines, setMines] = useState('');
  const [gameId, setGameId] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [adminOutcome, setAdminOutcome] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showTimer, setShowTimer] = useState(false); // Timer visibility
  const [timer, setTimer] = useState(7); // 7 seconds countdown
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setGameId(id);
      setGameStarted(true);
      loadGame(id);
    }
  }, [location]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        checkAdminOutcome();
      }, 1000); // Check every second
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameId]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'REFRESH_GAME' && event.data.gameId === gameId) {
        loadGame(gameId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [gameId]);

  useEffect(() => {
    if (showTimer) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000); // Update every second

      if (timer === 0) {
        clearInterval(interval);
        navigate('/');
      }

      return () => clearInterval(interval);
    }
  }, [showTimer, timer, navigate]);

  const loadGame = async (id) => {
    try {
      const response = await axios.get(`https://wiz-stake-apibackend.vercel.app/${id}`);
      setMines(response.data.mines);
      initializeGrid(response.data.mines);
      setAdminOutcome(response.data.adminOutcome);
    } catch (error) {
      console.error('Error loading game:', error);
    }
  };

  const checkAdminOutcome = async () => {
    try {
      const response = await axios.get(`https://wiz-stake-apibackend.vercel.app/${gameId}`);
      if (response.data.adminOutcome !== adminOutcome) {
        setAdminOutcome(response.data.adminOutcome);
      }
    } catch (error) {
      console.error('Error checking admin outcome:', error);
    }
  };

  const generateGameId = async () => {
    try {
      const response = await axios.post('https://wiz-stake-apibackend.vercel.app/', { mines: parseInt(mines) });
      setGameId(response.data.gameId);
      navigate(`/game?id=${response.data.gameId}`);
      initializeGrid(parseInt(mines));
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const initializeGrid = (minesCount) => {
    const newGrid = Array(25).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
    }));

    // Place mines randomly
    let minesToPlace = minesCount;
    while (minesToPlace > 0) {
      const randomIndex = Math.floor(Math.random() * 25);
      if (!newGrid[randomIndex].isMine) {
        newGrid[randomIndex].isMine = true;
        minesToPlace--;
      }
    }

    setGrid(newGrid);
  };

  const handleCellClick = (index) => {
    if (gameOver || win || grid[index].isRevealed) return;

    const newGrid = [...grid];
    newGrid[index].isRevealed = true;
    setGrid(newGrid);

    if (adminOutcome === 'win') {
      setRevealedCount(prev => prev + 1);
      if (revealedCount + 1 === 25 - mines) {
        setWin(true);
        setShowTimer(true); // Show timer on win
      }
    } else if (adminOutcome === 'lose') {
      setGameOver(true);
      setShowTimer(true); // Show timer on lose
    } else {
      if (newGrid[index].isMine) {
        setGameOver(true);
        setShowTimer(true); // Show timer on hitting a mine
      } else {
        setRevealedCount(prev => prev + 1);
        if (revealedCount + 1 === 25 - mines) {
          setWin(true);
          setShowTimer(true); // Show timer on win
        }
      }
    }
  };

  const handleStartGame = () => {
    if (mines && mines > 0 && mines < 25) {
      setGameStarted(true);
      generateGameId();
    } else {
      alert('Please enter a valid number of mines (1-24)');
    }
  };

  const handleEndGame = async () => {
    try {
      await axios.post(`https://wiz-stake-apibackend.vercel.app/${gameId}/end`);
      navigate('/');
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const getCellImage = (cell) => {
    if (!cell.isRevealed) return '';
    if (adminOutcome === 'win') return imageA; // Image A for win condition
    if (adminOutcome === 'lose') return imageB; // Image B for lose condition
    return cell.isMine ? imageB : imageA; // Update as needed
  };

  return (
    <div className="game-page">
      {!gameStarted ? (
        <div className="game-setup">
          <h2 className='start-t'>Set up your game</h2>
          <input
            type="number"
            value={mines}
            onChange={(e) => setMines(e.target.value)}
            placeholder="Number of mines (1-24)"
            min="1"
            max="24"
          />
          {/* <div id='middle'>
          <Link to="/game" className="start-game-btn1">Start Game</Link>
          </div> */}
          <button className="start-g"onClick={handleStartGame}>Start Game</button>
        </div>
      ) : showTimer ? (
        <div className="countdown">
          <div className="countdown-messagetest">
            {win ? 'Congratulations! You won!' : 'Game Over! You hit a mine.'}
          </div>
          <div className="countdown-timertest">Redirecting to home page in {timer} seconds...</div>
        </div>
      ) : (
        <div className="game-board">
          <h2 className='ID1'>Game ID: {gameId}</h2>
          <div className="grid">
            {grid.map((cell, index) => (
              <div
                key={index}
                className="cell"
                style={{ backgroundImage: `url(${getCellImage(cell)})` }}
                onClick={() => handleCellClick(index)}
              ></div>
            ))}
          </div>
          <button onClick={handleEndGame} className="end-game-btn1">End Game</button>
        </div>
      )}
    </div>
  );
}

export default GamePage;
