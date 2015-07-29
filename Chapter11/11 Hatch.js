var util = require('util');

var Hatch = (function () {
    
    var run = function () {
    };
    
    //=======
    // PARSE
    //=======

    var syntax = {
        // RegExp's for syntax.
        string: /^"([^"]*)"/,
        number: /^(\d+)\b/,
        word: /^(\w+)\b/,
        def: /^(_?\w+)\s*:/,
        return: /^\>/,
        prop: /^\./,
        args: /^\(/,
        argsEnd: /^\)/,
        obj: /^\{/,
        objEnd: /^\}/,
        seq: /^,/,
    };
    
    var parse = function (program) {
        return parseObject(createObject(), program);
    };
    
    var parseExpr = function (rest) {
        var parseSubExpr = function (prev, rest) {
            // Continue parsing until the end of a complete expression.
            rest = skipSpace(rest);
            var expr = [];
            
            var matchString = syntax.string.exec(rest);
            var matchNumber = syntax.number.exec(rest);
            var matchWord = syntax.word.exec(rest);
            var matchObj = syntax.obj.exec(rest);
            var matchProp = syntax.prop.exec(rest);
            var matchArgs = syntax.args.exec(rest);
            var matchSeq = syntax.seq.exec(rest);
            
            if (matchString) {
                // Match a string.
                if (prev) { return [prev, rest]; }
                expr[0] = { type: 'string', value: matchString[1] };
                expr[1] = cutMatch(rest, matchString);
            } else if (matchNumber) {
                // Match a number.
                if (prev) { return [prev, rest]; }
                expr[0] = { type: 'number', value: Number(matchNumber[1]) };
                expr[1] = cutMatch(rest, matchNumber);
            } else if (matchWord) {
                // Match a word.
                if (prev) { return [prev, rest]; }
                expr[0] = { type: 'word', value: matchWord[1] };
                expr[1] = cutMatch(rest, matchWord);
            } else if (matchObj) {
                // Match an object definition.
                if (prev) { return [prev, rest]; }
                expr = parseObject(createObject(), cutMatch(rest, matchObj));
            } else if (matchProp) {
                // Match a property lookup.
                if (prev) {
                    var newRest = cutMatch(rest, matchProp)
                    var nextWord = syntax.word.exec(newRest);
                    expr[0] = { type: 'prop', owner: prev, prop: nextWord[1] };
                    expr[1] = cutMatch(newRest, nextWord);
                } else {
                    //error
                }
            } else if (matchArgs) {
                // Match a function call.
                if (prev) {
                    var args = parseArgs(cutMatch(rest, matchArgs));
                    expr[0] = { type: 'call', caller: prev, args: args[0] };
                    expr[1] = args[1];
                } else {
                    // error
                }
            } else if (matchSeq) {
                // Match a sequence of expressions.
                if (prev) {
                    var nextExpr = parseExpr(cutMatch(rest, matchSeq));
                    expr[0] = { type: 'seq', expr: prev, rest: nextExpr[0] };
                    expr[1] = nextExpr[1];
                } else {
                    // error
                }
            } else {
                // If nothing else, return what you've got.
                // Could lead to an infinite loop if the syntax is incorrect.
                return [prev, rest];
            }
            
            // Check to see if the next thing is a property or call.
            return parseSubExpr(expr[0], expr[1]);
        };
        
        return parseSubExpr(null, rest);
        
    };
    
    var parseDef = function (word, private, rest) {
        // Parse a definition block.
        rest = skipSpace(rest);
        var expr = parseExpr(rest);
        return [{ type: 'def', name: word, private: private, value: expr[0] }, expr[1] ];
    };
    
    var parseArgs = function (rest) {
        var parseAllArgs = function (args, rest) {
            // Continue parsing expressions until the end of the argument block.
            rest = skipSpace(rest);
            var matchArgsEnd = syntax.argsEnd.exec(rest);
            if (matchArgsEnd) {
                return [args, cutMatch(rest, matchArgsEnd)];
            } else {
                var nextArg = parseExpr(rest);
                args.push(nextArg[0]);
                return parseAllArgs(args, nextArg[1]);
            }
        };
        
        return parseAllArgs([], rest);
    };
    
    var parseObject = function (obj, rest) {
        rest = skipSpace(rest);
        if (rest == '') { return obj; }
        
        var matchArgs = syntax.args.exec(rest);
        var matchDef = syntax.def.exec(rest);
        var matchReturn = syntax.return.exec(rest);
        var matchObjEnd = syntax.objEnd.exec(rest);
        
        if (matchArgs) {
            // Match arguments block.
            var args = parseArgs(cutMatch(rest, matchArgs));
            obj.args = args[0];
            rest = args[1];
        } else if (matchDef) {
            // Match a definition.
            var word = matchDef[1];
            var private = false;
            if(word.slice(0,1) == '_') {
                word = word.slice(1);
                private = true;
            }
            var def = parseDef(word, private, cutMatch(rest, matchDef));
            obj.defs.push(def[0]);
            rest = def[1];
        } else if (matchReturn) {
            // Match a return expression.
            var expr = parseExpr(cutMatch(rest, matchReturn));
            obj.expr = expr[0];
            rest = expr[1];
        } else if (matchObjEnd) {
            // Match the end of an object.
            return [obj, cutMatch(rest, matchObjEnd)];
        } else {
            // Assume an unlabeled expression is a return value.
            var expr = parseExpr(rest);
            obj.expr = expr[0];
            rest = expr[1];
        }
        
        return parseObject(obj, rest);
    };
    
    var createObject = function () {
        // Create a blank object.
        return { type: 'object', args: [], defs: [], expr: Object.create(null) };
    };
    
    var skipSpace = function (string) {
        // Get rid of leading whitespace
        var first = string.search(/\S/);
        if (first == -1) { return ''; }
        return string.slice(first);
    };
        
    var cutMatch = function (string, match) {
        return string.slice(match[0].length);
    };
    
    //======
    // EVAL
    //======
    
    var eval = function (expr, env) {
    };
    
    var evalType = {
    };
    
    
    //===========
    // BUILT-INS
    //===========
    
    var specialForms = {
    };
    specialForms.prototype = null;
    
    //=============
    // ENVIRONMENT
    //=============
    
    var topEnv = {
    };
    
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
        parse: parse
    };
    
})();

var code = 'newVector: {(x y) > {x:x y:y} }\n addVectors : { (a b) > newVector(add(a.x b.x) add(a.y b.y)) }';
console.log(util.inspect(Hatch.parse(code), {showHidden: false, depth: null}));