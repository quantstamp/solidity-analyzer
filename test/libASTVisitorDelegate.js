const expect = require('chai').expect;
const solidityASTVistor = require('../lib/astvisitor');
const parser     = require("solidity-parser");

describe('Test base AST Visitor for Fiding delegatecall', function () {

  it('input3.sol', function () {
     var program = parser.parseFile(__dirname + '/inputs/input3.sol');
     //console.info(JSON.stringify(program, null, 2));
     var delegates = solidityASTVistor.findAllDelegateCallFunctions().find(program);
     expect(delegates).to.deep.equal([ { name: '_tobDelegated', functionName: 'g' },
                                       { name: '_tobDelegated', functionName: 'f' },
                                       { name: '_tobDelegated', functionName: '()' } ]);
  });
});
