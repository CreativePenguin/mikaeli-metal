"use strict";
const data =  [
    {id: 'B1', name: 'Chocolate bar', rrp: '22.4', info: 'Deliciously overpriced chocolate'},
];
export default async function (fastify) {
    fastify.get('/', async function (request, reply) {
        return data
    })
};