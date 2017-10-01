const util = require('util');
const parser     = require("solidity-parser");

var ASTVisitor = function(){

  this.visit = function(node) {

    if (node.type == "Program"){
			this.preOrderVisitProgram(node);
			for (k in node.body)	{
				this.visit(node.body[k]);
			}
			this.postOrderVisitProgram(node);
		}
		else if (node.type == "PragmaStatement"){
			this.preOrderVisitPragmaStatement(node);
			this.postOrderVisitPragmaStatement(node);
		}
		else if (node.type == "StateVariableDeclaration"){
			this.preOrderVisitStateVariableDeclaration(node);
			this.visit (node.literal);
			this.postOrderVisitStateVariableDeclaration(node);
		}
		else if (node.type == "ContractStatement"){
			this.preOrderVisitContractStatement(node);
			for (k in node.body)
				this.visit(node.body[k]);
			this.postOrderVisitContractStatement(node);
		}
		else if (node.type == "FunctionDeclaration"){
			this.preOrderVisitFunctionDeclaration(node);
			for (k in node.params)
				this.visit(node.params[k]);
			for (k in node.modifiers)
				this.visit(node.modifiers[k]);
			this.visit(node.body);
			this.postOrderVisitFunctionDeclaration(node);
		}
		else if (node.type == "BlockStatement"){
			this.preOrderVisitBlockStatement(node);
			for (var k in node.body){
				this.visit(node.body[k]);
			}
			this.postOrderVisitBlockStatement(node);
		}
		else if (node.type == "ExpressionStatement"){
			this.preOrderVisitExpressionStatement(node);
			for (k in node){
			  this.visit(node[k]);
			}
			this.postOrderVisitExpressionStatement(node);
		}
		else if (node.type == "ReturnStatement") {
			this.preOrderVisitReturnStatement(node);
			this.visit (node.argument);
			this.postOrderVisitReturnStatement(node);
		}
		else if (node.type == "AssignmentExpression") {
			this.preOrderVisitAssignmentExpression(node);
			this.visit (node.left);
			this.visit (node.right);
			this.postOrderVisitAssignmentExpression(node);
		}
		else if (node.type == "BinaryExpression") {
			this.preOrderVisitBinaryExpression(node);
			this.visit (node.left);
			this.visit (node.right);
			this.postOrderVisitBinaryExpression(node);
		}
		else if (node.type == "CallExpression") {
			this.preOrderVisitCallExpression(node);
			this.visit (node.callee);
			for (argument in node.arguments){
				this.visit(node.arguments[argument]);
			}
			this.postOrderVisitCallExpression(node);
		}
		else if (node.type == "Identifier"){
			this.preOrderVisitIdentifier(node);
			this.postOrderVisitIdentifier(node);
		}
		else if(node.type == "Literal"){
			this.preOrderVisitLiteral(node);
			this.postOrderVisitLiteral(node);
  	}
  	else {
  		//console.info("UNIMPLEMENTED->"+ node.type);
  	}
	}

	this.preOrderVisitProgram = function(node){}
	this.postOrderVisitProgram = function(node){}

	this.preOrderVisitPragmaStatement = function(node){}
	this.postOrderVisitPragmaStatement = function(node){}

	this.preOrderVisitStateVariableDeclaration = function(node){}
	this.postOrderVisitStateVariableDeclaration = function(node){}

	this.preOrderVisitContractStatement = function(node){}
	this.postOrderVisitContractStatement = function(node){}

	this.preOrderVisitFunctionDeclaration = function(node){}
	this.postOrderVisitFunctionDeclaration = function(node){}

	this.preOrderVisitBlockStatement = function(node){}
	this.postOrderVisitBlockStatement = function(node){}

	this.preOrderVisitExpressionStatement = function(node){}
	this.postOrderVisitExpressionStatement = function(node){}

	this.preOrderVisitReturnStatement = function(node){}
	this.postOrderVisitReturnStatement = function(node){}

	this.preOrderVisitBinaryExpression = function(node){}
	this.postOrderVisitBinaryExpression = function(node){}

	this.preOrderVisitAssignmentExpression = function(node){}
	this.postOrderVisitAssignmentExpression = function(node){}

	this.preOrderVisitCallExpression = function(node){}
	this.postOrderVisitCallExpression = function(node){}

	this.preOrderVisitIdentifier = function(node){}
	this.postOrderVisitIdentifier = function(node){}

	this.preOrderVisitLiteral = function(node){}
	this.postOrderVisitLiteral = function(node){}
}

