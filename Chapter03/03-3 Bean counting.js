// Your code here.
function countChar(str, char) {
  var numChar = 0;
  for (var pos = 0; pos < str.length; pos ++) {
    if (str.charAt(pos) === char) {
      numChar ++;
    }
  }
  return numChar;
}

function countBs(str) {
  countChar(str, 'B');
}

console.log(countBs("BBC"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4

/*
// Book code
function countChar(string, ch) {
  var counted = 0;
  for (var i = 0; i < string.length; i++)
    if (string.charAt(i) == ch)
      counted += 1;
  return counted;
}

function countBs(string) {
  return countChar(string, "B");
}

console.log(countBs("BBC"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4
*/