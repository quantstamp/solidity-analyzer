const expect = require('chai').expect;
const solidityASTVistor = require('../lib/astvisitor');
const parser     = require("solidity-parser");

describe('Test base AST Visitor for finding type of a variable', function () {

    it('expected that the type of a variable is resolved to the closest definition', function () {
        var program = parser.parseFile(__dirname + '/inputs/input4.sol');
        //console.info(JSON.stringify(program, null, 2));
        var type = solidityASTVistor.findType().find(program, {
            type: "Identifier",
            name: "var2",
            start: 288,
            end: 292
        });
        expect(type).to.deep.equal({ name: 'var2', type: 'TypeB' });

    });

    it('expected that type of a variable is resolved to a state variable', function () {
        var program = parser.parseFile(__dirname + '/inputs/input4.sol');
        var type = solidityASTVistor.findType().find(program, {
            type: "Identifier",
            name: "var1",
            start: 109,
            end: 113
        });
        expect(type).to.deep.equal({ name: 'var1', type: 'address' });
    });

    it('expected that type of a variable is resolved to a informal variable definition', function () {
        var program = parser.parseFile(__dirname + '/inputs/input4.sol');
        var type = solidityASTVistor.findType().find(program, {
            type: "Identifier",
            name: "var1",
            start: 190,
            end: 194
        });
        expect(type).to.deep.equal({ name: 'var1', type: 'uint32' });
    });

    it('expected that type of a variable is resolved to the state variable it is referenced by this', function () {
        var program = parser.parseFile(__dirname + '/inputs/input4.sol');
        var type = solidityASTVistor.findType().find(program, {
            type: "Identifier",
            name: "var2",
            start: 318,
            end: 322
        });
        expect(type).to.deep.equal({ name: 'var2', type: 'TypeA' });
    });

    it('expected that type of a variable is resolved to the state variable it is referenced by this', function () {
        var program = parser.parseFile(__dirname + '/inputs/input4.sol');
        var type = solidityASTVistor.findType().find(program, {
            type: "Identifier",
            name: "var2",
            start: 379,
            end: 383
        });
        expect(type).to.deep.equal({ name: 'var2', type: 'TypeA' });
    });

    it('expected that type of a variable is not resolved because the type system is not fully implemented', function () {
        var program = parser.parseFile(__dirname + '/inputs/input4.sol');
        var type = solidityASTVistor.findType().find(program, {
            type: "Identifier",
            name: "var2",
            start: 432,
            end: 436
        });
        expect(type).to.be.null;
    });

    it('expected that type of a function return type is not resolved because the type system is not fully implemented', function () {
        var program = parser.parseFile(__dirname + '/inputs/input4.sol');
        var type = solidityASTVistor.findType().find(program, {
            type: "Identifier",
            name: "var2",
            start: 461,
            end: 465
        });
        expect(type).to.be.null;
    });

    it('expected that type of a function return type is not resolved because the type system is not fully implemented', function () {
        var program = parser.parseFile(__dirname + '/inputs/input4.sol');
        var type = solidityASTVistor.findType().find(program, {
            type: "Identifier",
            name: "var2",
            start: 475,
            end: 479
        });
        expect(type).to.deep.equal({ name: 'var2', type: 'TypeA' });
    });
});
