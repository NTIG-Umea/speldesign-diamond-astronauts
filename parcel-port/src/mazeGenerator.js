import gameOptions from 'gameOptions';
import Phaser from 'phaser';

export default function () {
  let moves = [];
  let maze = [];
  for (let i = 0; i < gameOptions.mazeHeight; i++) {
    maze[i] = [];
    for (let j = 0; j < gameOptions.mazeWidth; j++) {
      maze[i][j] = 1;
    }
  }
  let posY = gameOptions.mazeStartingX;
  let posX = gameOptions.mazeStartingY;
  maze[posY][posX] = 0;
  moves.push(posX + posX * gameOptions.mazeWidth);
  while (moves.length) {
    let possibleDirections = '';
    if (
      posY + 2 > 0 &&
      posY + 2 < gameOptions.mazeHeight - 1 &&
      maze[posY + 2][posX] == 1
    ) {
      possibleDirections += 'S';
    }
    if (
      posY - 2 > 0 &&
      posY - 2 < gameOptions.mazeHeight - 1 &&
      maze[posY - 2][posX] == 1
    ) {
      possibleDirections += 'N';
    }
    if (
      posX - 2 > 0 &&
      posX - 2 < gameOptions.mazeWidth - 1 &&
      maze[posY][posX - 2] == 1
    ) {
      possibleDirections += 'W';
    }
    if (
      posX + 2 > 0 &&
      posX + 2 < gameOptions.mazeWidth - 1 &&
      maze[posY][posX + 2] == 1
    ) {
      possibleDirections += 'E';
    }
    if (possibleDirections) {
      let move = Phaser.Math.Between(0, possibleDirections.length - 1);
      switch (possibleDirections[move]) {
        case 'N':
          maze[posY - 2][posX] = 0;
          maze[posY - 1][posX] = 0;
          posY -= 2;
          break;
        case 'S':
          maze[posY + 2][posX] = 0;
          maze[posY + 1][posX] = 0;
          posY += 2;
          break;
        case 'W':
          maze[posY][posX - 2] = 0;
          maze[posY][posX - 1] = 0;
          posX -= 2;
          break;
        case 'E':
          maze[posY][posX + 2] = 0;
          maze[posY][posX + 1] = 0;
          posX += 2;
          break;
      }
      moves.push(posX + posY * gameOptions.mazeWidth);
    } else {
      let back = moves.pop();
      posY = Math.floor(back / gameOptions.mazeWidth);
      posX = back % gameOptions.mazeWidth;
    }
  }

  return maze;
}