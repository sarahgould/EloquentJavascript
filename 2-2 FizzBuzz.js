// My perfectly adaquette answer!
for (var counter = 1; counter <= 100; counter ++){
  if (counter % 3 === 0 && counter % 5 === 0) {
    console.log('fizzbuzz');
  } else if (counter % 3 === 0) {
    console.log('fizz');
  } else if (counter % 5 === 0) {
    console.log('buzz');
  } else {
    console.log(counter);
  }
}

// Darn, again, with the elegant stuff:
for (var n = 1; n <= 100; n++) {
  var output = "";
  if (n % 3 == 0)
    output += "Fizz";
  if (n % 5 == 0)
    output += "Buzz";
  console.log(output || n);
}