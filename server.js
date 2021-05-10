
const {animals} = require('./data/animals');
const express = require('express');
// instantiate the server
const app = express();




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
// sets up server
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
});