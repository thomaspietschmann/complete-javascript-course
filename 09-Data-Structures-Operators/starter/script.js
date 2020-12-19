'use strict';

const restaurant = {
  name: 'Classico Italiano',
  location: 'Via Angelo Tavanti 23, Firenze, Italy',
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
  mainMenu: ['Pizza', 'Pasta', 'Risotto'],

  openingHours: {
    thu: {
      open: 12,
      close: 22,
    },
    fri: {
      open: 11,
      close: 23,
    },
    sat: {
      open: 0, // Open 24 hours
      close: 24,
    },
  },
  order: function (starterIndex, mainIndex) {
    return [this.starterMenu[starterIndex], this.mainMenu[mainIndex]];
  },

  orderDelivery: function ({
    starterIndex = 1,
    mainIndex = 0,
    time = '20:00',
    address,
  }) {
    console.log(
      `Order received! ${this.starterMenu[starterIndex]} and ${this.mainMenu[mainIndex]} will be delivered to ${address} at ${time}.`
    );
  },
};

// passing object of arguments to method

restaurant.orderDelivery({
  time: '22.30',
  address: 'Via del sole 21',
  mainIndex: 2,
  starterIndex: 2,
});

restaurant.orderDelivery({
  address: 'Via del sole 25',
  starterIndex: 2,
});

// Destructuring objects

const { name, openingHours, categories } = restaurant;

console.log(name, openingHours, categories);

const {
  name: restaurantName,
  openingHours: hours,
  categories: tags,
} = restaurant;

console.log(restaurantName, hours, tags);

// nested objects

const {
  fri: { open: o, close: c },
} = openingHours;
console.log(o, c);

// setting default values

const { menu = [], starterMenu: starters = [] } = restaurant;

console.log(menu, starters);

// mutating variables

let a = 111;
let b = 999;

const obj = {
  a: 23,
  b: 7,
  c: 14,
};
console.log(obj);

({ a, b } = obj);

console.log(a, b);

/*

// array destructuring

const arr = [2, 3, 4];

const a = arr[0];
const b = arr[1];
const c = arr[2];

// destructuring assignment
const [x, y, z] = arr

console.log(a, b, c);
console.log(x, y, z);

let [main, , secondary] = restaurant.categories;
console.log(main, secondary);

// switching main and secondary the long way
// const temp = main;
// main = secondary;
// secondary = temp;

// switching variables the easier way
[main, secondary] = [secondary, main];
console.log(main, secondary);


// how to receive two return values from a function call and assign them to two variables
const [starter, mainCourse] = restaurant.order(2, 0);
console.log(starter, mainCourse);


// destructuring of nested arrays
const nested = [2, 4, [5, 6]];
const [i, , [j, k]] = nested;
console.log(i, j, k);

// Default values

const [p = 1, q = 1, r = 1] = [8, 9];
console.log(p, q, r);

*/
