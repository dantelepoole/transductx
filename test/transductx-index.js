const { expect } = require('chai');
const transductx = require('../src');

describe('the transductx package', function() {

    it('should export the predicate() function',
        function () {
            expect( transductx.predicate ).to.be.equal( require('../src/predicate') );
        }
    )

    it('should export the reduce() function',
        function () {
            expect( transductx.reduce ).to.be.equal( require('../src/reduce') );
        }
    )

    it('should export the transduce() function',
        function () {
            expect( transductx.transduce ).to.be.equal( require('../src/transduce') );
        }
    )

    it('should export the transform() function',
        function () {
            expect( transductx.transform ).to.be.equal( require('../src/transform') );
        }
    )

    it('should not export anything else',
        function () {
            const keys = Object.keys(transductx);
            expect(keys.length).to.be.equal(4);
        }
    )
})