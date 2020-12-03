export default function (direction, playScene) {
  switch (direction) {
    case 'N':
      if (playScene.maze[playScene.player.mazeY - 1][playScene.player.mazeX] === 0) {
        return true;
      }
      break;
    case 'E':
      if (playScene.maze[playScene.player.mazeY][playScene.player.mazeX + 1] === 0) {
        return true;
      }
      break;
    case 'S':
      if (playScene.maze[playScene.player.mazeY + 1][playScene.player.mazeX] === 0) {
        return true;
      }
      break;
    case 'W':
      if (playScene.maze[playScene.player.mazeY][playScene.player.mazeX - 1] === 0) {
        return true;
      }
      break;
    default:
      return false;
  }

  return false;
}
