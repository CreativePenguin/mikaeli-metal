import Enquirer from 'enquirer';
import { 
  categories, returnCategoryItems, update, log, add
} from './utils.js';

const { prompt } = Enquirer;

const categoryQuestions = [
  {
    type: 'autocomplete',
    name: 'category',
    message: 'Category',
    choices: categories,
  }
];

const orderQuestions = [
  ...categoryQuestions,
  {
    type: 'input',
    name: 'id',
    message: 'ID',
  },
  // {
  //   type: 'autocomplete',
  //   name: 'id',
  //   message: 'ID',
  //   choices: listCategoryItems(category),
  // },
  {
    type: 'input',
    name: 'amount',
    message: 'Amount',
  }
];

export const categoryAutocomplete = async () => {
  const { category } = await prompt(categoryQuestions);
  return listCategoryItems(category);
};

export const listAutocomplete = async () => {
  const { category } = await prompt(categoryQuestions);
  const ids = await returnCategoryItems(category)
    .then( (items) => items.map( (item) => item.id) );
  log(`current ids in category: ${ids}`);
  return ids;
}

export const updateAutocomplete = async () => {
  const ids = listAutocomplete();
  const orderQuestions2 = [
    {
      type: 'autocomplete',
      name: 'id',
      message: 'ID',
      choices: ids,
    },
    {
      type: 'input',
      name: 'amount',
      message: 'Amount',
    }
  ];
  // console.log('ids', ids, ids.length, typeof ids);
  // console.log('new category', orderQuestions2[0].categories);
  const { id, amount } = await prompt(orderQuestions2);
  return update(id, amount);
}

export const addAutocomplete = async () => {
  await listAutocomplete();
  const addArguments = ['id', 'name', 'rrp', 'info'];
  const addQuestions = addArguments.map( (arg) => {
    return { type: 'input', name: arg, message: arg.toUpperCase() }
  });
  const { id, name, rrp, info } = await prompt(addQuestions);
  return add(category, id, name, rrp, info);
}

export const commandsAutocomplete = async (commands) => {
  const commandsQuestions = [
    {
      type: 'autocomplete',
      name: 'command',
      message: 'Choose Command:',
      choices: commands
    }
  ];
  const { command } = await prompt(commandsQuestions);
  switch (command) {
    case 'add':
      return addAutocomplete();
    case 'update':
      return updateAutocomplete();
    case 'list':
      return listAutocomplete();
    default:
      console.log('sorry autocomplete is not available for this command');
  }
}


// await categoryAutocomplete();
// await updateAutocomplete();
// await addAutocomplete();

// const { Confirm } = Enquirer;
// const question = new Confirm({
//   name: 'question',
//   message: 'Did you like enquirer?',
// });
// question.run().then(answer => console.log('Answer:', answer));
