// New answer using factory functions.
var vector = {
    plus: function (v) {
        return createVector(this.x + v.x, this.y + v.y);
    },
    minus: function (v) {
        return createVector(this.x - v.x, this.y - v.y);
    },
    get length () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
};

var createVector = function (x, y) {
    var v = Object.create(vector);
    v.x = x;
    v.y = y;
    return v;
};

console.log(createVector(1, 2).plus(createVector(2, 3)));
// → Vector{x: 3, y: 5}
console.log(createVector(1, 2).minus(createVector(2, 3)));
// → Vector{x: -1, y: -1}
console.log(createVector(3, 4).length);
// → 5

/*
// Old answer, using constructors.

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.plus = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
}

Vector.prototype.minus = function(v) {
    return new Vector(this.x - v.x, this.y - v.y);
}

Object.defineProperty(Vector.prototype, 'length', {
    get: function() { return Math.sqrt(this.x*this.x + this.y*this.y); }
});
*/

/*
// Book code

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.minus = function(other) {
  return new Vector(this.x - other.x, this.y - other.y);
};

Object.defineProperty(Vector.prototype, "length", {
  get: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
});

*/