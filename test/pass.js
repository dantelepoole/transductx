const { expect } = require('chai');
const { pass, predicate } = require('../src/');

describe('pass()', function() {

    it('should be an alias for predicate()',
        function () {
            expect( pass ).to.be.equal( predicate );
        }
    )

})