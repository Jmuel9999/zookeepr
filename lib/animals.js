
const fs = require("fs");
const path = require("path");

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
      path.join(__dirname, '../data/animals.json'),
      // save the JS array data as JSON, so we used JSON.stringify()
      // 'null' means we don't want to edit existing data
      // '2' indicates we want white space between our values to make it more readable
      JSON.stringify({animals: animalsArray}, null, 2)
    );  
    // return finished code to post route for response
    return animal;
};

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

// export the functions for use by other files
module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};