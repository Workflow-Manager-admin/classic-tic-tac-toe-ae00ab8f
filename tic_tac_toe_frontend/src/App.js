import React, { useState, useEffect } from 'react';
import './App.css';

// Themed color palette (from environment if available, otherwise fallback to defaults)
const PRIMARY = process.env.REACT_APP_PRIMARY_COLOR || "#1976D2";
const SECONDARY = process.env.REACT_APP_SECONDARY_COLOR || "#E3F2FD";
const ACCENT = process.env.REACT_APP_ACCENT_COLOR || "#FFC107";

// PUBLIC_INTERFACE
function App() {
  // Board: Array of 9 strings: '' or 'X' or 'O'
  const [board, setBoard] = useState(Array(9).fill(''));
  // 'X' starts
  const [nextPlayer, setNextPlayer] = useState('X');
  // null (no winner) | 'X' | 'O' | 'draw'
  const [winner, setWinner] = useState(null);
  // For simple move animation: index of last moved cell
  const [lastMove, setLastMove] = useState(null);

  // PUBLIC_INTERFACE
  function getStatusMessage() {
    if (winner === 'draw') return "It's a Draw!";
    if (winner) return `Winner: ${winner}`;
    return `Next Player: ${nextPlayer}`;
  }

  // PUBLIC_INTERFACE
  function checkWinner(board) {
    // All win lines: horizontal, vertical, diagonal
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diags
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    // No winner -- check for draw
    if (board.every(cell => cell)) return "draw";
    return null;
  }

  // Handle a cell click
  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    if (board[idx] || winner) return; // no move if occupied or game over
    const newBoard = [...board];
    newBoard[idx] = nextPlayer;
    setBoard(newBoard);
    setNextPlayer(nextPlayer === 'X' ? 'O' : 'X');
    setLastMove(idx);
    // Will be checked in useEffect below for smoothness (after DOM update)
  }

  // When board updates, check for win/draw
  useEffect(() => {
    const gameResult = checkWinner(board);
    setWinner(gameResult);
  }, [board]);

  // Restart game
  // PUBLIC_INTERFACE
  function restartGame() {
    setBoard(Array(9).fill(''));
    setNextPlayer('X');
    setWinner(null);
    setLastMove(null);
  }

  // Set up palette as CSS vars
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', PRIMARY);
    document.documentElement.style.setProperty('--secondary', SECONDARY);
    document.documentElement.style.setProperty('--accent', ACCENT);
  }, []);

  // Draw cell
  function Cell({ value, onClick, highlight }) {
    return (
      <button
        className={`ttt-cell${highlight ? " move-highlight" : ""}`}
        onClick={onClick}
        tabIndex={0}
        aria-label={value ? `Cell occupied by ${value}` : "Empty cell"}
      >
        {value}
      </button>
    );
  }

  return (
    <div className="ttt-root">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div className="ttt-status" data-testid="game-status">{getStatusMessage()}</div>
      <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
        {board.map((val, idx) => (
          <Cell
            key={idx}
            value={val}
            onClick={() => handleCellClick(idx)}
            highlight={idx === lastMove}
          />
        ))}
      </div>
      <div className="ttt-controls">
        <button
          className="ttt-restart-btn"
          onClick={restartGame}
          aria-label="Restart game"
        >
          Restart
        </button>
      </div>
      <footer className="ttt-footer">
        <span>
          <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Built with React</a>
        </span>
      </footer>
    </div>
  );
}

export default App;
