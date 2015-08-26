// -------------------------------
// VECTOR
// -------------------------------

var vectorObject = {
    plus: function (v) {
        return Vector(this.x + v.x, this.y + v.y);
    },
    times: function (factor) {
        return Vector(this.x * factor, this.y * factor);
    },
    get length () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
};

var Vector = function (x, y) {
    var v = Object.create(vectorObject);
    v.x = x;
    v.y = y;
    return v;
};

// -------------------------------
// LEVEL
// -------------------------------

var levelObject = {
    maxStep: 0.05,

    obstacleAt: function (pos, size) {
        var xStart = Math.floor(pos.x);
        var xEnd = Math.ceil(pos.x + size.x);
        var yStart = Math.floor(pos.y);
        var yEnd = Math.ceil(pos.y + size.y);
        if (xStart < 0 || xEnd > this.width || yStart < 0) {
            return 'wall';
        }
        if (yEnd > this.height) {
            return 'lava';
        }
        for (var y=yStart; y<yEnd; y++) {
            for (var x=xStart; x<xEnd; x++) {
                var fieldType = this.grid[y][x];
                if (fieldType) { return fieldType; };
            }
        }
    },

    actorAt: function (actor) {
        for (var i=0; i<this.actors.length; i++) {
            var other = this.actors[i];
            if (other != actor &&
                actor.pos.x + actor.size.x > other.pos.x &&
                actor.pos.x < other.pos.x + other.size.x &&
                actor.pos.y + actor.size.y > other.pos.y &&
                actor.pos.y < other.pos.y + other.size.y) {
                return other;
            }
        }
    },

    animate: function (step, keys) {
        if (this.status != null) {
            this.finishDelay -= step;
        }
        while (step > 0) {
            var thisStep = Math.min(step, this.maxStep);
            this.actors.forEach( function (actor) {
                actor.act(thisStep, this, keys);
            }, this);
            step -= thisStep;
        }
    },

    act: function (step, level) {
        var newPos = this.pos.plus(this.speed.times(step));
        if (!level.obstacleAt(newPos, this.size)) {
            this.pos = newPos;
        } else if (this.repeatPos) {
            this.pos = this.repeatPos;
        } else {
            this.speed = this.speed.times(-1);
        }
    },

    playerTouched: function (type, actor) {
        if (type == 'lava' && this.status == null) {
            this.status = 'lost';
            this.finishDelay = 1;
        } else if (type == 'coin') {
            this.actors = this.actors.filter( function (other) {
                return other != actor;
            });
            if (!this.actors.some( function(actor) {
                return actor.type == 'coin';
            })) {
                this.status = 'won';
                this.finishDelay = 1;
            }
        }
    },

    isFinished: function() {
        return this.status != null && this.finishDelay < 0;
    },
};

var Level = function (plan) {
    var l = Object.create(levelObject);
    l.width = plan[0].length;
    l.height = plan.length;
    l.grid = [];
    l.actors = [];
    l.player = {};
    l.status = null;
    l.finishDelay = null;

    var actorChars = {
        '@': Player,
        'o': Coin,
        '=': Lava, '|': Lava, 'v': Lava
    };

    var worldChars = {
        'x': 'wall',
        '!': 'lava'
    };

    for (var y=0; y<l.height; y++) {
        var line = plan[y], gridLine = [];
        for (var x=0; x<l.width; x++) {
            var ch = line[x], fieldType = null;
            if (actorChars[ch]) {
                l.actors.push(actorChars[ch](Vector(x,y), ch));
            } else if (worldChars[ch]) {
                fieldType = worldChars[ch];
            }
            gridLine.push(fieldType);
        }
        l.grid.push(gridLine);
    }

    l.player = l.actors.filter( function (actor) {
        return actor.type == 'player';
    })[0];

    return l;
};


// -------------------------------
// PLAYER
// -------------------------------

