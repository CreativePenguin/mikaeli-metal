const API = 'http://localhost:3000'

const mockData = [
    {id: 'A1', name: 'Vacuum Cleaner', rrp: '99.9', info: 'The most powerful vacuum in the world!'},
    {id: 'A2', name: 'Leaf Blower', rrp: '303.33', info: 'This product will blow your socks off'},
    {id: 'B1', name: 'Chocolate bar', rrp: '22.4', info: 'Deliciously overpriced chocolate'},
];

const populateProducts = async (category, method='GET', payload) => {
    const products = document.querySelector('#products');
    products.innerHTML = '';
    const send = method === 'GET' ? {} : {
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(payload)
    };
    const res = await fetch(`${API}/${category}`, {method, ...send});
    const data = await res.json();

    for (const product of data) {
        const item = document.createElement('product-item');
        for (const key of ['name', 'rrp', 'info']) {
            const span = document.createElement('span');
            span.slot = key;
            span.textContent = product[key];
            item.appendChild(span);
        }
        products.appendChild(item);
    }
}

const category = document.querySelector('#category');
const addForm = document.querySelector('#add');

category.addEventListener('input', async ({ target }) => {
    addForm.style.display = 'block';
    await populateProducts(target.value);
});

addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { target } = e;
    const payload = {
        name: target.name.value,
        rrp: target.rrp.value,
        info: target.info.value
    };
    await populateProducts(category.value, 'POST', payload);
    target.reset();
})

// Custom Element
customElements.define('product-item', class Item extends HTMLElement {
    constructor() {
        super();
        const itemTmpl = document.querySelector('#item').content;
        this.attachShadow({mode: 'open'}).appendChild(itemTmpl.cloneNode(true));
    }
});

