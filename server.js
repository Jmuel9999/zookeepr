
const fs = require('fs');
// provides utilities for working with file and directory paths
const path = require('path');
const {animals} = require('./data/animals');
const express = require('express');
const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();

// parse incoming string or array data converting it to key/value pairings
// app.use method mounts a function to the server that our requests pass through before getting to intended endpoint
// these functions we can mount to our server are the MIDDLEWARE
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());
// this allows for more middleware that instructs server to make certain files readily available
// in this case, we used a route to the 'public' folder and instructed server to make these "static" resources (like css)
app.use(express.static('public'));

// adds route to animals.json
app.get('/api/animals', (req, res) => {
    // take the query parameter and turned it into JSON
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // res is short for 'response' ---- Sends the animals data in json format to client
    res.json(results);
});

// different route option, PARAM routes (like this one) must come AFTER the other GET route
app.get('/api/animals/:id', (req, res) => {
  // findById takes in the id and array of animals and returns a SINGLE ANIMAL object (hence, ID)
  const result = findById(req.params.id, animals);
  // if there IS a result, then THIS
  if (result) {
    res.json(result);
    // otherwise, send client the 404 'page not found' error
  } else {
    res.send(404);
  }
});

// another method of the 'app' object that allows us to create routes
// the fact that it says 'post' shows us that we defined a route that specifically listens to POST requests, NOT GET requests
app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    // response method to relay a message to the client making the request. Anything in 400 error range means user error and NOT server error
    res.status(400).send('The animal is not properly formatted.');
  } else {
  // sending data back to the client as json format/ function in a function
  const animal = createNewAnimal(req.body, animals);
  res.json(animal);
  }
});

// get index.html to be served from Express.js server
// the single "/" brings us to the root route of the server
// using the path module in here again to ensure we are finding the correct location for the HTML code
// we want to display in the browser
app.get('/', (req, res) => {
  // IMPORTANT USE 2 UNDERSCORES WITH DIRNAME FOR ABSOLUTLEY NO FUCKING REASON OR THIS WON'T WORK!!
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// this route takes us to /animals.html
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

// this route takes us to /zookeeprs.html
app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// this route takes us to a "wildcard" which means any route that wasn't previously defined
// The homepage will be the default for this
// Wildcard (*) route must ALWAYS COME LAST IN THIS LIST
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// sets up server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});