var playerObject = {
    type: 'player',
    playerXSpeed: 7,
    gravity: 30,
    jumpSpeed: 17,

    moveX: function (step, level, keys) {
        this.speed.x = 0;
        if (keys.left) { this.speed.x -= this.playerXSpeed; }
        if (keys.right) { this.speed.x += this.playerXSpeed; }

        var motion = Vector(this.speed.x * step, 0);
        var newPos = this.pos.plus(motion);
        var obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle) {
            level.playerTouched(obstacle);
        } else {
            this.pos = newPos;
        }
    },

    moveY: function (step, level, keys) {
        this.speed.y += step * this.gravity;
        var motion = Vector(0, this.speed.y * step);
        var newPos = this.pos.plus(motion);
        var obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle) {
            level.playerTouched(obstacle);
            if (keys.up && this.speed.y > 0) {
                this.speed.y = -this.jumpSpeed;
            } else {
                this.speed.y = 0;
            }
        } else {
            this.pos = newPos;
        }
    },

    act: function (step, level, keys) {
        this.moveX(step, level, keys);
        this.moveY(step, level, keys);

        var otherActor = level.actorAt(this);
        if (otherActor) {
            level.playerTouched(otherActor.type, otherActor);
        }

        if (level.status == 'lost') {
            this.pos.y += step;
            this.size.y -= step;
        }
    },
};

var Player = function (pos) {
    var p = Object.create(playerObject);
    p.pos = pos.plus(Vector(0, -0.5));
    p.size = Vector(0.8, 1.5);
    p.speed = Vector(0, 0);
    return p;
};

// -------------------------------
// LAVA
// -------------------------------

var lavaObject = {
    type: 'lava',

    act: function (step, level) {
        var newPos = this.pos.plus(this.speed.times(step));
        if (!level.obstacleAt(newPos, this.size)) {
            this.pos = newPos;
        } else if (this.repeatPos) {
            this.pos = this.repeatPos;
        } else {
            this.speed = this.speed.times(-1);
        }
    },
};

var Lava = function (pos, ch) {
    var l = Object.create(lavaObject);

    var lavaSpeeds = {
        '=': Vector(2,0),
        '|': Vector(0,2),
        'v': Vector(0,3)
    };
    var lavaPos = { 'v': pos };

    l.pos = pos;
    l.size = Vector(1,1);
    l.speed = lavaSpeeds[ch];
    l.repeatPos = lavaPos[ch];

    return l;
};

// -------------------------------
// COIN
// -------------------------------

var coinObject = {
    type: 'coin',
    wobbleSpeed: 8,
    wobbleDist: 0.07,

    act: function (step) {
        this.wobble += step * this.wobbleSpeed;
        var wobblePos = Math.sin(this.wobble) * this.wobbleDist;
        this.pos = this.basePos.plus(Vector(0, wobblePos));
    },
};

var Coin = function (pos) {
    pos = pos.plus(Vector(0.2, 0.1));

    var c = Object.create(coinObject);
    c.basePos = pos;
    c.pos = pos;
    c.size = Vector(0.6, 0.6);
    c.wobble = Math.random() * Math.PI * 2;

    return c;
};

// -------------------------------
// DISPLAY
// -------------------------------

