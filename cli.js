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
}

cli()
