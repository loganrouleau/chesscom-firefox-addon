class TrieNode {
  constructor(value) {
    this._value = value;
    this._frequency = 1;
    this._children = {};
  }

  get value() {
    return this._value;
  }

  get frequency() {
    return this._frequency;
  }

  get children() {
    return this._children;
  }

  addChild(key) {
    this._children[key] = new TrieNode(key);
  }

  incrementFrequency() {
    this._frequency++;
  }
}

export default class Trie {
  constructor() {
    this._root = new TrieNode(null);
  }

  insert(moves) {
    let node = this._root;
    moves.forEach((move) => {
      let child = node.children[move];
      if (!child) {
        node.addChild(move);
      } else {
        child.incrementFrequency();
      }
      node = node.children[move];
    });
  }

  searchNextMove(moves) {
    let frequencyMap = {};
    let node = this._root;
    for (let i = 0; i < moves.length; i++) {
      node = node.children[moves[i]];
      if (!node) {
        return {};
      }
    }
    for (const child in node.children) {
      frequencyMap[child] = node.children[child].frequency;
    }
    return frequencyMap;
  }
}
