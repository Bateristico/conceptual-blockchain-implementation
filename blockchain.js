const SHA256 = require('crypto-js/sha256');

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

  checkBlockChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      return true;
    }
  }
}
// creating 2 new blocks
let block1 = new Block(1, new Date(), { mybalance: 100 });
let block2 = new Block(2, new Date(), { mybalance: 50 });
// creating a blockchain
let myBlockChain = new BlockChain();
// adding 2 blocks to the blockchain
myBlockChain.addBlock(block1);
myBlockChain.addBlock(block2);

console.log('blockchain', JSON.stringify(myBlockChain, null, 4));
console.log('validation check of the blockchain: ', myBlockChain.checkBlockChainValid());

// introduce a change of the block
myBlockChain.chain[1].data = { mybalance: 5000 };
console.log(
  'validation check of the blockchain (after hacking): ',
  myBlockChain.checkBlockChainValid()
);
