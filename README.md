# Mikaeli Metal

Linux Foundation basic node tutorial repo
run with `npx serve -p 5050 static`, and run `npm run start` in mock-srv/ folder  
This serves files static folder, and sets up backend in mock-srv that requests can be made from  

## Project Description
The root project is the frontend which requests to `/mock-srv` to get data  
`/mock-srv` is a folder that contains a node server built with fastify
with routes `/confectionery` and `/electronics`  
Data: list of objects in format `{id: str, name: str, rrp: str, info: str}`

## Branch Descriptions

Each branch is a different unit of the tutorial  
Units:  
[3.0 Webservice](#30-webservice), [3.1 GET](#31-get), [3.2 POST](#32-post)

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
#### mock-srv/routes/confectionary & mock-srv/routes/electronics
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
>! C. Creates a local server that hosts static files

3.2: What is a mock service?  
A. A service that doesn't really exist  
B. A service that generates trash talk  
C. A service that is built in place of a service that isn't (easily)
accessible in development environments and/or a way to prototype a future service  
>! C. A service that is built in place of a service that isn't (easily)
accessible in development environments and/or a way to prototype a future service  

3.3: What two characteristics should a production service have that
a mock service does not necessarily need to conform to?  
A. Statelessness and input validation  
B. Read and write functionality  
C. Logging and debugging  
>! A. Statelessness and input validation  
