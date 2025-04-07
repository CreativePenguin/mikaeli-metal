const API = 'http://localhost:3000';
const WS_API = 'ws://localhost:3000';

/**
 * This function makes a request to mock-srv and populates website with the data it receives
 * @param {string} category The request path -- determined from website dropdown
 * @param {*} method GET or POST (default is GET)
 * @param {*} payload additional information to send with request (eg. form info)
 */
const populateProducts = async (category, method='GET', payload) => {
    // Clear current data
    const products = document.querySelector('#products');
    products.innerHTML = '';

    // Generate request
    const send = method === 'GET' ? {} : {
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(payload)
    };
    const res = await fetch(`${API}/${category}`, {method, ...send});
    const data = await res.json();  // returns javascript promise object

    // Populate data
    for (const product of data) {
        const item = document.createElement('product-item');
        // next line adds new attribute data-id which can be querySelector'd later
        // dataset provides custom data-* elements to be modified
        item.dataset.id = product.id;
        for (const key of ['name', 'rrp', 'info']) {
            const span = document.createElement('span');
            span.slot = key;
            span.textContent = product[key];
            item.appendChild(span);
        }
        products.appendChild(item);
        // console.log(item);
    }
}

// Get elements from DOM
const category = document.querySelector('#category');
const addForm = document.querySelector('#add');

// Connect web socket
let socket = null;
/**
 * Initiailizes socket variable, and adds an event listener on message
 * Websocket is designed to send a stream of data, thus event listener
 * From message, use fields `id` and `total`
 * `id` specifies correct product-item, while `total` specifies what to insert
 * `[orders]` slot is where the data is added to
 * @param {string} category string that represents path (from dropdown)
 */
const realTimeOrders = (category) => {
    if (socket) socket.close();
    socket = new WebSocket(`${WS_API}/orders/${category}`);
    socket.addEventListener('message', ({ data }) => {
        try {
            const { id, total } = JSON.parse(data);
            const item = document.querySelector(`[data-id="${id}"]`);
            if (item == null) return;
            // Either edits value of current orders slot, or create new element to insert
            const itemSlot = 
                item.querySelector('[slot="orders"]') ||
                document.createElement('span');
            itemSlot.slot = "orders";  // causes element to be inserted in orders slot
            itemSlot.textContent = total;
            item.appendChild(itemSlot);
        } catch(err) {
            console.log(err);
        }
    });
}

// Populate products after category is selected
category.addEventListener('input', async ({ target }) => {
    addForm.style.display = 'block';
    await populateProducts(target.value);
    realTimeOrders(target.value);
});

// Populate products after
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { target } = e;
    const payload = {
        name: target.name.value,
        rrp: target.rrp.value,
        info: target.info.value
    };
    await populateProducts(category.value, 'POST', payload);
    realTimeOrders(category.value);
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

