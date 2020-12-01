import gameOptions from './gameOptions';

export default function (maze, mazeGraphics) {
  mazeGraphics.fillStyle(0x000000);
  for (var i = 0; i < gameOptions.mazeHeight; i++) {
    for (var j = 0; j < gameOptions.mazeWidth; j++) {
      if (maze[i][j] == 1) {
        mazeGraphics.fillRect(
          j * gameOptions.tileSize,
          i * gameOptions.tileSize,
          gameOptions.tileSize,
          gameOptions.tileSize
        );
      }
    }
  }

  return mazeGraphics;
}