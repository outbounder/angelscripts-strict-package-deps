var path = require("path")
var fs = require("fs")

var lookupCurrentVersion = function(depName) {
  var packagejson = require(path.join(process.cwd(), "node_modules", depName, "package.json"))
  return packagejson.version
}

module.exports = function(angel){
  angel.on("package strict deps", function(){
    var packagejson = require(path.join(process.cwd(), "package.json"))
    for(var depName in packagejson.dependencies) {
      var version = packagejson.dependencies[depName]
      if(version == "latest" || version == "*") {
        var strictVersion = lookupCurrentVersion(depName)
        packagejson.dependencies[depName] = strictVersion
      }
    }
    for(var depName in packagejson.devDependencies) {
      var version = packagejson.devDependencies[depName]
      if(version == "latest" || version == "*") {
        var strictVersion = lookupCurrentVersion(depName)
        packagejson.devDependencies[depName] = strictVersion
      }
    }
    fs.writeFileSync(path.join(process.cwd(), "package.json"), JSON.stringify(packagejson, null, 2))
    console.log("done, all versions are set to current used ones")
  })
}