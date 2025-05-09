const API = 'http://localhost:3000';

export async function update(id, amount) {
  console.log(`Updating order ${id} with amount ${amount}`);
  // terminal args are always strings
  // +amount converts to number if possible
  if (Number.isSafeInteger(+amount) === false) {
    usage(`Error: <AMOUNT> must be a number`);
    process.exit(1);
  }
  fetch(`${API}/orders/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: +amount }),
  }).then((response) => {
    console.log(`Order ${id} updated with amount ${amount}`);
  }).catch((err) => {
    console.err(err);
    process.exit(1);
  });
}

// Log the usage of the command to the console
export const log = (msg) => {
  console.log(`\n${msg}\n`);
};

export const error = (msg) => {
  console.error(`\n${msg}\n`);
};

// add a new product to the website
export async function add(...args) {
  let [ category, id, name, amount, info ] = args;
  if (Number.isSafeInteger(+amount) === false) {
    console.log('amount must be an integer', amount);
    process.exit(1);
  }
  await fetch(`${API}/${category}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, rrp: +amount, info: info.join(' ') }),
  }).then((response) => {
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    log(`Item "${id}:${name}" has been added to the ${category} category`);
  }).then((data) => {
    console.log(`Product ${name} added to ${category}`);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  })
}

const categories = ['confectionery', 'electronics']
export function listCategories() {
  log('Categories:\n')
  try {
    for (const cat of categories) log(cat);
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

export async function listCategoryItems(category) {
  log(`Listing IDs for category ${category}`);
  try {
    fetch(`${API}/${category}`)
      .then( (data) => data.json())
      .then( (items) => {
        for (const {id, name, rrp, info} of items) {
          log(`id ${id}: ${name} - $${rrp}\nProduct Info:\t${info}`);
        }
      });
    // for await (let item of fetch(`${API}/${category}`)) {
    //   const { id, name, rrp, info } = item;
    //   log(`id ${id}: ${name} - $${rrp}\nProduct Info:\t${info}`);
    // }
  } catch(err) {
    console.log(err.message);
    process.exit(1);
  }
}
