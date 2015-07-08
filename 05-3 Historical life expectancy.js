var ancestryFile = require('./05_higher_order/code/ancestry.js');
var ancestry = JSON.parse(ancestryFile);

function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

// Your code here.
function groupBy(array, f) {
    var groupObject = {};
    array.forEach(function (item) {
        var groupName = f(item);
        if (!groupObject[groupName]) {
            groupObject[groupName] = [item];
        } else {
            groupObject[groupName].push(item);
        }
    });
    return groupObject;
}

var ageByCentury = groupBy(ancestry, function (person) {
        return Math.ceil(person.died / 100);
    });
for (century in ageByCentury) {
    var averageAge = average(ageByCentury[century].map(function(person) {
        return (person.died-person.born);
    }));
    console.log(century + ': ' + averageAge);
}

// → 16: 43.5
//   17: 51.2
//   18: 52.8
//   19: 54.8
//   20: 84.7
//   21: 94

/*
// Book code

function groupBy(array, groupOf) {
  var groups = {};
  array.forEach(function(element) {
    var groupName = groupOf(element);
    if (groupName in groups)
      groups[groupName].push(element);
    else
      groups[groupName] = [element];
  });
  return groups;
}

var byCentury = groupBy(ancestry, function(person) {
  return Math.ceil(person.died / 100);
});

for (var century in byCentury) {
  var ages = byCentury[century].map(function(person) {
    return person.died - person.born;
  });
  console.log(century + ": " + average(ages));
}

*/