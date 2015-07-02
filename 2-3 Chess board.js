// My solution
var size = 8;
var output = '';
var evenString, oddString;

for (var row = 1; row <= size; row++) {
  if (row % 2 === 0) {
    evenString = ' ';
    oddString = '#';
  } else {
    evenString = '#';
    oddString = ' ';
  }
  for (var col = 1; col <= size; col++) {
    if (col % 2 === 0) {
      output += evenString;
    } else {
      output += oddString;
    }
  }
  output += '\n';
}

console.log(output);

// Book solution
var size = 8;

var board = "";

for (var y = 0; y < size; y++) {
  for (var x = 0; x < size; x++) {
    if ((x + y) % 2 == 0)
      board += " ";
    else
      board += "#";
  }
  board += "\n";
}

console.log(board);