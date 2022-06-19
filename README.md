# transducex
A transducer library for Javascript

## Description

In functional programming in Javascript, you often want to apply multiple map and/or filter functions to an array of
values before reducing the array to a single result. If you do so using `map()`, `filter()` and `reduce()` methods of
the native Javascript `Array` class, it will iterate over the entire array for each method. For example:

```javascript

const double = x => (x*2)
const isgreaterthan9 = x => (x > 9);
const sum = (a,b) => (a+b);
const numbers1to10 = [1,2,3,4,5,6,7,8,9,10];

const result = numbers1to10
                 .filter(isgreaterthan9)
                 .map(double)
                 .reduce(sum, 0);

```

In the above example, the result will be `20`. However, to obtain this result the `numbers1to10` array had to be
iterated over three times. Transduction is the technique for combining multiple map or filter operations with a reduce
operation in such a manner that the input array only needs to be iterated over a single time. It won't make much of a
difference for simple example above, but it can enhance performance significantly when processing large arrays.

For more details on how transductions works, see the following [article](https://codeburst.io/transduction-functional-programming-in-javascript-3b494758a868#:~:text=Transduction%20is%20a%20performance%20optimisation,function%20and%20an%20initial%20value.).

Using `transducex` the example above would rewritten as:

```javascript

const transducex = require('transducex');
const predicate = require('transducex/predicate'); // necessary to perform filter transformations

// ... skip definitions of double(), isgreaterthan9(), sum() and the numbers1to10 array

const transducer = transducex( predicate(isgreaterthan9), double );
const result = numbers1to10.reduce( transducer(sum), 0 );

```

The result is the same (`20`) but in this case the `numbers1to10` array is iterated over only once.

## Installation

To install the `transducex` package just type:

```

$ npm install transducex

```

## Usage

The `transducex` package contains two functions: `transducex()` and `predicate()`.

### transducex(...*transformations*)

The `transducex()` function takes one or more transformation functions. A transformation function is any function that
accepts a value and returns another value (essentially the type of function you would pass to Javascript's 
`Array.prototype.map()` method).

The `transducex()` function returns a transducer, i.e. a function that accepts a reducer (the type of function that you
would pass to Javascript's `Array.prototype.reduce()` method) and returns a reducer that applies the transformations in 
order to its `currentValue` argument before forwarding it to the argument reducer.

```javascript

const transducex = require('transducex');

const double = x => (x*2);
const increment = x => (x+1);
const sum = (a,b) => (a+b);

const transducer = transducex(double, increment);

[1,2,3].reduce(transducer(sum), 0); // returns 15

```

The transducer returned by `transducex()` has a convenience method `reduce()` that accepts a reducer function, an 
initial value and an iterable object, and returns the result of transducing the items produced by the iterable object.

```javascript

transducex(double, increment).reduce(sum, 0, [1,2,3]); // returns 15

```

Note that the `reduce()` method works with any iterable object, not just arrays.

The `reduce()` method is also exported as a standalone function. To use it as such, the reducer must be passed through
the transducer first, just like when passing it to Javascript's native `Array.prototype.reduce()` method:

```javascript

const transducex = require('transducex');
const reduce = require('transducex/reduce');

// ... skip definitions of double(), increment() and sum()

const transducer = transducex(double, increment)
reduce(transducer(sum), 0, [1,2,3]); // returns 15

```

### predicate(*func*)

The `predicate()` function is necessary to enable filter transformations, since `transducex` needs to be able to
distinguish functions that transform their argument from functions intended to filter their argument.

Any function that transforms its argument can be passed directly to `transducex()`. To pass a filter function you must
first invoke `predicate()` before passing the result to `transducex()`.

``` javascript

const transducex = require('transducex');
const predicate = require('transducex/predicate');

const isgreaterthan9 = predicate(x => (x > 9));
const double = x => (x*2);
const sum = (a,b) => (a+b);

transducex(isgreaterthan9, double).reduce(sum, 0, [8,9,10,11]); // returns 42

```

Be careful to always pass a filter transformation through `predicate()` before using it to create a transducer. Passing
a filter transformation directly to `transducex()` without first sending it to `predicate()` will at best cause the
reducer to throw an error. At worst, it will cause the reducer to produce unexpected and incorrect results.

The same applies to regular transformations. These should never be passed to `predicate()` and instead be passed to 
`transducex()` directly. Among other things, `predicate()` coerces the transformation's return value to a boolean
value and will cause the reducer the drop any values for which the transformation returns `false`. This is not the
desired behaviour for a regular transformation.

## Typescript declarations?

Nope.