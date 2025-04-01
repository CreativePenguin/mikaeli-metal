// This file handles insertion of new items
// node needs to remain stateless, and thus new data is stored into a database

"use strict";

import fp from 'fastify-plugin';

const catToPrefix = {
    electronics: 'A',
    confectionary: 'B'
};

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
    /**
     * fastify.mockDataInsert() adds data from the request into the data array which is returned
     * Data is modified by adding an id to it based on the "category" or the /post route
     * As this is a mockDataInsert, there is no security sanatizing the request that is inserted into the array
     */
    fastify.decorate("mockDataInsert", (request, category, data) => {
        const idToPrefix = catToPrefix[category];
        const id = calculateID(idToPrefix, data);
        data.push({ id, ...request.body });
        return data;
    });
});
