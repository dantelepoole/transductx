const { expect } = require('chai');
const { transform } = require('../src/');

const TRANSFORM_REJECT = require('../lib/transformrejectsymbol');

const double = x => (x*2);
const increment = x => (x+1);
const iseven = x => (x%2) === 0;
const isgt10 = x => (x > 10);
const hastype = type => value => typeof value === type;

describe('tranform()', function() {

    it('should return a function',
        function () {
            expect( transform() ).to.be.a('function');
        }
    )

    it('should accept zero or more functions',
        function () {
            expect( transform() ).to.be.a('function');
            expect( transform(double) ).to.be.a('function');
            expect( transform(double, increment) ).to.be.a('function');
        }
    )

    it('should throw if any argument is not a function',
        function () {
            expect( () => transform(42) ).to.throw();
            expect( () => transform('foobar') ).to.throw();
            expect( () => transform(iseven, isgt10, 42) ).to.throw();
            expect( () => transform('foobar', iseven, isgt10) ).to.throw();
        }
    )

    describe.skip(`the transformer returned by transformer()`, function() {

        it('should return its argument if its argument is accepted by every filter',
            function() {

                let transformer = transform(iseven, isgt10, hastype('number'));
                expect( transformer(14) ).to.be.equal(14);

                transformer = transform(hastype('object'));
                const obj = {};
                const array = [];
                expect(transformer(null)).to.be.equal(null);
                expect(transformer(obj)).to.be.equal(obj);
                expect(transformer(array)).to.be.equal(array);
            }
        )

        it('should return a special Symbol if its argument is reject by any filter',
            function() {

                const transformer = transform(iseven, isgt10, hastype('number'));
                expect( transformer(9) ).to.be.equal(TRANSFORM_REJECT);
                expect( transformer(13) ).to.be.equal(TRANSFORM_REJECT);
                expect( transformer(null) ).to.be.equal(TRANSFORM_REJECT);
                expect( transformer() ).to.be.equal(TRANSFORM_REJECT);

            }
        )

        it('should return its argument if no filters were passed to predicate()',
            function() {

                const transformer = transform();
                const obj = {};
                const array = [];

                expect(transformer(9)).to.be.equal(9);
                expect(transformer(null)).to.be.null;
                expect(transformer(undefined)).to.be.undefined;
                expect(transformer(NaN)).to.be.NaN;
                expect(transformer(obj)).to.be.equal(obj);
                expect(transformer(array)).to.be.equal(array);
            }
        )
    })
})