import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import Cell from './Cell';

const createGrid = (width, height, bombCount) => {
  let grid = [];
  for (let y = 0; y < height; y++) {
    let row = [];
    for (let x = 0; x < width; x++) {
      row.push({ value: 0, revealed: false, flagged: false });
    }
    grid.push(row);
  }

  let bombs = 0;
  while (bombs < bombCount) {
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);

    if (grid[y][x].value === 0) {
      grid[y][x].value = -1;
      bombs++;

      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        for (let xOffset = -1; xOffset <= 1; xOffset++) {
          if (
            x + xOffset >= 0 &&
            x + xOffset < width &&
            y + yOffset >= 0 &&
            y + yOffset < height
          ) {
            let cell = grid[y + yOffset][x + xOffset];
            if (cell.value !== -1) {
              cell.value++;
            }
          }
        }
      }
    }
  }

  return grid;
};

const countFlags = (grid) => {
  let count = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.flagged) {
        count++;
      }
    });
  });
  return count;
};

const GameBoard = ({ navigation, route }) => {
  const { width, height, bombCount } = route.params;
  const [gameState, setGameState] = useState('ongoing'); // possible values: 'ongoing', 'won', 'lost'
  const [grid, setGrid] = useState(createGrid(width, height, bombCount));

  const handleCellClick = (x, y) => {
    if (grid[y][x].flagged || grid[y][x].revealed || gameState !== 'ongoing') {
      return;
    }

    let newGrid = [...grid];
    let cell = newGrid[y][x];

    if (cell.value === -1) {
      setGameState('lost');
      newGrid[y][x].revealed = true;
      setGrid(newGrid);
      navigation.navigate('GameLost');
      return;
    }

    revealCell(newGrid, x, y);

    if (checkWin(newGrid)) {
      setGameState('won');
      navigation.navigate('GameWon');
    }

   // setGrid(newGrid);
  };

  const handleCellLongPress = (x, y) => {
    if (gameState !== 'ongoing') {
      return;
    }

    let newGrid = [...grid];
    newGrid[y][x].flagged = !newGrid[y][x].flagged;
    setGrid(newGrid);
  };

  const revealCell = (grid, col, row) => {
  if (row < 0 || row >= this.height - 1 || col < 0 || col >= this.width - 1) {
    // Cell is out of bounds, so do nothing
    return;
  }

  const cell = grid[row][col];
  if (cell.revealed || cell.flagged || cell.value === -1) {
    // Cell is already revealed or flagged or contains a bomb, so do nothing
    return;
  }

  // Reveal the cell
  const newGrid = [...grid];
  newGrid[row][col].revealed = true;
  setGrid(newGrid);

  // If the cell is empty, reveal its neighbors
  if (cell.value === 0) {
    revealCell(grid, row - 1, col - 1);
    revealCell(grid, row - 1, col);
    revealCell(grid, row - 1, col + 1);
    revealCell(grid, row, col - 1);
    revealCell(grid, row, col + 1);
    revealCell(grid, row + 1, col - 1);
    revealCell(grid, row + 1, col);
    revealCell(grid, row + 1, col + 1);
  }
};


  checkWin = () => {
        let revealedCount = 0;
        let bombCount = 0;

        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.height; j++) {
            if (this.grid[i][j].revealed) {
              revealedCount++;
            }
            if (this.grid[i][j].value === -1) {
              bombCount++;
            }
          }
        }

        if (revealedCount === this.gridSize ** 2 - bombCount) {
          return true;
//          this.showBombs();
          alert("You won!");
        }
    }


  const renderCell = (x, y) => {
    let cell = grid[y][x];
    return (
      <Cell
        key={x + ',' + y}
        value={cell.value}
        revealed={cell.revealed}
        flagged={cell.flagged}
        onPress={() => handleCellClick(x, y)}
        onLongPress={() => handleCellLongPress(x, y)}
      />
    );
  };

  const renderRow = (y) => {
    let cells = [];
    for (let x = 0; x < width; x++) {
      cells.push(renderCell(x, y));
    }
    return (
      <View key={y} style={styles.row}>
        {cells}
      </View>
    );
  };

  const resetGame = () => {
    setGameState('ongoing');
    setGrid(createGrid(width, height, bombCount));
  };

  return (
    <View style={styles.container}>
      {grid.map((row, y) => renderRow(y))}
      <View style={styles.footer}>
        <View style={styles.status}>
          {gameState === 'ongoing' ? (
            <Text>{`Flags left: ${bombCount - countFlags(grid)}`}</Text>
          ) : gameState === 'won' ? (
            <Text>You won!</Text>
          ) : (
            <Text>You lost!</Text>
          )}
        </View>
        <View style={styles.button}>
          <Button title="Reset" onPress={resetGame} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  status: {
    flex: 1,
    alignItems: 'flex-start',
  },
  button: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default GameBoard;
