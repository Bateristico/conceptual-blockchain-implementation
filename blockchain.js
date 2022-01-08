const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

// a normal block class
class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    // generate HASH using SHA256
    return SHA256(
      this.timestamp + this.previousHash + JSON.stringify(this.transactions) + this.nonce
    ).toString();
  }

  mineNewBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      //2ff9c985da01874b6d7cb574635ef6dde1249d226d965af803fea09cf66fdfc4
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('A new block was mined with hash', this.hash);
  }
}

// the block chain class
class BlockChain {
  constructor() {
    // the first variable of the array will be the genesis block
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 10; // 10 coins reward
  }
  createGenesisBlock() {
    return new Block(new Date(), 'this is the genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /* To create a new block you need:
- new block data
- the hash of the previous block
- calculate the hash of current block
*/
  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineNewBlock(this.difficulty);
    console.log('Block mined successfully');

    this.chain.push(block);
    this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance = balance - trans.amount;
        }
        if (trans.toAddress === address) {
          balance = balance + trans.amount;
        }
      }
    }
    return balance;
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

let myCoin = new BlockChain();

transaction1 = new Transaction('mirka', 'lonia', 100);
myCoin.createTransaction(transaction1);

transaction2 = new Transaction('lonia', 'mirka', 20);
myCoin.createTransaction(transaction2);

console.log('Started mining by the miner...');
myCoin.minePendingTransactions('laika');

// lets check the balance for each one of them
console.log(`the balance for Mirka is ${myCoin.getBalanceOfAddress('mirka')}`);
console.log(`the balance for Lonia is ${myCoin.getBalanceOfAddress('lonia')}`);
console.log(`the balance for miner Laika is ${myCoin.getBalanceOfAddress('laika')}`);

console.log('Started mining again by the miner...');
myCoin.minePendingTransactions('laika');
console.log(`the balance for miner Laika is ${myCoin.getBalanceOfAddress('laika')}`);

// // creating 2 new blocks
// let block1 = new Block(new Date(), { mybalance: 100 });
// let block2 = new Block(new Date(), { mybalance: 50 });
// // creating a blockchain
// let myBlockChain = new BlockChain();
// // adding 2 blocks to the blockchain
// console.log('first block creation');
// myBlockChain.addBlock(block1);
// console.log('second block creation');
// myBlockChain.addBlock(block2);

// console.log(JSON.stringify(myBlockChain, null, 4));
