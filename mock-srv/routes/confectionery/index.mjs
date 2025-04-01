"use strict";
const data =  [
    {id: 'B1', name: 'Chocolate bar', rrp: '22.4', info: 'Deliciously overpriced chocolate'},
];
export default async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {
        return data
    });
    fastify.post('/', async function (request, reply) {
        // opts.prefix contains route prefix (in this case "/confectionery")
        // The second argument determines the category, so the category is now set to confectionery
        fastify.mockDataInsert(request, opts.prefix.slice(1), data);
    })
};
