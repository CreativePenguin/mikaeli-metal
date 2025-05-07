#!/usr/bin/env node

const API = 'http://localhost:3000';

const usage = (msg = 'Back office for My App') => {
  console.log(`\n${msg}\n`);
  console.log('Usage: cmd <ID> <AMOUNT>');
};

const argv = process.argv.slice(2);
// If there are no arguments, show the usage and exit
if (argv.length < 2) {
  usage();
  process.exit(1);
}

// Deconstruct the arguments into variables
const [argId, argAmount] = argv;

// Check if the Amount is a number
const amount = parseInt(argAmount);
// If the amount is not a number, show the usage and exit
if (isNaN(amount)) {
  usage('Error: <AMOUNT> must be a number');
  process.exit(1);
}

fetch(`${API}/orders/${argId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(`Order ${argId} updated with amount ${amount}`);
  })
  .catch((err) => {
    // If there is an error, log it to the console and exit
    console.log(err.message);
    process.exit(1);
  });