var StateVariablesFinder = function(){
	var variables = [];
	ASTVisitor.apply(this, arguments);

	this.preOrderVisitStateVariableDeclaration = function(node) {
		if (node.visibility == null){
	  	variables.push({name:node.name, visibility: "NOT_PUBLIC"});
	  } else {
	    variables.push({name:node.name, visibility: node.visibility});
	  }
	}

	this.find = function(program){
		variables = [];
		this.visit(program);
		return variables;
	}
}

util.inherits(StateVariablesFinder, ASTVisitor);
module.exports = StateVariablesFinder;
var stateVariablesFinder = new StateVariablesFinder();

var FunctionsFinder = function(){
	var functions = [];
	ASTVisitor.apply(this, arguments);

	this.preOrderVisitFunctionDeclaration = function(node) {
		if(node.is_abstract == false ) {
    	var name = node.name || "";
  		var visibility = "public";

  		if(node.modifiers) {
    		node.modifiers.forEach(function(mod) {
      		switch(mod.name) {
        		case "public":
        			break;
        		case "private":
          		visibility = "private";
          		break;
        		case "internal":
          		visibility = "internal";
          		break;
        		case "external":
          		visibility = "external";
          		break;
     			 	}
					})
        }
	}
				functions.push({name: node.name || "", visibility:  visibility, body: node.body});
	}

	this.find = function(program){
		functions = [];
		this.visit(program);
		return functions;
	}
}

util.inherits(FunctionsFinder, ASTVisitor);
module.exports = FunctionsFinder;
var functionsFinder = new FunctionsFinder();


// Finding all functions are called from a given function
var FunctionCallsFromFunction = function(){
	// given function Name;
  var functionName = "";
	var body = null;
	var called = [];
	ASTVisitor.apply(this, arguments);

	this.preOrderVisitFunctionDeclaration = function(node) {
		if (node.name == functionName){
			body = node.body;
		}
	}

	this.postOrderVisitFunctionDeclaration = function(node) {
		if (node.name == functionName){
			body = null;
		}
	}

	this.preOrderVisitCallExpression = function(node) {
		if (body != null){
	  	 called.push({name: node.callee.name});
	  }
	}

	this.find = function(program, fname){
		body = null;
		called = [];
		functionName = fname;
		this.visit(program);
		return called;
	}
}

util.inherits(FunctionCallsFromFunction, ASTVisitor);
module.exports = FunctionCallsFromFunction;
var functionCallsFromFunction = new FunctionCallsFromFunction();


// Finding all functions are called from a given function
var FindAllModifiedStateVariablesInGivenFunction = function(){
	// given function Name;
  var functionName = "";
	var body = null;
	var modified = [];
	ASTVisitor.apply(this, arguments);

	this.preOrderVisitFunctionDeclaration = function(node) {
		if (node.name == functionName){
			body = node.body;
		}
	}

	this.postOrderVisitFunctionDeclaration = function(node) {
		if (node.name == functionName){
			body = null;
		}
	}

	this.preOrderVisitAssignmentExpression = function(node) {
		if (body != null && node.left.type == "Identifier"){
	  	 modified.push({name: node.left.name});
	  }
	}

	this.find = function(program, fname){
		body = null;
		modified = [];
		functionName = fname;
		this.visit(program);
		return modified;
	}
}

util.inherits(FindAllModifiedStateVariablesInGivenFunction, ASTVisitor);
module.exports = FindAllModifiedStateVariablesInGivenFunction;
var findAllModifiedStateVariablesInGivenFunction = new FindAllModifiedStateVariablesInGivenFunction();

// Find all public functions modifying an private state variables
var findUnsafeCalls = function(contract){
	var unsafes = [];
	var variables = stateVariablesFinder.find(contract);
	var functions = functionsFinder.find(contract);
	for (var i in functions){
		var funct = functions[i];
		var modifiedVars = findAllModifiedStateVariablesInGivenFunction.find(contract, funct.name);
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
	var functions = functionsFinder.find(contract);
	for (var i in functions){
		var funct = functions[i];
		var calledFunctions = functionCallsFromFunction.find(contract, funct.name);
		for (var j in calledFunctions){
			var calledFunction = calledFunctions[j];
			if (calledFunction.name == functionName){
				froms.push(funct);
			}
		}
	}
	return froms;
}

module.exports = {
  revealUnsafeCalls: function(contract){
    console.info(contract);
    console.info(findUnsafeCalls(parser.parse(contract)));
    return  findUnsafeCalls(parser.parse(contract));
  },
  revealUnsafeCallsFromFile: function(contract){
    return  findUnsafeCalls(parser.parseFile(contract));
  }
};
