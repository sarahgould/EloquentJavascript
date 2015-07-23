var Month = (function () {
    
    var monthsByNumber = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
        ];
    
    var monthsByName = {
        'jan': 0,
        'feb': 1,
        'mar': 2,
        'apr': 3,
        'may': 4,
        'jun': 5,
        'jul': 6,
        'aug': 7,
        'sep': 8,
        'oct': 9,
        'nov': 10,
        'dec': 11
    };
    
    var name = function (number) {
        try {
            return monthsByNumber[number];
        } catch (e) {
            return undefined;
        }
    };
    
    var number = function (name) {
        try {
            name = name.slice(0,3).toLowerCase();
            return monthsByName[name];
        } catch (e) {
            return undefined;
        }
    };
    
    return {
        name: name,
        number: number
    };
    
})();

console.log(Month.name(2));
// → March
console.log(Month.number("November"));
// → 10