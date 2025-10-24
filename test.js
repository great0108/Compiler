(function() {
    "use strict"
    const Lexer = require("./Lexer.js")
    const Parser = require("./parser.js")
    const Generator = require("./generator.js")

    let source = `a = 3
IF a < 1 
    a = 1+1
ELSE IF a < 2
    a = 3
ELSE
    a = 4
END

b = 3
s = 2
PRINT "Average: "
PRINT (b + s) / a`
    let lexer = new Lexer(source)
    let generator = new Generator()
    let parser = new Parser(lexer, generator)

    let code = parser.program()
    console.log()
    console.log(code)
    eval(code)
})()