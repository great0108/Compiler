(function() {
    "use strict"
    const Lexer = require("./Lexer.js")
    const Parser = require("./parser.js")

    let source = `foo = bar * 3 + 2
IF foo > 0
    IF (10 * 10) < 100
        PRINT bar
    END
END`
console.log(source.split("\n"))
    let lexer = new Lexer(source)
    let parser = new Parser(lexer)

    parser.program()
})()