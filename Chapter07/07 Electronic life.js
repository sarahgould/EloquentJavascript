// VECTOR

function Vector (x, y) {
    // A two-dimentional vector object.
    var self = this;
    self.x = x;
    self.y = y;
}
Vector.prototype.plus = function (other) {
    // Add two vectors together.
    var self = this;
    return new Vector(self.x + other.x, self.y + other.y);
};

// GRID

function Grid (width, height) {
    // A two-dimensional grid.
    var self = this;
    self.space = new Array(width * height);
    self.width = width;
    self.height = height;
}
Grid.prototype.isInside = function (vector) {
    // Check if a given space is inside the grid.
    var self = this;
    return vector.x >= 0 && vector.x < self.width &&
           vector.y >= 0 && vector.y < self.height;
};
Grid.prototype.get = function (vector) {
    // Get the value of a space on the grid.
    var self = this;
    return self.space[vector.x + self.width * vector.y];
};
Grid.prototype.set = function (vector, value) {
    // Set a space on the grid to a particular value.
    var self = this;
    self.space[vector.x + self.width * vector.y] = value;
};

var directions = {
    'n': new Vector(0, -1),
    'ne': new Vector(1, -1),
    'e': new Vector(1, 0),
    'se': new Vector(1, 1),
    's': new Vector(0, 1),
    'sw': new Vector(-1, 1),
    'w': new Vector(-1, 0),
    'nw': new Vector(-1, -1)
};

var directionNames = 'n ne e se s sw w nw'.split(' ');

function dirPlus (dir, n) {
    // Compute new direction relative to given direction.
    var index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
}

function randomElement (array) {
    // Chooses a random element from an array.
    return array[Math.floor(Math.random() * array.length)];
}

function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

// CRITTERS

function BouncingCritter () {
    // Follows its nose until it bumps into an obstacle,
    // then looks for a random open direction.
    var self = this;
    self.direction = randomElement(directionNames);
}
BouncingCritter.prototype.act = function (view) {
    var self = this;
    if (view.look(this.direction) != ' ') {
        self.direction = view.find(' ') || 's';
    }
    return { type: 'move', direction: self.direction };
};

function WallFollower () {
    // Follows the wall.
    var self = this;
    self.dir = 's';
};
WallFollower.prototype.act = function (view) {
    var self = this;
    var start = self.dir;
    if (view.look(dirPlus(self.dir, -3)) !== ' ') {
        start = self.dir = dirPlus(self.dir, -2);
    }
    while (view.look(self.dir) !== ' ') {
        self.dir = dirPlus(self.dir, 1);
        if (self.dir === start) { break; }
    }
    return { type: 'move', direction: self.dir };
};

// ELEMENTS

function elementFromChar (legend, ch) {
    // Looks up a map element based on a lookup symbol.
    if (ch === ' ') { return null; }
    var element = new legend[ch]();
    element.originChar = ch;
    return element;
}
function charFromElement (element) {
    // Gets the original lookup symbol of a map element.
    if (element === null) {
        return ' ';
    } else {
        return element.originChar;
    }
}

function Wall() {}

// WORLD

function World (map, legend) {
    var self = this;
    self.grid = new Grid(map[0].length, map.length);
    self.legend = legend;
    
    map.forEach(function (line, y) {
        for (var x=0; x < line.length; x++) {
            self.grid.set(new Vector(x, y),
                     elementFromChar(legend, line[x]));
        }
    });
}
World.prototype.toString = function () {
    // Generates an ASCII rendering of the map.
    var self = this;
    var output = '';
    for (var y=0; y < self.grid.height; y++) {
        for (var x=0; x < self.grid.width; x++) {
            var element = self.grid.get(new Vector(x,y));
            output += charFromElement(element);
        }
        output += '\n';
    }
    return output;
};
World.prototype.turn = function () {
    // Gives each critter a chance to act.
    var self = this;
    var acted = [];
    self.grid.forEach(function (critter, vector) {
        if (critter.act && acted.indexOf(critter) == -1) {
            acted.push(critter);
            self.letAct(critter, vector);
        }
    });
};
World.prototype.letAct = function (critter, vector) {
    // Have a critter act.
    var self = this;
    var action = critter.act(new View(self, vector));
    if (action && action.type === 'move') {
        var dest = self.checkDestination(action, vector);
        if (dest && self.grid.get(dest) === null) {
            self.grid.set(vector, null);
            self.grid.set(dest, critter);
        }
    }
};
World.prototype.checkDestination = function (action, vector) {
    // Check to see if the critter can move in the direction is wants.
    var self = this;
    if (directions.hasOwnProperty(action.direction)) {
        var dest = vector.plus(directions[action.direction]);
        if (self.grid.isInside(dest)) {
            return dest;
        }
    }
};

