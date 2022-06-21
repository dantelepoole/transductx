# transductx
A transducer library for Javascript

## Description

This package offers a simple and straightforward way to perform transductions in Node.

## Installation

To install the `transductx` package:

```
$ npm install transductx
```

## Usage

The `transductx` package exports four functions: `transduce()`, `transform()`, `predicate()` and a convenience
`reduce()` function.

### transduce(*transformer*, *reducer*)

The `transduce()` function takes a *transformer* and a *reducer* and returns a transducer function, i.e. a reducer that
transforms its *next value* argument (the `currentValue` argument in the MDN documentation parlance).

A *transformer* is any function that accepts a single argument, transforms it in some way and returns the result.
Alternatively, a *transformer* may act as a filter so as to omit certain values instead of transforming them. In that
case, the *transformer* function *must* be passed to `predicate()` first before using it with `transduce()`. See below
for more details.

The returned transducer has the same signature has a regular reducer. It can be used with `transductx`' `reduce()`
function (see below for more details) but can also be passed to any function that can work with reducers, e.g.
`Array.prototype.reduce()`.

```javascript

const { predicate, transduce } = require('transductx');

const double = x => (x*2);
const increment = x => (x+1);
const iseven = x => (x%2) === 0;
const sum = (a,b) => (a+b);

let transducer = transduce( double, sum );
[1,2,3,4,5].reduce( transducer, 0 ); // returns 30

transducer = transduce( predicate(iseven), sum );
[1,2,3,4,5].reduce( transducer, 0 ); // returns 6

```

If the *transformer* argument is an iterable object (e.g. an array) instead of a function, `transduce()` assumes it
is a collection of *transformers* and the returned transducer will apply each *transformer* in order. Alternatively,
you can use `transform()` to compose multiple *transformers* to a single transformer function (see below).

```javascript

const { transduce } = require('transductx');

const double = x => (x*2);
const increment = x => (x+1);
const sum = (a,b) => (a+b);

const transducer = transduce( [double, increment], sum );
[1,2,3,4,5].reduce( transducer, 0 ); // returns 35

```

`transduce()` is a a curried function, so you can pass the arguments separately:

```javascript

const { transduce } = require('transductx');

const double = x => (x*2);
const sum = (a,b) => (a+b);

const transducer = transduce(double);
[1,2,3,4,5].reduce( transducer(sum), 0 ); // returns 30

```

### transform(...*transformers*) 

Compose one or more *transformer* functions to a single function. Each *transformer* may be a regular transformer or a
filter transformer, i.e. a transformer that was first passed to `predicate()` (see below).

```javascript

const { transduce } = require('transductx');

const double = x => (x*2);
const increment = x => (x+1);
const sum = (a,b) => (a+b);

const transformer = transform( double, increment );
const transducer = transduce( transformer, sum );
[1,2,3,4,5].reduce( transducer, 0 ); // returns 35

```

### predicate(...*filters*)

Return a transformer that is recognized by `transduce()` as a filter transformer instead of a regular transformer, i.e.
a function that does not transform values but that tells `transduce()` to either include or omit a value.

Each *filter* should be a function that accepts a single argument and returns a boolean to indicate whether or not its
argument value should be included or omitted from the transduction.

> Failing to passing a filter *transformer* to `predicate()` prior to transducing will cause `transduce()` to produce
> incorrect results. `predicate()` allows `transduce()` to recognize a *transformer* as a filter transformation rather
> than a regular transformation.
> 
> Likewise, passing a regular *transformer* to `predicate()` will also cause `transduce()` to produce incorrect results.
> So make sure to only pass filter functions to `predicate()`, not regular functions. `predicate()` can't tell the
> difference, so it will accept either.

See the sample code for `transduce()` above for an example of `predicate()` in action.

If more than one *filter* is provided, the returned transformer will filter out any value that is not accepted by all
*filters*, i.e. it combines the *filters* with a logical AND operation.

```javascript

const { predicate, transduce } = require('transductx');

const iseven = x => (x%2) === 0;
const isgreaterthan10 = x => (x > 10);
const islessthan20 = x => (x < 20);
const sum = (a,b) => (a+b);

// this transformer will accept only even numbers greater than 10 and less than 20
const transformer = predicate(iseven, isgreaterthan10, islessthan20);
const transducer = transduce(transformer, sum);

[8,9,10,11,12,13,14,15].reduce(transducer, 0); // returns 26

```

### reduce(*reducer*, *initialvalue*, *list*)

The transducer returned by `transduce()` has the same signature as any other reducer function, so it can be used by
any function that can reduce a collection, e.g. `Array.prototype.reduce()`. The `transductx` package exports a 
convenience `reduce()` function that accepts a *reducer* (any reducer function, not just transducers returned by
`transduce()`), an *initialvalue* and a *list* of values to reduce.

One notable feature of `reduce()` is that the *list* argument may be any object that has a `reduce()` method or an
iterable object. If *list* has a `reduce()` method (e.g. a Javascript Array), the `reduce()` function passes *reducer*
and *initialvalue* to that method and returns the result. If *list* does not have a `reduce()` method but it is
iterable, `reduce()` will reduce the values produced by the iterable. If *list* has no `reduce()` method and is not
iterable, an error is thrown.

```javascript

const { predicate, reduce, transduce } = require('transductx');

const iseven = x => (x%2) === 0;
const isgreaterthan10 = x => (x > 10);
const islessthan20 = x => (x < 20);
const sum = (a,b) => (a+b);

// this transformer will accept only even numbers greater than 10 and less than 20
const transformer = predicate(iseven, isgreaterthan10, islessthan20);
const transducer = transduce(transformer, sum);

reduce(transducer, 0, [8,9,10,11,12,13,14,15]); // returns 26

```

Also, `reduce()` is curried, so you can pass the arguments in separate calls.

## Typescript declarations?

Nope.