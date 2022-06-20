# transductx
A transducer library for Javascript

## Description

This package offers a rather simple and straightforward way to create and use transducers in Node, as well as a
transform module for lazily transforming any iterable object. Setting aside my confused terminology in function naming,
it works fairly well.

## Installation

To install the `transductx` package:

```
$ npm install transductx
```

## Usage

The `transductx` package exports four functions: `transduce()`, `filter()`, `transform()` and a convenience `reduce()`
function.

### transduce(...*transformations*)

The `transduce()` function takes one or more transformation functions, i.e. any function that accepts a single argument
and transforms it to some other value.

The `transduce()` function returns a transducer, i.e. a function that accepts a reducer function (which accepts an
accumulator value and a next value as arguments and returns a new accumulator value) and returns a new reducer function
that transforms the nextvalue argument before passing it on to the original reducer. The returned reducer function can
be passed to Javascript's native `Array.prototype.reduce()` method, just like any other reducer.

```javascript

const { transduce } = require('transductx');

const double = x => (x*2);
const increment = x => (x+1);
const sum = (a,b) => (a+b);

const transducer = transduce(double, increment);

[1,2,3].reduce(transducer(sum), 0); // returns 15

```

### reduce(*reducer*, *initialvalue*, *iterable*)

The transducer returned by `transduce()` has a convenience method `reduce()` that accepts a reducer function, an 
initial value and an iterable object, and returns the result of transducing the items produced by the iterable.

```javascript

transduce(double, increment).reduce(sum, 0, [1,2,3]); // returns 15

```

Note that the `reduce()` method works with any iterable object, not just arrays.

The `reduce()` method is also exported as a standalone function. When using it standalone, the reducer must first be
passed through the transducer, as is also the case when reducing with Javascript's native `Array.prototype.reduce()`
method.

```javascript

const { transduce, reduce } = require('transductx');

// ... skip definitions of double(), increment() and sum()

const transducer = transduce(double, increment);

reduce(transducer(sum), 0, [1,2,3]); // returns 15

```

The `reduce()` function can be used with any reducer function, not just those returned by `transduce()`. Unlike
Javascript's native `Array.prototype.reduce()` method, however, `reduce()` only passes the accumulator and nextvalue
arguments to the reducer (also called the `previousValue` and `currentValue` arguments in MDN documentation parlance), 
not the additional `currentIndex` and `array` arguments that `Array.prototype.reduce()` passes.

### filter(*func*)

Any transformation function that serves to filter out certain values rather than transforming them *must* be passed
to the `filter()` function before using it to transduce, otherwise the transduction will not work as intended. The 
`filter()` function allows `transduce()` to recognize the function as a filter transformation rather than a regular
transformation.

``` javascript

const { filter, transduce } = require('transductx');

const isgreaterthan9 = x => (x > 9);
const double = x => (x*2);
const sum = (a,b) => (a+b);

transduce( filter(isgreaterthan9), double ).reduce(sum, 0, [8,9,10,11]); // returns 42

```

### transform(...*transformations*)

The `transform()` function works the same way as `transduce()` except that instead of returning a transducer that
accepts a reducer and returns a new reducer that transforms the values passed to it, it returns a transformer that
accepts any iterable object and returns a new iterable object that transforms the values produced by the original
iterable.

The returned iterable operates lazily, i.e. it only pulls individual items from the original iterable when the
corresponding items are pulled from the returned iterable.

``` javascript

const { filter, transform } = require('transductx');

const isgreaterthan9 = x => (x > 9);
const double = x => (x*2);
const sum = (a,b) => (a+b);

const transformer = transform( filter(isgreaterthan9), double );

for( const item of transformer([8,9,10,11]) ) console.log(item); // prints '20' and then '22'

```

## Typescript declarations?

Nope.