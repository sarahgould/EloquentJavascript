function logFive(sequence) {
    sequence.reset();
    for (var i=0; i < 5; i++) {
        if (sequence.lastElement()) {
            break;
        } else {
            console.log(sequence.next());
        }
    }
}

function ArraySeq(array) {
    this.array = array;
    this.index = -1;
}

ArraySeq.prototype.reset = function() {
    // Resets to the beginning of the sequence.
    this.index = -1;
};

ArraySeq.prototype.lastElement = function() {
    // Checks to see if there are any more elements.
    return this.array[this.index+1] === undefined;
};

ArraySeq.prototype.next = function() {
    // Returns current element and then increments index.
    this.index ++;
    return this.array[this.index];
};



function RangeSeq(from, to) {
    this.from = from;
    this.to = to;
    this.current = from - 1;
}

RangeSeq.prototype.reset = function() {
    // Resets to the beginning of the sequence.
    this.current = this.from - 1;
};

RangeSeq.prototype.lastElement = function() {
    // Checks to see if there are any more elements.
    return this.current + 1 > this.to;
};

RangeSeq.prototype.next = function() {
    // Returns current element and then increments index.
    this.current ++;
    return this.current;
};



logFive(new ArraySeq([1, 2]));
// → 1
// → 2
logFive(new RangeSeq(100, 1000));
// → 100
// → 101
// → 102
// → 103
// → 104

/*
// Book code

function logFive(sequence) {
  for (var i = 0; i < 5; i++) {
    if (!sequence.next())
      break;
    console.log(sequence.current());
  }
}

function ArraySeq(array) {
  this.pos = -1;
  this.array = array;
}
ArraySeq.prototype.next = function() {
  if (this.pos >= this.array.length - 1)
    return false;
  this.pos++;
  return true;
};
ArraySeq.prototype.current = function() {
  return this.array[this.pos];
};

function RangeSeq(from, to) {
  this.pos = from - 1;
  this.to = to;
}
RangeSeq.prototype.next = function() {
  if (this.pos >= this.to)
    return false;
  this.pos++;
  return true;
};
RangeSeq.prototype.current = function() {
  return this.pos;
};

*/