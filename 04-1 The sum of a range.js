function range(start, end, step) {
    step = step || 1;
    var array = [];
    if (end > start) {
        for (var i = start; i <= end; i += step) {
            array.push(i);
        }
    } else {
        for (var i = start; i >= end; i += step) {
            array.push(i);
        }
    }
    return array;
}

function sum(array) {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }
    return total;
}

console.log(range(1,10));
console.log(sum(range(1,10)));

console.log(range(1,10,2));
console.log(range(5,2, -1));