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

// test
b = "a" + "b"
c = 2^3-4*5%(6-1)
d = NOT (a != b OR TRUE AND a > 2)
PRINT a
PRINT b
PRINT c
PRINT d`
    let lexer = new Lexer(source)
    let generator = new Generator()
    let parser = new Parser(lexer, generator)

    let code = parser.program()
    console.log()
    console.log(code)
    eval(code)
})()