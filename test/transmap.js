const { expect } = require('chai');
const { spy } = require('sinon');
const { pass, transmap, transform } = require('../src/');
const isiterable = require('../lib/isiterable');

const double = spy( x => (x*2) );
const iseven = spy( x => (x%2) === 0 );
const sum = spy( (a,b) => (a+b) );
const uppercase = spy( x => String(x).toUpperCase() );

describe('transmap()', function() {

    beforeEach(function() {

        double.resetHistory();
        iseven.resetHistory();
        sum.resetHistory();
    })

    it('should be curried',
        function () {
            expect( transmap(double) ).to.be.a('function');
            expect( transmap(double, [1,2,3,4,5]) ).to.be.an('object');
        }
    )

    it('should accept either a function or an iterable producing only functions for the transformer argument',
        function () {
            
            expect( () => transmap(double, [1,2,3,4,5]) ).not.to.throw();
            expect( () => transmap( [pass(iseven), double], [1,2,3,4,5] ) ).not.to.throw();
        }
    )

    it('should throw if the transformer is neither an function nor an iterable that produces only functions',
        function () {
            
            expect( () => transmap({}, [1,2,3,4,5]) ).to.throw();
            expect( () => transmap(null, [1,2,3,4,5]) ).to.throw();
            expect( () => transmap(42, [1,2,3,4,5]) ).to.throw();
            expect( () => transmap('foobar', [1,2,3,4,5]) ).to.throw();
        }
    )

    it('should accept any iterable object for the list argument',
        function () {

            let returnvalue = transmap(double, [1,2,3,4,5]);
            expect( isiterable(returnvalue) ).to.be.true;

            returnvalue = transmap(uppercase, 'foobar');
            expect( isiterable(returnvalue) ).to.be.true;
        }
    )

    it('should return an iterable object',
        function () {

            const returnvalue = transmap(double, [1,2,3,4,5]);
            expect( isiterable(returnvalue) ).to.be.true;
        }
    )

    describe('the iterable object returned by transmap()', function() {

        it('should apply the transformer to each item in the argument list',
            function () {

                let returnvalue = transmap(double, [1,2,3,4,5]);
                let array = Array.from(returnvalue);
                expect(array).to.be.deep.equal( [2,4,6,8,10] );

                const transformer = transform( pass(iseven), double );
                returnvalue = transmap(transformer, [1,3,5,7,9]);
                array = Array.from(returnvalue);
                expect(array).to.be.deep.equal([]);
            }
        )

    })
})