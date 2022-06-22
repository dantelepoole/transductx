const { expect } = require('chai');
const { spy } = require('sinon');
const { drop } = require('../src/');

const TRANSFORM_REJECT = require('../lib/transformrejectsymbol');

const iseven = spy( x => (x%2) === 0 );
const isgt10 = spy( x => (x>10) );

describe('drop()', function() {

    beforeEach(function() {
        iseven.resetHistory();
        isgt10.resetHistory();
    })

    it('should return a function',
        function () {
            expect( drop(iseven) ).to.be.a('function');
        }
    )

    it('should accept zero or more functions',
        function () {
            expect( drop() ).to.be.a('function');
            expect( drop(iseven) ).to.be.a('function');
            expect( drop(iseven, isgt10) ).to.be.a('function');
        }
    )

    it('should throw if any argument is not a function',
        function () {
            expect( () => drop(42) ).to.throw();
            expect( () => drop('foobar') ).to.throw();
            expect( () => drop(iseven, isgt10, 42) ).to.throw();
            expect( () => drop('foobar', iseven, isgt10) ).to.throw();
        }
    )

    describe(`the filter transformer returned by drop()`, function() {

        it('should return a special Symbol if its argument is accepted by every filter',
            function() {

                const transformer = drop(iseven, isgt10);
                expect( transformer(42) ).to.be.equal(TRANSFORM_REJECT);
            }
        )

        it('should return its argument if its argument is rejected by any filter',

            function() {

                const transformer = drop(iseven, isgt10);
                expect( transformer(10) ).to.be.equal(10);
                expect( transformer(41) ).to.be.equal(41);
                expect( transformer('foobar') ).to.be.equal('foobar');
                expect( transformer([1,2,3,4,5]) ).to.be.deep.equal([1,2,3,4,5]);
                expect( transformer({}) ).to.be.deep.equal({});
            }
        )

        it('should return its argument if no filters were passed to drop()',
            function() {

                const transformer = drop();
                expect(transformer(9)).to.be.equal(9);
                expect(transformer(null)).to.be.null;
                expect(transformer(undefined)).to.be.undefined;
                expect(transformer(NaN)).to.be.NaN;
            }
        )
    })
})