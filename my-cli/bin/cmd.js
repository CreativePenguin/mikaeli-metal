#!/usr/bin/env node
import {Command} from 'commander';
import {update, add, listCategories, log, error,
  listCategoryItems, displayTimestamp } from '../src/utils.js';
import {commandsAutocomplete} from '../src/prompts.js';

const program = new Command();

// Create a new program

const programCommands = ['update', 'add', 'list']

program
  .version('0.0.1')
  .description('Back office for My App')
  .name('my-cli')


// Create a program for updating orders
program
  // set the command name
  .command('update')
  .description('Update Order by ID')
  .argument('<ID>', 'Order ID')
  .argument('<AMOUNT>', 'Order Amount')
  // Set the action to be executed when the command is run
  .action(
    async (id, amount) => await update(id, amount)
  );

// Create a program for listing categories by id's
// $ my-cli add electronics A3 Laptop 599 "Cool midpriced laptop"
program
  // set the command name
  .command('add')
  .description('Add Product by ID to a Category')
  .argument('<CATEGORY>', 'Product Category')
  .argument('<ID>', 'Product ID')
  .argument('<NAME>', 'Product Name')
  .argument('<AMOUNT>', 'Product RRP')
  // Info is set to be optional
  .argument('[INFO...]', 'Product Info')
  // Set the action to be executed when the command is run
  .action(
    async (category, id, name, amount, info) =>
      await add(category, id, name, amount, info)
  );

program
  .command('list')
  .description('List categories, or its items')
  .argument('[CATEGORY]', 'Product Category')
  .option('-a, --all', 'List all categories')
  .action(
    async (args, opts) => {
      if (args && opts.all) {
        error('Cannot specify both "all" and category');
      } else if (opts.all || args === 'all') {
        displayTimestamp();
        listCategories();
      } else if (args === 'confectionery' || args === 'electronics') {
        displayTimestamp();
        await listCategoryItems(args);
      } else {
        error('Invalid category specified');
      }
    }
  );

program
  .command('interactive')
  .action(
    async () => {
      await commandsAutocomplete(programCommands);
    }
  );



// Parse the command line arguments
program.parse()
