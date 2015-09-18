var text = "'I'm the cook,' he said, 'it's my job.'";

var findSingleQuotes = /'(.+?)'(\W|$)/g;

function reQuote (match, quote, rest) {
    return '"' + quote + '"' + rest;
}

console.log(text.replace(findSingleQuotes, reQuote));

// → "I'm the cook," he said, "it's my job."