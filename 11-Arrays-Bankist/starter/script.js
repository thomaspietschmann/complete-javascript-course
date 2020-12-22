'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/*

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr.slice(2)); //start to end
console.log(arr.slice(2, 4)); // start to index 4
console.log(arr.slice(-2)); // last 2 elements
console.log(arr.slice(1, -2)); // from position one to everything except last 2
console.log(arr.slice()); // creates shallow copy
console.log([...arr]); // same as above

// sPlice

// console.log(arr.splice(2)); // mutates original array!
// arr.splice(-1);
arr.splice(1, 2); // delete 2 elements from index 1
console.log(arr);

// REVERSE

arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['j', 'i', 'h', 'g', 'l'];
console.log(arr2.reverse()); // mutates the array!!
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log(...arr, ...arr2);

// JOIN
console.log(letters.join('-'));

// WHOLE NEW LEVEL OF ARRAY METHODS

// loop with forEach
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`${i + 1}. You deposited ${movement}`);
  } else {
    console.log(`${i + 1}. You withdrew ${Math.abs(movement)}`);
  }
}

// forEach and access index with forEach
// continue and break do NOT work with forEach!

movements.forEach(function (movement, i, arr) {
  // CALLBACK function!
  if (movement > 0) {
    console.log(`for Each index: ${i + 1} You deposited ${movement}`);
  } else {
    console.log(`for Each index: ${i + 1} You withdrew ${Math.abs(movement)}`);
  }
});

// forEach on MAPS and SETS

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// SET

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'GBP', 'GBP']);
currenciesUnique.forEach(function (value, _key, map) {
  console.log(`${key}: ${value}`);
});
// careful: no key, so value and key will always be the same!

// coding challenge 1

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice(1, -2);
  const allDogs = [...dogsJuliaCorrected, ...dogsKate];
  // const allDogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(allDogs);
  allDogs.forEach((dog, index) => {
    if (dog >= 3) {
      console.log(
        `Dog number ${index + 1} is an adult and is ${dog} years old.`
      );
    } else {
      console.log(
        `Dog number ${index + 1} is ${dog} years old and is still a puppy.`
        );
      }
    });
};

const julia1 = [3, 5, 2, 12, 7];
const kate1 = [4, 1, 15, 8, 3];
const julia2 = [9, 16, 6, 8, 3];
const kate2 = [10, 5, 6, 1, 4];
checkDogs(julia1, kate1);
checkDogs(julia2, kate2);

const eurToUsd = 1.1;
const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

// not recommended version
const movementsUSD2 = [];
for (const mov of movements) {
  movementsUSD.push(mov * eurToUsd);
}
console.log(movementsUSD2);

const movementsDescr = movements.map(
  (mov, i) =>
  `Movement: ${i + 1} You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)} €`);
console.log(movementsDescr);

*/
