var tables = require('./06_object/code/chapter/06_object.js');

function StretchCell(inner, width, height) {
    this.inner = inner;
    this.newWidth = width;
    this.newHeight = height;
};

StretchCell.prototype.minWidth = function() {
    return Math.max(this.inner.minWidth(), this.newWidth);
};

StretchCell.prototype.minHeight = function() {
    return Math.max(this.inner.minHeight(), this.newHeight);
};

StretchCell.prototype.draw = function(width, height) {
    return this.inner.draw(width, height);
};

var sc = new StretchCell(new tables.TextCell("abc"), 1, 2);
console.log(sc.minWidth());
// → 3
console.log(sc.minHeight());
// → 2
console.log(sc.draw(3, 2));
// → ["abc", "   "]


/*
// Book code

function StretchCell(inner, width, height) {
  this.inner = inner;
  this.width = width;
  this.height = height;
}

StretchCell.prototype.minWidth = function() {
  return Math.max(this.width, this.inner.minWidth());
};
StretchCell.prototype.minHeight = function() {
  return Math.max(this.height, this.inner.minHeight());
};
StretchCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height);
};

*/