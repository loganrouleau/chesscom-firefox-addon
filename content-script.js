let timer = setInterval(waitForMoveList, 1000);

function waitForMoveList() {
  const moveList = document.getElementsByTagName("vertical-move-list")[0];
  if (!moveList) {
    return;
  }

  clearInterval(timer);

  const moveListObserver = new MutationObserver(handleMoveDetected);
  moveListObserver.observe(moveList, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  function handleMoveDetected() {
    browser.runtime.sendMessage({ moves: scrapeMovesFromMoveList() });
  }

  function scrapeMovesFromMoveList() {
    let whiteMoves = document.getElementsByClassName("white node");
    let blackMoves = document.getElementsByClassName("black node");
    let moves = [];
    let foundSelectedMove = false;
    for (let i = 0; i < whiteMoves.length; i++) {
      moves.push(whiteMoves[i].textContent);
      if (whiteMoves[i].className.includes("selected")) {
        foundSelectedMove = true;
        break;
      }
      moves.push(blackMoves[i].textContent);
      if (blackMoves[i].className.includes("selected")) {
        foundSelectedMove = true;
        break;
      }
    }
    return foundSelectedMove ? moves : [];
  }
}
