import React, { useState } from "react";

// Every visible string lives here so it can be matched to the design images in one place.
const TEXT = {
  title: "Tic-Tac-Toe",
  next: (p) => `Next player: ${p}`,
  winner: (p) => `Winner: ${p}`,
  draw: "It's a draw!",
  restartRound: "Restart Round",
  resetAll: "Reset All",
};

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function findWinner(board) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }
  return null;
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const win = findWinner(board);
  const full = board.every(Boolean);

  const play = (i) => {
    if (board[i] || win) return;
    const player = xTurn ? "X" : "O";
    const next = board.map((v, idx) => (idx === i ? player : v));
    setBoard(next);
    setXTurn(!xTurn);

    // Record the result once, at the moment the round ends.
    if (findWinner(next)) {
      setScores((sc) => ({ ...sc, [player]: sc[player] + 1 }));
    } else if (next.every(Boolean)) {
      setScores((sc) => ({ ...sc, draws: sc.draws + 1 }));
    }
  };

  const restartRound = () => {
    setBoard(Array(9).fill(null));
    setXTurn(true);
  };

  const resetAll = () => {
    restartRound();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const status = win ? TEXT.winner(win.player) : full ? TEXT.draw : TEXT.next(xTurn ? "X" : "O");

  return (
    <main className="app">
      <h1>{TEXT.title}</h1>

      <div className="scores">
        <span className="score">{`X: ${scores.X}`}</span>
        <span className="score">{`Draws: ${scores.draws}`}</span>
        <span className="score">{`O: ${scores.O}`}</span>
      </div>

      <p className="status" role="status">{status}</p>

      <div className="board">
        {board.map((value, i) => (
          <button
            type="button"
            key={i}
            className={`square${win && win.line.includes(i) ? " win" : ""}`}
            aria-label={`Square ${i + 1}${value ? `, ${value}` : ""}`}
            onClick={() => play(i)}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="controls">
        <button type="button" className="reset" onClick={restartRound}>{TEXT.restartRound}</button>
        <button type="button" className="reset secondary" onClick={resetAll}>{TEXT.resetAll}</button>
      </div>
    </main>
  );
}
