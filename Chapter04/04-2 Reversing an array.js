function reverseArray(array) {
    var reversedArray = [];
    for (var i = 0; i < array.length; i++) {
        reversedArray.unshift(array[i]);
    }
    return reversedArray;
}

function reverseArrayInPlace(array) {
    for (var i = 0; i < array.length; i++) {
        array.unshift(array[i]);
        array.splice(i+1, 1);
    }
}

var a = [1,2,3,4,5];
console.log(reverseArray(a));
reverseArrayInPlace(a);
console.log(a);

/*
// Book code
function reverseArray(array) {
  var output = [];
  for (var i = array.length - 1; i >= 0; i--)
    output.push(array[i]);
  return output;
}

function reverseArrayInPlace(array) {
  for (var i = 0; i < Math.floor(array.length / 2); i++) {
    var old = array[i];
    array[i] = array[array.length - 1 - i];
    array[array.length - 1 - i] = old;
  }
  return array;
}
*/