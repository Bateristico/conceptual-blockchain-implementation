const SHA356 = require('crypto-js/sha256');

// a normal block class
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    // generate HASH using SHA256
    return SHA256(
      this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)
    ).toString();
  }
}

// the block chain class
class BlockChain {
  constructor() {
    // the first variable of the array will be the genesis block
    this.chain = [this.createGenesisBlock()];
  }
  createGenesisBlock() {
    return new Block(0, new Date(), 'this is the genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /* To create a new block you need:
- new block data
- the hash of the previous block
- calculate the hash of current block
*/
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}
