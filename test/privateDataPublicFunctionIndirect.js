const expect = require('chai').expect;
const SolidityAnalyzer = require('../index');

describe('Test base ethereum contracts', function () {

  it('input2.sol', function () {
     var unsafes = SolidityAnalyzer.revealUnsafeCallsFromFile(__dirname + '/inputs/input2.sol');
     expect(unsafes).to.deep.equal([ { call: 'resetOwner', modified: 'owner' } ]);
  });
});
