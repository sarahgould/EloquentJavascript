function prepend(element, list) {
    return { value: element,
             rest: list };
}

function nth(list, pos) {
    var element = list;
    for (var i = 0; i < pos; i++) {
        if (element.rest) {
            element = element.rest;
        } else {
            element = undefined;
        }
    }
    if (element) {
        return element.value;
    } else {
        return undefined;
    }
}

function nthR(list, pos) {
    if (pos === 0) {
        return list.value;
    } else if (list && list.rest) {
        return nth(list.rest, pos-1);
    } else {
        return undefined;
    }
}

function arrayToList(array) {
    var list = null;
    for (var i = array.length-1; i >= 0; i--) {
        list = prepend(array[i], list);
    }
    return list;
}

function listToArray(list) {
    var array = [];
    var i = 0;
    while (i >= 0) {
        element = nthR(list, i);
        if (element) {
            array.push(element);
            i++;
        } else {
            i = -1;
        }
    }
    return array;
}
        

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20

/*
// Book code
function arrayToList(array) {
  var list = null;
  for (var i = array.length - 1; i >= 0; i--)
    list = {value: array[i], rest: list};
  return list;
}

function listToArray(list) {
  var array = [];
  // vvv WHOA! vvv
  for (var node = list; node; node = node.rest) 
    array.push(node.value);
  return array;
}

function prepend(value, list) {
  return {value: value, rest: list};
}

function nth(list, n) {
  if (!list)
    return undefined;
  else if (n == 0)
    return list.value;
  else
    return nth(list.rest, n - 1);
}
*/