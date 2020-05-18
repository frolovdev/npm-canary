console.log("current working directory", process.cwd());
var read = require("fs").readFileSync;
console.log(read("./hello.txt", "utf8"));
