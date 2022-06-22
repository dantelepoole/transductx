const { expect } = require('chai');
const { spy } = require('sinon');
const { reduce } = require('../src/');

const sum = spy( (a,b) => (a+b) );

describe('reduce()', function() {

    beforeEach(function() {
        sum.resetHistory();
    })

    it('should be curried',
        function () {
            expect( reduce(sum) ).to.be.a('function');
            expect( reduce(sum, 0) ).to.be.a('function');
            expect( reduce(sum, 0, []) ).to.be.equal(0);
        }
    )

    it('should throw if the reducer is not a function',
        function () {
            expect( () => reduce( null, 0, [] ) ).to.throw();
        }
    )

    it(`should pass the reducer and the initial value to the list's reduce() method, if it has one.`,
        function () {

            const list = [1,2,3,4,5];
            spy(list, 'reduce');

            const result = reduce(sum, 0, list);

            expect(result).to.be.equal(15);
            expect(list.reduce.called).to.be.true;
            expect(sum.called).to.be.true;

            list.reduce.restore();
        }
    )

    it(`should reduce the list if it has no reduce() method but it is iterable.`,
        function () {

            const list = {
                [Symbol.iterator] : function* () {
                    for(let i = 1; i <= 5; i += 1) yield i;
                }
            }

            spy( list, Symbol.iterator );

            const result = reduce(sum, 0, list);

            expect(result).to.be.equal(15);
            expect(list[Symbol.iterator].called).to.be.true;
            expect(sum.called).to.be.true;

            list[Symbol.iterator].restore();
        }
    )

    it('should throw if the list has no `reduce()` and is not iterable.',
        function () {
        }
    )

})