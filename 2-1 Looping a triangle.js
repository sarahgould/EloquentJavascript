// My very verbose answer
var symbol = '#';

for (var triangleHeight = 1; triangleHeight < 8; triangleHeight ++) {
  var triangleLine = '';
  for (var triangleWidth = 1; triangleWidth < triangleHeight; triangleWidth ++) {
    triangleLine += symbol;
  }
  console.log(triangleLine + '\n');
}

// The book's answer - so concise!
for (var line = "#"; line.length < 8; line += "#")
  console.log(line);