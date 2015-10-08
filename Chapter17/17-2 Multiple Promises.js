require('./promise-7.0.4.min.js');

function all(promises) {
    
    return new Promise(function(success, fail) {
        var count = promises.length;
        if (count === 0) { success([]); }
        
        var results = [];

        // Generates a success function that remembers the promise's index.
        function succeedAtPromise(i) {
            return function (result) {
                results[i] = result;
                count --;
                if (count <= 0) {
                    success(results);
                }
            };
        }
        
        // A failure function that passes an individual promise's failure result
        // to the All Promise. (All Hail to the All Promise.)
        function failAtPromise(e) {
            fail(e);
        }
        
        // Let's let loose those promises, shall we?
        for (var i=0; i<promises.length; i++) {
            promises[i].then(succeedAtPromise(i), failAtPromise);
        }
        
    });
}

// Test code.
all([]).then(function(array) {
    console.log("This should be []:", array);
});

function soon(val) {
    return new Promise(function(success) {
        setTimeout(function() { success(val); },
                   Math.random() * 500);
    });
}

all([soon(1), soon(2), soon(3)]).then(function(array) {
    console.log("This should be [1, 2, 3]:", array);
});

function fail() {
    return new Promise(function(success, fail) {
        fail(new Error("boom"));
    });
}

all([soon(1), fail(), soon(3)]).then(function(array) {
    console.log("We should not get here");
}, function(error) {
    if (error.message != "boom")
    console.log("Unexpected failure:", error);
});