var DOMDisplayObject = {
    scale: 20,

    drawBackground: function () {
        var self = this;
        var table = $('<table>', {class: 'background'});
        table.css('width', self.level.width * self.scale + 'px');
        self.level.grid.forEach( function (row) {
            var rowElt = $('<tr>');
            rowElt.css('height', self.scale + 'px');
            row.forEach( function (type) {
                rowElt.append($('<td>', {class: type}));
            });
            table.append(rowElt);
        });
        return table;
    },

    drawActors: function () {
        var wrap = $('<div>', {id: 'actors'});
        var self = this;
        this.level.actors.forEach( function (actor) {
            var rect = $('<div>');
            rect.addClass('actor');
            rect.addClass(actor.type);
            rect.css({  width:  actor.size.x * self.scale + 'px',
                        height: actor.size.y * self.scale + 'px',
                        left:   actor.pos.x * self.scale + 'px',
                        top:    actor.pos.y * self.scale + 'px'
                     });
            wrap.append(rect);
        });
        wrap.append($('<div>', {class: 'message'}).css('left', this.wrap.scrollLeft()));
        return wrap;
    },

    drawFrame: function () {
        if (this.actorLayer) {
            this.actorLayer.remove();
        }
        this.actorLayer = this.drawActors();
        this.wrap.append(this.actorLayer);
        this.wrap.addClass((this.level.status || ''));
        this.scrollPlayerIntoView();
    },

    scrollPlayerIntoView: function () {
        var width = this.wrap.width();
        var height = this.wrap.height();
        var margin = width / 3;

        var left = this.wrap.scrollLeft(), right = left + width;
        var top = this.wrap.scrollTop(), bottom = top + height;

        var player = this.level.player;
        var center = player.pos.plus(player.size.times(0.5)).times(this.scale);

        if (center.x < left+margin) {
            this.wrap.scrollLeft(center.x-margin);
        } else if (center.x > right-margin) {
            this.wrap.scrollLeft(center.x+margin-width);
        } else if (center.y < top+margin) {
            this.wrap.scrollTop(center.y-margin);
        } else if (center.y > bottom-margin) {
            this.wrap.scrollTop(center.y+margin-height);
        }
    },

    clear: function () {
        this.wrap.remove();
    },
};

var DOMDisplay = function (parent, level) {
    var d = Object.create(DOMDisplayObject);
    d.wrap = $('<div>', {class: 'game'});
    d.level = level;

    d.wrap.append(d.drawBackground());
    d.actorLayer = null;
    d.drawFrame()

    parent.append(d.wrap);

    return d;
};

// -------------------------------
// KEYS
// -------------------------------

var trackKeys = function (codes) {
    var pressed = Object.create(null);
    var handler = function (e) {
        if (codes.hasOwnProperty(e.which)) {
            var down = (e.type == 'keydown');
            pressed[codes[e.which]] = down;
            e.preventDefault();
        }
    };

    $('html').keydown(handler);
    $('html').keyup(handler);

    return pressed;
};

var untrackKeys = function () {
    $('html').off('keydown');
    $('html').off('keyup');
};

// -------------------------------
// ANIMATION
// -------------------------------

var runAnimation = function (frameFunc) {
    var lastTime = null;
    var frame = function (time) {
        var stop = false;
        if (lastTime != null) {
            var timeStep = Math.min(time - lastTime, 100) / 1000;
            stop = (frameFunc(timeStep) === false);
        }
        lastTime = time;
        if (!stop) {
            requestAnimationFrame(frame);
        }
    };
    requestAnimationFrame(frame);
};

var runLevel = function (level, Display, andThen) {
    var arrowCodes = {37: 'left', 38: 'up', 39: 'right', 27: 'esc'};
    var arrows = trackKeys(arrowCodes);

    var display = Display($('body'), level);
    var paused = false;

    $('html').keydown( function (e) {
        if (e.which == 27) {
            paused = !paused;
            if (paused) {
                $('.game').addClass('paused');
            } else {
                $('.game').removeClass('paused');
            }
        }
    });

    runAnimation( function (step) {
        if (!paused) {
            level.animate(step, arrows);
            display.drawFrame(step);
            if (level.isFinished()) {
                untrackKeys();
                display.clear();
                if (andThen) {
                    andThen(level.status);
                }
                return false;
            }
        }
    });
};

var runGame = function (plans, Display) {
    var lives = 3;
    var startLevel = function (n, lives) {
        var lifeCounter = '';
        for(var i=0; i<lives; i++) {
            lifeCounter += '<div class="life-counter"></div>';
        }
        $('#lives').html(lifeCounter);

        runLevel(Level(plans[n]), Display, function(status) {
            if (status == 'lost') {
                if (lives > 1) {
                    startLevel(n, lives-1);
                } else {
                    startLevel(0, 3);
                }
            } else if (n < plans.length-1) {
                startLevel(n+1, lives);
            } else {
                $('body').append('<div class="message">YOU WON</div>');
            }
        });
    }
    startLevel(0, 3);
};
