const { expect } = require('chai');
const { spy } = require('sinon');
const { predicate, transform } = require('../src/');

const TRANSFORM_REJECT = require('../lib/transformrejectsymbol');

const markerobject = Object.freeze( {} );
const markerarray = Object.freeze( [] );

const double = spy( x => (x*2) );
const increment = spy( x => (x+1) );
const iseven = spy( x => (x%2) === 0 );
const isgt10 = spy( x => (x > 10) );
const hastype = spy( type => value => (typeof value === type) );

describe('transform()', function() {

    beforeEach(function() {

        double.resetHistory();
        increment.resetHistory();
        iseven.resetHistory();
        isgt10.resetHistory();
        hastype.resetHistory();
    })


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

    describe(`the transformer returned by transformer()`, function() {

        it('should return its argument if its argument is accepted by every filter',
            function() {

                const hastypenumber = spy( hastype('number') );
                let transformer = transform( predicate(iseven, isgt10, hastypenumber) );
                expect( transformer(14) ).to.be.equal(14);
                expect( iseven.callCount ).to.be.equal(1);
                expect( isgt10.callCount ).to.be.equal(1);
                expect( hastypenumber.callCount ).to.be.equal(1);

                const hastypeobject = spy( hastype('object') );
                transformer = transform( predicate(hastypeobject) );
                expect(transformer(null)).to.be.equal(null);
                expect(transformer(markerobject)).to.be.equal(markerobject);
                expect(transformer(markerarray)).to.be.equal(markerarray);
                expect( hastypeobject.callCount ).to.be.equal(3);
            }
        )

        it('should return a special Symbol if its argument is rejected by any filter',
            function() {

                const hastypenumber = spy( hastype('number') );
                const transformer = transform( predicate(iseven, isgt10, hastypenumber) );
                expect( transformer(9) ).to.be.equal(TRANSFORM_REJECT);
                expect( transformer(13) ).to.be.equal(TRANSFORM_REJECT);
                expect( transformer(null) ).to.be.equal(TRANSFORM_REJECT);
                expect( transformer() ).to.be.equal(TRANSFORM_REJECT);

                expect( iseven.callCount ).to.be.equal(4);
                expect( isgt10.callCount ).to.be.equal(1); // the value null matches the iseven predicate
                expect( hastypenumber.callCount ).to.be.equal(0);
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