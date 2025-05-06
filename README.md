# Mikaeli Metal

Linux Foundation basic node tutorial repo
run with `npx serve -p 5050 static`, and run `npm run start` in mock-srv/ folder  
This serves files static folder, and sets up backend in mock-srv that requests can be made from  
Project generated with `npx fastify generate . --esm`  

## Project Description
The project represents a mock shop, where the user is able to check prices of items,
submit new items, and track the amount of purchases of items.
The root project is the frontend which requests to `/mock-srv` to get data  
`/mock-srv` is a folder that contains a node server built with fastify
with routes `/confectionery` and `/electronics`  
Data: list of objects in format `{id: str, name: str, rrp: str, info: str}`  

## Branch Descriptions

Each branch is a different unit of the tutorial  
Units:  
[3.0 Webservice](#30-webservice), [3.1 GET](#31-get), [3.2 POST](#32-post)  
[4.0 WebSockets](#40-websockets), [4.1 Bicommunication](#41-bidirectional-communication),
[4.2 Server State](#42-server-state)

### 4.2 Server State
Instead of simulating a stream of orders with a random number generator,
the server instead receives order updates from the frontend with a websocket

### 4.1 Bidirectional Communication
Previous websocket functionality required closing and reopening websockets
whenever the web category was changed.
By implementing bidirectional communication the frontend would send updates
through the websocket connection,
and allow the server's websockets to update without needing to open a new
websocket

#### static/app.js
Frontend no longer re-opens a socket with new path when category switches,
but instead sends a message to the backend to update the category

#### mock-srv/routes/orders/index.mjs
Listener added to respond to a socket message from the frontend  
New function created `monitorMessages` which adds a listener for
websocket messages from the frontend

### 4.0 Websockets
Adds websockets in the form of a stream of data which the website keeps track of  
Connection located at `ws://localhost:3000/orders/${category}`

#### static/index.html
Add additional element to each product that tracks number of orders

#### static/app.js
Creates a new websocket instance with `new Websocket()`  
Websocket has a listener attached that updates orders numbers on the webpage
with the new values from the websocket  
Socket is closed and reopened upon inputs to the web page

#### mock-srv/app.js
`fastify.register(websocket)` added to register
<a src="https://github.com/fastify/fastify-websocket">fastify-websocket</a>  
See link to know how to use websockets with fastify

#### mock-srv/plugins/data-utils.js
`realtimeOrdersSimulator()` is an async generator, that when called
continuously returns a JSON string with an incremented order number  
JSON String format: `{id, total, type: realtimeOrders}` --
the frontend interprets this string to update the order count
`currentOrders()` is a generator function that returns
the current order numbers. This gets called immediately
when the websocket opens -- this prevents the frontend from
showing undefined as the order number

#### mock-srv/routes/orders/index.mjs
This function uses the `websocket` plugin to
manage the server response whenever there's calls to
`ws://localhost:3000/orders/${category}`,  
Uses functions `realTimeOrdersSimulator()` and `currentOrders()` --
uses `for await` loop to continuously call `realTimeOrdersSimulator`
to simulate a stream of new orders,
and passes in the `/:category` that the websocket was called with
to send the current sale values with `currentOrders()`

### 3.2 POST

#### static/index.html
Add form input that allows user to define new products to be added to web page
#### static/app.js
Gets data from form and includes it into the POST request made to the server
#### mock-src/plugins/data-utils.js
Add function `fastify.mockDataInsert` with `fastify.decorate("mockDataInsert")`.
This function accepts a request, and inserts it into the data dictionary
#### mock-srv/routes/confectionery & mock-srv/routes/electronics
Add POST request method to each route,
which adds the data received from the data form to the data set

### 3.1 GET

Use fastify package to add multiple routes to the API that the frontend can make requests to

#### static/index.html
Add select-option type input
#### static/app.js
File has been modified to make requests from different paths of the api with `fetch(${API}/${category})`  
`${category}` is determined by select-option input  
#### mock-srv/
generated with fastify npm package with `$ npx fastify generate . --esm`  
Fastify server is now run with `$ npm start` in the `/mock-srv/` dir
#### mock-srv/app.js
use `fastify.register(cors)` to automatically add automatically add "Access-Control-Allow-Origin" to all requests
#### mock-srv/routes/confectionery & mock-srv/routes/electronics
Define the two categories that can be called with `fetch(${API}/${category})`  
Each route has its own `index.mjs` file that uses `fastify.get()` to send its own mock data  

### 3.0 Webservice

Use raw node js to create basic http server that responds to requests with json object

#### static/index.html
html frontend that is shown with nodejs serve package  
Defines structure of `<template id="item">` which is later used in app.js to format data received from node.js server
Page has a button to fetch data from backend

#### static/app.js
Creates request using fetch API that gets data from `localhost:3000`.
The program makes a single request, with `fetch(${API})` and then parses the data from the JSON response to get a list of responses.  
Uses structure of `<template id="item">` to format data received from localhost:3000

#### server.mjs
Mock server file that creates a webserver with node.js `createServer()`  
Server listens on port 3000 and responds to requests with mockdata  
Due to localhost:3000 being a different domain from localhost:5050, we need to allow cross origin requests in the header
with `res.setHeader("Access-Control-Allow-Origin", "*")`  
Due to the data being formatted as a json object, we need to specify this in the header
with `res.writeHead(200, { "Content-Type": "application/json" })`  
Data is then sent with `res.end(data)`

## Quiz Questions
3.1: What does the non-core serve module do?  
A. Deploys files to a remote server  
B. Creates a local server that supplies mock data  
C. Creates a local server that hosts static files
<details>
  <summary>Click for answer</summary>
  C. Creates a local server that hosts static files
</details>

3.2: What is a mock service?  
A. A service that doesn't really exist  
B. A service that generates trash talk  
C. A service that is built in place of a service that isn't (easily)
accessible in development environments and/or a way to prototype a future service  
<details>
  <summary>Click for answer</summary>
  C. A service that is built in place of a service that isn't (easily)
accessible in development environments and/or a way to prototype a future service 
</details>
 

3.3: What two characteristics should a production service have that
a mock service does not necessarily need to conform to?  
A. Statelessness and input validation  
B. Read and write functionality  
C. Logging and debugging  
<details>
  <summary>Click for answer</summary>
  A. Statelessness and input validation  
</details>
