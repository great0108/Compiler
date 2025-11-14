(function() {
    "use strict"
    const {TokenType} = require("./token.js")
    const Lexer = require("./lexer.js")
    const Parser = require("./parser.js")
    const Generator = require("./generator.js")
    const modules = require("./modules.js")

    function compile(source, env, language) {
        let lexer = new Lexer(source)
        let generator = new Generator(env, language)
        let parser = new Parser(lexer, generator, language)
        let code = parser.program()
        return code
    }


    let source = `a = 3
만약 a < 1 
    a = 1+1
아니면 만약 a < 2
    a = 3
아니면
    a = 4
끝

// test
b = "a" +
    "b"
c = 2^3-4*5%((6-1))
d = 아니 (a != b 또는 (참 그리고 a > 2))
PRINT a
PRINT b.length
PRINT c
PRINT d
PRINT isNaN(
a
) OR FALSE
`

    let code = compile(source, "node", "kor")
    console.log(code)
    eval(code)
})()