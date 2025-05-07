"use strict";

import fp from 'fastify-plugin';
import { PassThrough } from 'node:stream';

const catToPrefix = {
    electronics: 'A',
    confectionery: 'B'
};

// Mock data stream to simulate incoming orders
// key determines id, value is object that determines starting value
const orders = {
    A1: { total: 3 },
    A2: { total: 7 },
    B1: { total: 101 },
}

/**
 * Creates a stream of orders
 */
const orderStream = new PassThrough({ objectMode: true });

// Asterisk is non-functional syntax that denotes a function is a generator
// async generator function that can be iterated over to produce random orders
// Called with `for await (let j of realTimeOrdersSimulator())` to get values
// Using the normal `for (let j of realTimeOrdersSimulator())` gets promises
/**
 * Generates a new order from stream
 * @yields {string} new stringified object { id: <value>, total: <value> }
 */
async function* realtimeOrdersSimulator() {
    for await (const {id, total} of orderStream) {
        yield JSON.stringify({ id, total });
    }
}

/**
 * Gathers all the orders from `orders` variable,
 * and filters out the orders that match `category`
 * Generator that individually returns each of the filtered order values individually
 * @param {string} category Category of the order
 * @yields {string} new stringified object { id: value, total: value }
 */
function* currentOrders(category) {
    const prefix = catToPrefix[category];
    const orderIds = Object.keys(orders).filter((id) => id[0] === prefix);
    for (const id of orderIds) {
        yield JSON.stringify({ id, ...orders[id], type: 'currentOrders' })
    }
}

function addOrder(id, amount) {
    // check if id exists
    if (!orders[id]) {
        const err = new Error(`Order id not found: ${id}`);
        err.statusCode = 404;  // Creates Error 404
        throw err;
    }

    // check the amount is an integer
    if (Number.isSafeInteger(amount) === false) {
        const err = new Error(`Amount is not a number: ${amount}`);
        err.statusCode = 400;  // Creates Error 400 -- bad request
        throw err;
    }

    // append amount to orders variable
    orders[id].total += amount;
    const new_order = { id, total: orders[id].total };
    console.log("Adding order: %o", new_order);
    orderStream.write(new_order);
}

/**
 * Finds the next id by filtering out duplicate ids, and adding the id prefix
 * @param {*} idPrefix prefix to put in front of id's
 * @param {*} data slice of the data that contains next id
 */
const calculateID = (idPrefix, data) => {
    // Get all ids in a set to remove duplicate sets
    const getIds = [...new Set(data.map(i => i['id']))];
    const next = Number(getIds.pop().slice(1)) + 1;
    return `${idPrefix}${next}`;
}

export default fp(async function (fastify, opts) {
    debugger
    fastify.decorate('currentOrders', currentOrders);
    fastify.decorate('realtimeOrders', realtimeOrdersSimulator);
    fastify.decorate('addOrder', addOrder);

    /**
     * fastify.mockDataInsert() adds data from the request into the data array which is returned
     * Data is modified by adding an id to it based on the "category" or the /post route
     * As this is a mockDataInsert, there is no security sanatizing the request that is inserted into the array
     */
    fastify.decorate("mockDataInsert", (request, category, data) => {
        const idToPrefix = catToPrefix[category];
        const id = calculateID(idToPrefix, data);
        data.push({ id, ...request.body });
        orders[id] = { total: 0 };
        console.log(`Added ${id} to ${Object.keys(orders)}`);
        return data;
    });
});
