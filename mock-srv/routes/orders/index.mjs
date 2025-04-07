// import '@fastify/websocket';
"use strict";

export default async function (fastify, opts) {
    fastify.get(
        "/:category",
        { websocket: true },
        async (request, reply) => {
            // Send current orders through socket
            for await (const order of fastify.realtimeOrders()) {
                request.send(order);
            }
            // Send realtime orders through socket
            for (const order of fastify.currentOrders(request.params.category)) {
                if (request.socket >= request.socket.CLOSING) break;
                request.send(order)
            }
        }
    );
}
