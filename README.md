# Sarah's Eloquent Javascript Exercises

I'm working my way through the book [*Eloquent Javascript* by Marjin Haverbeke](http://eloquentjavascript.net/). Not for the faint of heart!

## Other Javascript Resources

- [Mastering the Module Pattern](http://toddmotto.com/mastering-the-module-pattern/), by Todd Motto
- [The Design of Code: Organizing Javascript](http://alistapart.com/article/the-design-of-code-organizing-javascript), by Anthony Colangelo (A List Apart)
- [Essential Javascript Links](https://github.com/ericelliott/essential-javascript-links#essential-javascript-links), Eric Elliott's favorite links

### Tools
- [Brackets](http://brackets.io/)
- [Brackets Git](https://github.com/zaggino/brackets-git)
- [Theseus for Brackets](https://github.com/adobe-research/theseus)
- [JSHint](http://jshint.com/)
- [JSDoc](http://usejsdoc.org/)

## Notes and snippets

### Prototypes

```javascript
var proto = {
    hello: function hello () {
        return 'Hello ' + this.name;
    }
};

var sarah = Object.create(proto);
sarah.name = 'Sarah';
```