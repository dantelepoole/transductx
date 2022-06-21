const { expect } = require('chai');
const { predicate } = require('../src/');

const TRANSFORM_REJECT = Symbol.for('transductx/transform/reject');

const iseven = x => (x%2) === 0;
const isgt10 = x => (x > 10);
const hastype = type => value => typeof value === type;

describe('predicate()', function() {

    beforeEach(function() {

    })

    it('should return a function',
        function () {
            expect( predicate() ).to.be.a('function');
        }
    )

    it('should accept zero or more functions',
        function () {
            expect( predicate() ).to.be.a('function');
            expect( predicate(iseven) ).to.be.a('function');
            expect( predicate(iseven, isgt10) ).to.be.a('function');
        }
    )

    it('should throw if any argument is not a function',
        function () {
            expect( () => predicate(42) ).to.throw();
            expect( () => predicate('foobar') ).to.throw();
            expect( () => predicate(iseven, isgt10, 42) ).to.throw();
            expect( () => predicate('foobar', iseven, isgt10) ).to.throw();
        }
    )

    describe(`the filter transformer returned by predicate()`, function() {

        it('should return its argument if its argument is accepted by every filter',
            function() {

                let transformer = predicate(iseven, isgt10, hastype('number'));
                expect( transformer(14) ).to.be.equal(14);

                transformer = predicate(hastype('object'));
                const obj = {};
                const array = [];
                expect(transformer(null)).to.be.equal(null);
                expect(transformer(obj)).to.be.equal(obj);
                expect(transformer(array)).to.be.equal(array);
            }
        )

        it('should return a special Symbol if its argument is rejected by any filter',
            function() {

                const transformer = predicate(iseven, isgt10, hastype('number'));
                expect( transformer(9) ).to.be.equal(TRANSFORM_REJECT);
                expect( transformer(13) ).to.be.equal(TRANSFORM_REJECT);
                expect( transformer(null) ).to.be.equal(TRANSFORM_REJECT);
                expect( transformer() ).to.be.equal(TRANSFORM_REJECT);

            }
        )

        it('should return its argument if no filters were passed to predicate()',
            function() {

                const transformer = predicate();
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