
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




// function that filters by search query to bring results back in the form of a new, filtered array
const filterByQuery = function(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  // return the filtered results:
  return filteredResults;
};

const findById = function(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
};

// this function accepts the POST route's req.body value and the array we want to add the data to
const createNewAnimal = function(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  // we are using writeFileSync (synchronous) becasue we are not working with a large data set
  // and it does not require a callback function
  fs.writeFileSync(
    // we want to write to our animals.json file in the data subdirectory
    path.join(__dirname, './data/animals.json'),
    // save the JS array data as JSON, so we used JSON.stringify()
    // 'null' means we don't want to edit existing data
    // '2' indicates we want white space between our values to make it more readable
    JSON.stringify({animals: animalsArray}, null, 2)
  );  
  // return finished code to post route for response
  return animal;
};

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

// typeof operator returns a string indicating the type of the unevaluated param
const validateAnimal = function(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
};

// get index.html to be served from Express.js server
// the single "/" brings us to the root route of the server
// using the path module in here again to ensure we are finding the correct location for the HTML code
// we want to display in the browser
app.get('/', (req, res) => {
  res.sendFile(path.join(_dirname, './public/index.html'));
});

// sets up server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});