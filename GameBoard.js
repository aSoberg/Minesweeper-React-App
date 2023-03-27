import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Cell from './Cell';

const GameBoard = ({ size, bombCount }) => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  // Create a new game board with the specified size and bomb count
  const newGame = () => {
    const newBoard = Array(size)
      .fill()
      .map(() => Array(size).fill({ value: 0, revealed: false, flagged: false }));

    // Add bombs to the board
    for (let i = 0; i < bombCount; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);
      } while (newBoard[x][y].value === -1);
      newBoard[x][y].value = -1;
    }

    // Calculate the number of adjacent bombs for each non-bomb cell
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (newBoard[x][y].value !== -1) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (x + i >= 0 && x + i < size && y + j >= 0 && y + j < size && newBoard[x + i][y + j].value === -1) {
                count++;
              }
            }
          }
          newBoard[x][y].value = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setWin(false);
  };

  // Reveal all cells when the game is over
  useEffect(() => {
    if (gameOver) {
      setBoard(board.map(row => row.map(cell => ({ ...cell, revealed: true }))));
    }
  }, [gameOver]);

  // Check if the game has been won
  useEffect(() => {
    if (!gameOver && board.every(row => row.every(cell => cell.revealed || cell.value === -1))) {
      setGameOver(true);
      setWin(true);
    }
  }, [board]);

  // Handle a cell click
  const handleCellClick = (x, y) => {
    if (gameOver || board[x][y].flagged || board[x][y].revealed) {
      return;
    }

    const newBoard = [...board];
    newBoard[x][y].revealed = true;

    if (board[x][y].value === -1) {
      setGameOver(true);
    } else if (board[x][y].value === 0) {
      // Recursive reveal of adjacent cells when the clicked cell has no adjacent bombs
      const reveal = (x, y) => {
        if (x < 0 || x >= size || y < 0 || y >= size || newBoard[x][y].revealed || newBoard[x][y].flagged) {
          return;
        }
        newBoard[x][y].revealed = true;
        if (newBoard[x][y].value === 0) {
          reveal(x - 1, y - 1);
          reveal(x - 1, y);
          reveal(x - 1, y + 1);
          reveal(x, y - 1);
          reveal(x, y + 1);
          reveal(x + 1, y - 1);
          reveal(x + 1, y);
          reveal(x + 1, y + 1);
        }
      };
      reveal(x, y);
    }

    setBoard(newBoard);
  };

  // Handle a cell long press to toggle flagging
  const handleCellLongPress = (x, y) => {
    if (gameOver) {
      return;
    }

    const newBoard = [...board];
    newBoard[x][y].flagged = !newBoard[x][y].flagged;
    setBoard(newBoard);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{gameOver ? (win ? 'You win!' : 'You lose!') : 'Playing'}</Text>
      <View style={styles.board}>
        {board.map((row, x) =>
          row.map((cell, y) => (
            <Cell
              key={`${x}-${y}`}
              value={cell.value}
              revealed={cell.revealed}
              flagged={cell.flagged}
              onPress={() => handleCellClick(x, y)}
              onLongPress={() => handleCellLongPress(x, y)}
            />
          ))
        )}
      </View>
      <Button title="New Game" onPress={newGame} />
    </View>
  );
}
