import Trie from "./trie.js";

const fileInputButton = document.getElementById("file-input-button");
const fileInput = document.getElementById("file-input");
fileInputButton.addEventListener("click", () => fileInput.click(), false);

let trie;
let triePopulated = false;
const contentBox = document.querySelector("#content");

fileInput.addEventListener("change", handleFiles, false);

function handleFiles() {
  contentBox.innerHTML = "";
  contentBox.appendChild(paragraphWithText("Importing PGN file(s)..."));

  trie = new Trie();
  triePopulated = false;
  const fileList = this.files;

  let promises = [];

  for (let i = 0; i < fileList.length; i++) {
    promises.push(fileList[i].text());
  }

  Promise.all(promises).then((values) => {
    let mergedText = "";
    values.forEach((value) => {
      mergedText += value;
    });
    pgnParser.parse(mergedText).forEach((game) => {
      trie.insert(game.moves.map((move) => move.move));
    });
    triePopulated = true;
    contentBox.innerHTML = "";
    contentBox.appendChild(paragraphWithText("Import successful"));
  });
}

browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(message) {
  if (!triePopulated) {
    return;
  }

  contentBox.innerHTML = "";
  let table = document.createElement("table");

  let tableHeaderRow = document.createElement("tr");
  table.appendChild(tableHeaderRow);
  let moveHeader = document.createElement("th");
  let frequencyHeader = document.createElement("th");
  tableHeaderRow.appendChild(moveHeader);
  tableHeaderRow.appendChild(frequencyHeader);
  moveHeader.appendChild(document.createTextNode("Next Move"));
  frequencyHeader.appendChild(document.createTextNode("Frequency"));

  let unsortedMoves = trie.searchNextMove(message.moves);

  if (Object.keys(unsortedMoves).length === 0 && message.moves.length > 0) {
    contentBox.appendChild(table);
    contentBox.appendChild(paragraphWithText("Position not in database"));
    return;
  }

  let moves = sortMovesByFrequency(unsortedMoves);
  moves.forEach((move) => {
    let moveRow = document.createElement("tr");
    table.appendChild(moveRow);
    let moveLabel = document.createElement("td");
    let frequency = document.createElement("td");
    moveRow.appendChild(moveLabel);
    moveRow.appendChild(frequency);
    moveLabel.appendChild(
      document.createTextNode(
        message.moves.length % 2 ? "... " + move[0] : move[0]
      )
    );
    frequency.appendChild(document.createTextNode(move[1]));
  });

  contentBox.appendChild(table);
}

function sortMovesByFrequency(unsortedMoves) {
  let moves = [];
  for (const move in unsortedMoves) {
    moves.push([move, unsortedMoves[move]]);
  }
  moves.sort((a, b) => b[1] - a[1]);
  return moves;
}

function paragraphWithText(text) {
  let element = document.createElement("p");
  element.appendChild(document.createTextNode(text));
  return element;
}
