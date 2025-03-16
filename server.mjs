'use strict';
import { createServer } from "node:http";

const data = JSON.stringify([
    {
        id: 'A1',
        name: 'Vacuum Cleaner',
        rrp: '99.99',
        info: 'The most powerful vacuum in the world.'
    },
    {
        id: "A2",
        name: "Leaf Blower",
        rrp: "303.33",
        info: "This product will blow your socks off.",
    },
    {
        id: "B1",
        name: "Chocolate Bar",
        rrp: "22.40",
        info: "Delicious overpriced chocolate.",
    },
    {
        id: "B2",
        name: "Cheese Pizza",
        rrp: "34.20",
        info: "Jumbo sized pizza, fit for social gatherings"
    }
]);

const server = await createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(data);
})

server.listen(3000);
console.log('Server listening on port http://localhost:3000/');