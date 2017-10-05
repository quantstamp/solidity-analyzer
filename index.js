const util = require('util');
const parser     = require("solidity-parser");
const ASTVisitor = require('./lib/astvisitor');

// Find all public functions modifying an private state variables
var findUnsafeCalls = function(contract){
	var unsafes = [];
	var variables = ASTVisitor.stateVariablesFinder().find(contract);
	var functions = ASTVisitor.functionsFinder().find(contract);
	for (var i in functions){
		var funct = functions[i];
		var modifiedVars = ASTVisitor.findAllModifiedStateVariablesInGivenFunction().find(contract, funct.name);
		for (var j in modifiedVars){
			var modifiedVar = modifiedVars[j];
			for (var k in variables){
				var variable = variables[k];
				if (modifiedVar.name == variable.name &&
						variable.visibility != "public"){
						if (funct.visibility == "public"){
							unsafes.push({call: funct.name, modified: modifiedVar.name});
						} else {
							// indirectly called by a public function
							var visiteds = [funct.name];
							var visitings = functionsCallingGivenFunction(funct.name, contract);
							while (visitings.length > 0){
								var visiting = visitings.pop();
								var isVisited = false;
								for (var m in visiteds){
									visited = visiteds[m];
									if (visited == visiting && !isVisited){
										isVisited = true;
									}
								}

								if (!isVisited){
									if (visiting.visibility == "public"){
										unsafes.push({call: visiting.name, modified: modifiedVar.name});
									}
									visiteds.push(visiting.name);
									var tobeProcesseds = functionsCallingGivenFunction(visiting.name, contract);
									for (var n in tobeProcesseds){
										visitings.push(tobeProcessed[n]);
									}
								}
							}
						}
				}
			}
		}
	}
	return unsafes;
}

// Return all functions that directly or indirectly call given function
var functionsCallingGivenFunction = function (functionName, contract){
	var froms = [];
	var functions = ASTVisitor.functionsFinder().find(contract);
	for (var i in functions){
		var funct = functions[i];
		var calledFunctions = ASTVisitor.functionCallsFromFunction().find(contract, funct.name);
		for (var j in calledFunctions){
			var calledFunction = calledFunctions[j];
			if (calledFunction.name == functionName){
				froms.push(funct);
			}
		}
	}
	return froms;
}

var findUnsafeDelegatecalls = function (contract){
	return ASTVisitor.findAllDelegateCallFunctions().find(contract);
}

module.exports = {
  revealUnsafeCalls: function(contract){
    console.info(findUnsafeCalls(parser.parse(contract)));
    return  findUnsafeCalls(parser.parse(contract));
  },
  revealUnsafeCallsFromFile: function(contract){
    return  findUnsafeCalls(parser.parseFile(contract));
  },
	revealUnsafeDelegatecallsFromFile: function(contract){
    return  findUnsafeDelegatecalls(parser.parseFile(contract));
  }
};
