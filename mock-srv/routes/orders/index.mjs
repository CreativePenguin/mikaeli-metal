// import '@fastify/websocket';
"use strict";

export default async function (fastify, opts) {
    function sendCurrentOrders(category, socket) {
        for (const order of fastify.currentOrders(category)) {
            // if (socket >= socket.CLOSING) break;
            socket.send(order);
            // request.send(request.socket);
        }
    }
    function monitorMessages(socket) {
        socket.on('message', (message) => {
            try {
                const { cmd, payload } = JSON.parse(message);
                if (cmd === 'update-category') {
                    sendCurrentOrders(payload.category, socket);
                }
            } catch (err) {
                fastify.log.warn(
                    'Websocket Message (data: %o) Error: %s', 
                    data,
                    err.message
                );
            }
        });
    }

    fastify.get(
        "/:category",
        { websocket: true },
        async (socket, request) => {
            // Send realtime orders through socket
            const { category } = request.params;
            monitorMessages(socket);
            sendCurrentOrders(category, socket);
            // Send current orders through socket
            for await (const order of fastify.realtimeOrders()) {
                socket.send(order);
            }

        }
    );

    fastify.post(
        '/:id',
        async (request, reply) => {
            const { id } = request.params;
            fastify.addOrder(id, request.body.amount);
            return { ok: true };
        }
    )
}
