const SolidityAnalyzer = require('./index');

var cli = function(){
  if(process.argv.length < 3) {
    console.log("Error: Missing argument for sol file to scan");
    process.exit(1);
  }

  var target   = process.argv[2];

  var unsafes = SolidityAnalyzer.revealUnsafeCallsFromFile(target);
  for (var i in unsafes){
    console.warn("\tUnsafe modification of '"+unsafes[i].call+"' [indirectly] from '"+unsafes[i].modified+"'.");
  }

  var delegates = SolidityAnalyzer.revealUnsafeDelegatecallsFromFile(target);
  for (var i in delegates){
    console.warn("\tA delegateCall in function '"+delegates[i].functionName+"' might cause malicious access to public methods of '"+delegates[i].name+"'("+delegates[i].type+").");
  }
}

cli()
