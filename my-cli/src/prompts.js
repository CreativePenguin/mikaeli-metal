import Enquirer from 'enquirer';
import { 
  categories, returnCategoryItems, update
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

export const promptListIds = async () => {
  const { category } = await prompt(categoryQuestions);
  return listCategoryItems(category);
};

export const order = async () => {
  const { category } = await prompt(categoryQuestions);
  const ids = await returnCategoryItems(category)
    .then( (items) => items.map( (item) => item.id) );
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
  console.log('ids', ids, ids.length, typeof ids);
  console.log('new category', orderQuestions2[0].categories);
  const { id, amount } = await prompt(orderQuestions2);
  return update(id, amount);
}

// await promptListIds();
await order();

// const { Confirm } = Enquirer;
// const question = new Confirm({
//   name: 'question',
//   message: 'Did you like enquirer?',
// });
// question.run().then(answer => console.log('Answer:', answer));