// VIEW

function View (world, vector) {
    var self = this;
    self.world = world;
    self.vector = vector;
}
View.prototype.look = function (dir) {
    // Examine the space in a given direction.
    var self = this;
    var target = self.vector.plus(directions[dir]);
    if (self.world.grid.isInside(target)) {
        return charFromElement(self.world.grid.get(target));
    } else {
        return '#';
    }
};
View.prototype.findAll = function (ch) {
    // Find the directions of all elements of a given type.
    var self = this;
    var found = [];
    for (var dir in directions) {
        if (self.look(dir) === ch) {
            found.push(dir);
        }
    }
    return found;
};
View.prototype.find = function (ch) {
    // Choose the direction of a random adjacent element of a given type.
    var self = this;
    var found = self.findAll(ch);
    if (found.length === 0) { return null; }
    return randomElement(found);
};

// LIFE-LIKE WORLD

function LifelikeWorld (map, legend) {
    var self = this;
    World.call(self, map, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype);
LifelikeWorld.prototype.letAct = function (critter, vector) {
    // Have each critter act.
    var self = this;
    var action = critter.act(new View(self, vector));
    var handled = action &&
        action.type in actionTypes &&
        actionTypes[action.type].call(self, critter, vector, action);
    // If the action fails, the critter loses energy and eventually dies.
    if (!handled) {
        critter.energy -= 0.2;
        if (critter.energy <= 0) {
            self.grid.set(vector, null);
        }
    }
};

// ACTION TYPES

var actionTypes = Object.create(null);

actionTypes.grow = function (critter) {
    // The critter gains energy.
    var self = this;
    critter.energy += 0.5;
    return true;
};

actionTypes.move = function (critter, vector, action) {
    // If there is empty space in front of the critter, move there.
    var self = this;
    var dest = self.checkDestination(action, vector);
    if (dest === null ||
            critter.energy <= 1 ||
            self.grid.get(dest) !== null) {
        return false;
    }
    critter.energy -= 1;
    self.grid.set(vector, null);
    self.grid.set(dest, critter);
    return true;
};

actionTypes.eat = function (critter, vector, action) {
    // If there is food in front of the critter, eat it and gain its energy.
    var self = this;
    var dest = self.checkDestination(action, vector);
    var atDest = dest !== null && self.grid.get(dest);
    if (!atDest || atDest.energy === null) {
        return false;
    }
    critter.energy += atDest.energy;
    self.grid.set(dest, null);
    return true;
};

actionTypes.reproduce = function (critter, vector, action) {
    // If critter has enough energy and an empty space, produce offspring.
    var self = this;
    var baby = elementFromChar(self.legend, critter.originChar);
    var dest = self.checkDestination(action, vector);
    if (dest === null ||
            critter.energy <= 2 * baby.energy ||
            self.grid.get(dest) !== null) {
        return false;
    }
    critter.energy -= 2 * baby.energy;
    self.grid.set(dest, baby);
    return true;
};

// LIFE-LIKE CRITTERS

function Plant () {
    var self = this;
    self.energy = 3 + Math.random() * 4;
}
Plant.prototype.act = function (context) {
    // Plants reproduce when there's enough energy and space,
    // otherwise it just grows.
    var self = this;
    if (self.energy > 15) {
        var space = context.find(' ');
        if (space) {
            return { type: 'reproduce', direction: space };
        }
    }
    if (self.energy < 20) {
        return { type: 'grow' };
    }
};

function PlantEater () {
    var self = this;
    self.energy = 20;
}
PlantEater.prototype.act = function (context) {
    var self = this;
    var space = context.find(' ');
    if (self.energy > 60 && space) {
        return { type: 'reproduce', direction: space };
    }
    var plant = context.find('*');
    if (plant) {
        return { type: 'eat', direction: plant };
    }
    if (space) {
        return { type: 'move', direction: space };
    }
};

// EXERCISE 1: Artificial stupidity

function SmartPlantEater() {
    var self = this;
    self.energy = 20;
    self.age = Math.random() * 10;
    self.hungry = true;
    self.dir = randomElement(directionNames);
}
SmartPlantEater.prototype.act = function (context) {
    var self = this;
    var space = context.find(' ');
    self.age ++;
    
    // Go into eating mode when starving, stop when full.
    if (self.energy < 20) { self.hungry = true; }
    if (self.energy > 60) { self.hungry = false; }
    
    // Look for food if sufficiently hungry or if trapped by plants.
    if (self.hungry || space === null) {
        var plant = context.find('*');
        if (plant) {
            return { type: 'eat', direction: plant };
        } else {
            // Move straight ahead to look for food.
            if (context.look(self.dir) !== ' ' && space) {
                self.dir = space;
            }
            return { type: 'move', direction: self.dir };
        }
    }

    // Reproduce if the right age and sufficiently full of energy.
    // Note: if there are tigers, ignore age; they'll need to breed to compete!
    if (self.age > 60 && self.energy > 60 && space) {
        self.age = 0;
        return { type: 'reproduce', direction: space };
    }
  
    // Move randomly if there's nothing else to do.
    if (space) {
        self.dir = space;
    }
    return { type: 'move', direction: self.dir };
};

/*
// Book code:

function SmartPlantEater() {
  this.energy = 30;
  this.direction = "e";
}
SmartPlantEater.prototype.act = function(context) {
  var space = context.find(" ");
  if (this.energy > 90 && space)
    return {type: "reproduce", direction: space};
  var plants = context.findAll("*");
  if (plants.length > 1)
    return {type: "eat", direction: randomElement(plants)};
  if (context.look(this.direction) != " " && space)
    this.direction = space;
  return {type: "move", direction: this.direction};
};

*/

// EXERCISE 2: Predators

function Tiger () {
    var self = this;
    self.energy = 100;
    self.timer = 0;
    self.memory = [-100, -100, -100];
    self.dir = randomElement(directionNames);
}
Tiger.prototype.act = function (context) {
    var self = this;
    
    function abundanceOfPrey () {
        // Determine the relative abundance of prey based
        // on recent encounters.
        return average([
            self.timer - self.memory[0],
            self.memory[0] - self.memory[1],
            self.memory[1] - self.memory[2]
            ]);
    }
    
    // Remember the last three prey that have been encountered.
    self.timer ++;
    var prey = context.find('O');
    if (prey) {
        self.memory.unshift(self.timer);
        self.memory.pop();
    }
    
    var abundance = abundanceOfPrey();
    var space = context.find(' ');
    
    // Reproduce if there's a lot of prey and a lot of energy.
    if (abundance < 3 && self.energy > 200 && space) {
        return { type: 'reproduce', direction: space };
    }
    
    // Eat if there's a lot of prey and kind of hungry.
    if (abundance < 3 && self.energy < 200 && prey) {
        return { type: 'eat', direction: prey };
    }
    
    // Eat if really hungry.
    if (self.energy < 50 && prey) {
        return { type: 'eat', direction: prey };
    }
    
    // Hug walls if there are enough prey,
    // otherwise go on the prowl.
    if (abundance < 10 && self.energy > 50) {
        var start = self.dir;
        if (context.look(dirPlus(self.dir, -3)) !== ' ') {
            start = self.dir = dirPlus(self.dir, -2);
        }
        while (context.look(self.dir) !== ' ') {
            self.dir = dirPlus(self.dir, 1);
            if (self.dir === start) { break; }
        }
    } else if (context.look(self.dir) !== ' ' && space) {
        self.dir = space;
    }
    return { type: 'move', direction: self.dir };
};
      
/*
// Book code:

function Tiger() {
  this.energy = 100;
  this.direction = "w";
  // Used to track the amount of prey seen per turn in the last six turns
  this.preySeen = [];
}
Tiger.prototype.act = function(context) {
  // Average number of prey seen per turn
  var seenPerTurn = this.preySeen.reduce(function(a, b) {
    return a + b;
  }, 0) / this.preySeen.length;
  var prey = context.findAll("O");
  this.preySeen.push(prey.length);
  // Drop the first element from the array when it is longer than 6
  if (this.preySeen.length > 6)
    this.preySeen.shift();

  // Only eat if the predator saw more than ¼ prey animal per turn
  if (prey.length && seenPerTurn > 0.25)
    return {type: "eat", direction: randomElement(prey)};
    
  var space = context.find(" ");
  if (this.energy > 400 && space)
    return {type: "reproduce", direction: space};
  if (context.look(this.direction) != " " && space)
    this.direction = space;
  return {type: "move", direction: this.direction};
};

*/