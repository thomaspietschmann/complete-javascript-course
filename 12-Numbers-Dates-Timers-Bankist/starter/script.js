'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-12-23T10:51:36.790Z',
    '2020-12-24T10:36:17.929Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / 1000 / 60 / 60 / 24);

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) {
    return 'Today';
  }
  if (daysPassed === 1) {
    return 'Yesterday';
  }
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__data">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

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

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = () => {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // in each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;
    // when timer = 0, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // decrease 1 second
    time--;
  };

  // Set time to 5 minutes
  let time = 30;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
///
// Experimenting with Internationalization API

////

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      // month: "2-digit",
      year: 'numeric',
    };
    const locale = currentAccount.locale;
    // const locale = navigator.language; // get slocale from browser
    console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    // const now = new Date();
    // console.log(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const minutes = `${now.getMinutes() + 1}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // call logout timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  // Reset timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 3000);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*

// in JS all numbers are stored as decimals
console.log(23 === 23.0); // true
console.log();

console.log(0.1 + 0.2); // JS cannot represent 0.1 in binary system
console.log(0.1 + 0.2 === 0.3); // false (shuld be true), we have to accept this problem

// Conversion
console.log(Number('23'));
console.log(+'23'); // quicker way

// Parsing
console.log(Number.parseInt('30px', 10)); // returns 30. String needs to start with number! Second argument is "radix". 10 for decimal system.
console.log(Number.parseInt('e23', 10)); // returns Not a Number (NaN)

console.log(Number.parseFloat('  2.5rem'));
console.log(parseFloat('  2.5rem')); // also works but not recommended
console.log(Number.parseInt('    2.5rem'));

// only use to check if value is NaN
console.log(Number.isNaN(20)); // false
console.log(Number.isNaN('20')); // false
console.log(Number.isNaN(+'20x')); // true
console.log(Number.isNaN(23 / 0)); // infinity -> false

// better way to check if value is a number
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite('20')); // false
console.log(Number.isFinite(+'20')); // true
console.log(Number.isFinite(+'20X')); // false
console.log(Number.isFinite(23 / 0)); // false

// to check if integer
console.log(Number.isInteger(23)); // true
console.log(Number.isInteger(23.0)); // true
console.log(Number.isInteger(23.3)); // false
console.log(Number.isInteger(23 / 0)); // false

// MATH AND ROUNDING

console.log(Math.sqrt(9));
console.log(25 ** (1 / 2)); // also square root
console.log(25 ** (1 / 3)); // cubic root
console.log(Math.max(5, 18, 25, 3, '27', 8)); // returns max value
console.log(Math.min(5, 18, 25, 3, '27', 8)); // returns max value

// MATH constants
console.log(Math.PI);
console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

console.log(randomInt(10, 20));

// Rounding integers
console.log(Math.trunc(23.3)); // simply removes decimals
console.log(Math.round(23.3));
console.log(Math.round(23.8));

console.log(Math.ceil(23.3)); // always rounds up
console.log(Math.ceil(23.8));

console.log(Math.floor(23.3)); // always rounds down
console.log(Math.floor(23.8));

// trunc vs floor
console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// rounding floats / decimals

console.log((2.7).toFixed(0)); // string!!
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2)); // + to convert to number



// remainder (modulo) operator
console.log(5 % 2); // 1
console.log(8 % 3); // 2

// check if number is even or odd
console.log(6 % 2); // 0 -> even
console.log(7 % 2); // 1 -> odd

const isEven = num => num % 2 === 0;

console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(10));

labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'gold';
  });
});

// Big Ints

console.log(2 ** 53 - 1); // maximum number that can safely be stored in JS
console.log(Number.MAX_SAFE_INTEGER);

console.log(732593872938875329873529832795n); // append n to create bigInt
console.log(BigInt(73259387295)); // will not work with big numbers

// Operations
console.log(10000n + 10000n);
console.log(10000793287498379823789473n * 10000n);

const huge = 6548762387633864387n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15); // true
console.log(20n === 20); // false: bigInt vs regular number
console.log(20n == 20); // true
console.log(typeof 20n);

console.log(huge + ' is really big!');
// Math operations will NOT work on bigints

// divisions
console.log(10 / 3); // 3.333333
console.log(10n / 3n); // cuts off decimals


// Dates and Times

// Create a date
const now = new Date();
console.log(now);

console.log(new Date('Dec 25 2020 14:34:07 GMT+0100'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5)); // careful: month is 0-based!!
console.log(new Date(2037, 10, 33, 15, 23, 5)); // november 33 = december 3

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // this calculated numbers is the timestamp

// Working with dates

const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay()); // day of the week
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());

console.log(future.getTime()); // timestamp -->2142253380000

console.log(new Date(2142253380000));

console.log(Date.now()); // --> returns timestamp of right now

future.setFullYear(2040);
console.log(future);


const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
Math.abs(date2 - date1) / 1000 / 60 / 60 / 24; // calculate days out of milliseconds

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1);


const num = 32468323.23;

const numOptions = {
  // style: 'unit',
  // style: 'percent',
  style: 'currency',
  // unit: 'mile-per-hour',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,
};

console.log(`DE: `, new Intl.NumberFormat('de-DE', numOptions).format(num));
console.log(`US: `, new Intl.NumberFormat('en-US', numOptions).format(num));
console.log(`Syria: `, new Intl.NumberFormat('ar-SY', numOptions).format(num));
console.log(
  `Browser: `,
  new Intl.NumberFormat(navigator.language, numOptions).format(num)
  );


  // setTimeout

  const ingredients = ['olives', 'meat'];

  const pizzaTimer = setTimeout(
    (ing1, ing2) => console.log(`Here is your pizza! with ${ing1} and ${ing2}`),
    3000,
    ...ingredients
    );
    // code execution does NOT stop at timer!
    console.log('Waiting');

    if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

    // setInterval

    setInterval(function () {
      const now = new Date();
      console.log(now);
    }, 3000);

    */
