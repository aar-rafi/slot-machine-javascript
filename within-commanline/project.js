//Goals:
//1.Deposite money
//2. determine number of lines to bet on
//3. collect a bet amount
//4. spin the slot machine
//5. check if the user won
//6. giev the user their winnings
//7. play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUE = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again.");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberofLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("INvalid Number of Lines, try again.");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid bet, try again.");
    } else {
      return numberBet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) symbols.push(symbol);
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const transposedReels = []; //2D array
  for (let i = 0; i < ROWS; i++) {
    transposedReels.push([]);
    for (let j = 0; j < COLS; j++) transposedReels[i].push(reels[j][i]);
  }

  return transposedReels;
};

const printReels = (transposedReels) => {
  for (const row of transposedReels) {
    let reelString = "";
    for (const [i, symbol] of row.entries()) {
      //console.log(symbol);
      reelString += symbol;
      if (i != row.length - 1) reelString += " | ";
    }
    console.log(reelString);
  }
};

const getWinnings = (transposedReels, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = transposedReels[row];

    let allSame = true;

    for (let [i, symbol] of symbols.entries()) {
      if (symbol != symbols[0]) {
        allSame = false;
        //console.log(symbol, symbols[0]);
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUE[symbols[0]];
    }
  }

  return winnings;
};

const game = () => {
  let balance = deposit();
  while (true) {
    console.log("Your Current Balance is $" + balance);

    const numberOfLines = getNumberofLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const transposedReels = transpose(reels);
    printReels(transposedReels);
    const winnings = getWinnings(transposedReels, bet, numberOfLines);
    balance += winnings;
    console.log("You won, $" + winnings.toString());

    if (balance <= 0) {
      console.log("Your Balance is Over!");
      break;
    }
    const playAgain = prompt("Do you want to play again(y/n)? ");
    if (playAgain != "y") break;
  }
};

game();
