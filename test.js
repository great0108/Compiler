(function() {
    "use strict"
    const {TokenType} = require("./token.js")
    const Lexer = require("./lexer.js")
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
PRINT b.length
PRINT c
PRINT d
PRINT isNaN(a) OR FALSE
console.log(a)
`

    let source2 = "a = 1\nab.abc"
    let lexer = new Lexer(source)
    // let token = lexer.getToken()
    // while (token.type != TokenType.EOF) {
    //     console.log(token.type, token.text)
    //     token = lexer.getToken()
    // }
    let generator = new Generator()
    let parser = new Parser(lexer, generator, true)

    let code = parser.program()
    console.log()
    console.log(code)
    eval(code)
})()