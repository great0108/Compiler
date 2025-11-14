(function() {
    "use strict"
    const Lexer = require("./lexer.js")
    const Parser = require("./parser.js")
    const Generator = require("./generator.js")
    const compileModules = require("./modules.js")

    function compile(source, env, language) {
        let lexer = new Lexer(source)
        let generator = new Generator(env)
        let parser = new Parser(lexer, generator, language)
        let code = parser.program()
        return code
    }

    module.exports = {
        Lexer : Lexer,
        Parser : Parser,
        Generator : Generator,
        compile : compile,
        compileModules : compileModules
    }
})()