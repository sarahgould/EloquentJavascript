var ancestryFile = require('./05_higher_order/code/ancestry.js');
var ancestry = JSON.parse(ancestryFile);

function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

var byName = {};
ancestry.forEach(function (person) {
  byName[person.name] = person;
});

// Your code here.
var ageDifferences = [];
ancestry.forEach(
    function (person) {
        var mother = byName[person.mother];
        if (mother) {
            ageDifferences.push(person.born-mother.born);
        }
    });

console.log(average(ageDifferences));

// → 31.2

/*
// Book code

var differences = ancestry.filter(function(person) {
  return byName[person.mother] != null;
}).map(function(person) {
  return person.born - byName[person.mother].born;
});

*/