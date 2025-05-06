// import '@fastify/websocket';
"use strict";

export default async function (fastify, opts) {
    fastify.get(
        "/:category",
        { websocket: true },
        async (socket, request) => {
            // Send realtime orders through socket
            const { category } = request.params;
            for (const order of fastify.currentOrders(category)) {
                // if (socket >= socket.CLOSING) break;
                socket.send(order);
                // request.send(request.socket);
            }

            // Send current orders through socket
            for await (const order of fastify.realtimeOrders()) {
                socket.send(order);
            }

        }
    );
}
