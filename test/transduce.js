const { expect } = require('chai');
const { spy } = require('sinon');
const { predicate, transduce, transform } = require('../src/');
const isiterable = require('../lib/isiterable');

const double = spy( x => (x*2) );
const iseven = spy( x => (x%2) === 0 );
const sum = spy( (a,b) => (a+b) );

describe('transduce()', function() {

    beforeEach(function() {

        double.resetHistory();
        iseven.resetHistory();
        sum.resetHistory();
    })

    it('should be curried',
        function () {
            expect( transduce(double) ).to.be.a('function');
            expect( transduce(double, sum) ).to.be.a('function');
        }
    )

    it('should accept either a function or an iterable producing only functions for the transformer argument',
        function () {
            
            expect( () => transduce(double, sum) ).not.to.throw();
            expect( () => transduce( [predicate(iseven), double], sum ) ).not.to.throw();
        }
    )

    it('should throw if the transformer is neither an function nor an iterable that produces only functions',
        function () {
            
            expect( () => transduce({}, [1,2,3,4,5]) ).to.throw();
            expect( () => transduce(null, [1,2,3,4,5]) ).to.throw();
            expect( () => transduce(42, [1,2,3,4,5]) ).to.throw();
            expect( () => transduce('foobar', [1,2,3,4,5]) ).to.throw();
        }
    )

    it('should throw if the reducer is not a function',
        function () {
            expect( ()=>transduce(double, null) ).to.throw();
            expect( ()=>transduce(double, undefined) ).to.throw();
            expect( ()=>transduce(double, 42) ).to.throw();
            expect( ()=>transduce(double, 'foobar') ).to.throw();
        }
    )

    describe('the transduce() return value', function() {

        it('should be a function',
            function () {
                expect( transduce(double, sum) ).to.be.a('function');
            }
        )

        it('should be a reducer that applies the transformation to the reduction',
            function () {

                const transducer = transduce( [predicate(iseven), double], sum );
                const result = [1,2,3,4,5].reduce(transducer, 0);

                expect( result ).to.be.equal(12);

                expect( iseven.callCount ).to.be.equal(5);
                expect( double.callCount ).to.be.equal(2);
                expect( sum.callCount ).to.be.equal(2);
            }
        )
    })
})