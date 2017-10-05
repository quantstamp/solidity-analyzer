const util = require('util');

ASTVisitor = function(){

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
      for (k in node.body){
        this.visit(node.body[k]);
      }
      this.postOrderVisitContractStatement(node);
    }
    else if (node.type == "FunctionDeclaration"){
      this.preOrderVisitFunctionDeclaration(node);
      for (k in node.params){
        this.visit(node.params[k]);
      }
      for (k in node.modifiers){
        this.visit(node.modifiers[k]);
      }
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
        this.visit (node.arguments[argument]);
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
    else if(node.type == "MemberExpression"){
      this.preOrderVisitMemberExpression(node);
      this.visit (node.object);
      this.visit (node.property);
      this.postOrderVisitMemberExpression(node);
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

  this.preOrderVisitMemberExpression = function(node){}
  this.postOrderVisitMemberExpression = function(node){}

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

// Finding all "delegatecall(msg.data)"s
var FindAllDelegateCallFunctions = function(){

  var visitedMemberCall = null;
  var visitedDelegatedCall = null;
  var visitedMsg = null;
  var visitedData = null;
  var argsNum = -1;
  var caller = [];
  var callerName = null;
  var functionName = null;
  ASTVisitor.apply(this, arguments);

  this.preOrderVisitCallExpression = function(node) {
    // It is expected that delegatecall has one argument
    argsNum = node.arguments.length;
  }

  this.postOrderVisitCallExpression = function(node) {

    if (functionName != null &&
        argsNum == 1 &&
        visitedDelegatedCall != null &&
        visitedMsg != null &&
        visitedData != null &&
        callerName != null) {
      caller.push({name: callerName, functionName: functionName});
    }

    visitedMemberCall = null;
    visitedDelegatedCall = null;
    visitedMsg = null;
    visitedData = null;
    argsNum = -1;
  }

  this.preOrderVisitMemberExpression = function(node) {
    // The delegatecall has only one argument
    if (argsNum == 1){
      // The next visitor methods know that the aobject.delegatecall is visited
      visitedMemberCall = node;
    }
    if (visitedDelegatedCall == null){
      // keep the name as the delegatecall is not visited. Later this value
      // is recorded.
      callerName = node.object.name;
    }
  }

  this.postOrderVisitMemberExpression = function(node) {
    visitedMemberCall == null;
  }

  this.preOrderVisitIdentifier = function(node) {
    // keep in mind that the delegatecall has to be on the rhs of a membership
    // operator.
    if (visitedMemberCall != null &&
        node.name == "delegatecall") {
      visitedDelegatedCall = node;
    }

    // The delegatecall has been already visited. The parameter to this
    // function has to be 'msg'
    if (visitedMemberCall != null &&
        visitedDelegatedCall != null &&
        node.name == "msg"){
      visitedMsg = node;
    }

    // msg is visited, no it is expected to visit data
    if (visitedMemberCall != null &&
        visitedDelegatedCall != null &&
        visitedMsg != null &&
        node.name == "data"){
      visitedData = node;
    }
  }

  this.preOrderVisitFunctionDeclaration = function(node) {
    // fallback function has no name so, the name is emoty
    functionName = node.name == null ? "()" : node.name;
  }

  this.postOrderVisitFunctionDeclaration = function(node) {
    functionName = null;
  }
  this.find = function(program){
    this.visit(program);
    return caller;
  }
}
util.inherits(FindAllDelegateCallFunctions, ASTVisitor);

module.exports = {
  stateVariablesFinder: function(){ return new StateVariablesFinder();},
  functionsFinder: function(){ return new FunctionsFinder();},
  functionCallsFromFunction: function(){ return new FunctionCallsFromFunction();},
  findAllModifiedStateVariablesInGivenFunction: function(){return new FindAllModifiedStateVariablesInGivenFunction();},
  findAllDelegateCallFunctions: function(){return new FindAllDelegateCallFunctions();}
};
