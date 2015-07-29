var Egg = (function () {
    
    var run = function () {
        var env = Object.create(topEnv);
        var program = Array.prototype.slice.call(arguments, 0).join('\n');
        return eval(parse(program), env);
    };
    
    //=======
    // PARSE
    //=======
    
    var syntax = {
        // RegExp's for syntax.
        'string': /^"([^"]*)"/,
        'number': /^\d+\b/,
        'word': /^[^\s(),"]+/,
    };
    
    var parse = function (program) {
        // Parse the program string.
        var result = parseExpression(program);
        if (skipSpace(result.rest).length > 0) {
            throw new SyntaxError('Unexpected text after program.');
        }
        return result.expr;
    };
    
    var parseExpression = function (program) {
        // Parse an expression.
        program = skipSpace(program);
        var match, expr;
        if (match = syntax.string.exec(program)) {
            // It's a string!
            expr = {type: 'value', value: match[1]};
        } else if (match = syntax.number.exec(program)) {
            // It's a number!
            expr = {type: 'value', value: Number(match[0])};
        } else if (match = syntax.word.exec(program)) {
            // It's a word!
            expr = {type: 'word', name: match[0]};
        } else {
            // Not a valid expression.
            throw new SyntaxError('Unexpected syntax: ' + program);
        }
        return parseApply(expr, program.slice(match[0].length));
    };
    
    var parseApply = function (expr, program) {
        // If the expression is an application, parse the arguments.
        program = skipSpace(program);
        if (program[0] != '(') {
            // It's not an application, just return expression.
            return {expr: expr, rest: program};
        }
        program = skipSpace(program.slice(1));
        expr = {type: 'apply', operator: expr, args: []};
        while (program[0] != ')') {
            // Parse each argument.
            var arg = parseExpression(program);
            expr.args.push(arg.expr);
            program = skipSpace(arg.rest);
            if (program[0] == ',') {
                program = skipSpace(program.slice(1));
            } else if (program[0] != ')') {
                throw new SyntaxError("Expected ',' or ')'");
            }
        }
        return parseApply(expr, program.slice(1));
    };
    
    var skipSpace = function (string) {
        // Get rid of unnecessary whitespace (hint: it's all unnecessary.)
        var first = string.search(/\S/);
        if (first == -1) { return ''; }
        return string.slice(first);
    };
    
    //======
    // EVAL
    //======
    
    var eval = function (expr, env) {
        // Evaluate an expression in a given environment.
        return evalType[expr.type](expr, env);
    };
    
    var evalType = {
        'value': function (expr, env) {
            // Return a basic value.
            return expr.value;
        },
        'word': function (expr, env) {
            // Lookup the value of a word. 
            if (expr.name in env) {
                return env[expr.name];
            } else {
                throw new ReferenceError('Undefined variable: ' + expr.name);
            }
        },
        'apply': function (expr, env) {
            // Apply a function to its arguments.
            if (expr.operator.type == 'word' &&
                    expr.operator.name in specialForms) {
                return specialForms[expr.operator.name](expr.args, env);
            }
            var op = eval(expr.operator, env);
            if (typeof op != 'function') {
                throw new TypeError('Applying a non-function.');
            }
            return op.apply(null, expr.args.map( function(arg) {
                return eval(arg, env);
            }));
        },
    };
    
    
    //===========
    // BUILT-INS
    //===========
    
    var specialForms = {
    
        'if': function (args, env) {
            // Ternary conditional.
            if (args.length != 3) {
                throw new SyntaxError('Bad number of args to if.');
            }
            if (eval(args[0], env) !== false) {
                return eval(args[1], env);
            } else {
                return eval(args[2], env);
            }
        },
    
        'while': function (args, env) {
            // Loop. Loop. Loop. Loooooop.
            if (args.length != 2) {
                throw new SyntaxError('Bad number of args to while.');
            }
            while (eval(args[0], env) !== false) {
                eval(args[1], env);
            }
            // We return 'false' as a meaningless result.
            return false;
        },
    
        'do': function (args, env) {
            // String several expressions together in sequence.
            var value = false;
            args.forEach( function (arg) {
                value = eval(arg, env);
            });
            // Return value of last expression.
            return value;
        },
    
        'define': function (args, env) {
            // Creating ye olde variables since 2015.
            if (args.length != 2 || args[0].type != 'word') {
                throw new SyntaxError('Bad use of define.');
            }
            var value = eval(args[1], env);
            env[args[0].name] = value;
            return value;
        },
        
        'fun': function (args, env) {
            // Now we're playing with functions.
            if (!args.length) {
                throw new SyntaxError('Functions need a body');
            }
            var name = function (expr) {
                if (expr.type != 'word') {
                    throw new SyntaxError('Arg names must be words');
                }
                return expr.name;
            };
            var argNames = args.slice(0, args.length - 1).map(name);
            var body = args[args.length - 1];
            return function () {
                if (arguments.length != argNames.length) {
                    throw new TypeError('Wrong number of arguments');
                }
                var localEnv = Object.create(env);
                for (var i = 0; i < arguments.length; i++) {
                    localEnv[argNames[i]] = arguments[i];
                }
                return eval(body, localEnv);
            };
        },
    };
    specialForms.prototype = null;
    
    //=============
    // ENVIRONMENT
    //=============
    
    var topEnv = {
        'true': true,
        'false': false,
        'eq': function (a, b) {
            return a === b;
        },
        'print': function (value) {
            console.log(value);
            return value;
        },
    };
    
    ['+', '-', '*', '/', '<', '>'].forEach( function (op) {
        topEnv[op] = new Function('a, b', 'return a ' + op + ' b;');
    });
    
    topEnv.prototype = null;
    
    //=========
    // COMPILE
    //=========
    
    var compile = function () {
    };
    
    //========
    // EXPORT
    //========
    
    return {
        run: run
    };
    
})();

/*
Egg.run(    "do(define(total, 0),",
            "   define(count, 1),",
            "   while(<(count, 11),",
            "         do(define(total, +(total, count)),",
            "            define(count, +(count, 1)))),",
            "   print(total))");

Egg.run("do(define(plusOne, fun(a, +(a, 1))),",
    "   print(plusOne(10)))");
// → 11

Egg.run("do(define(pow, fun(base, exp,",
    "     if(eq(exp, 0),",
    "        1,",
    "        *(base, pow(base, -(exp, 1)))))),",
    "   print(pow(2, 10)))");
// → 1024
*/
