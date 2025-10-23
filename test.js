(function() {
    "use strict"
    const Lexer = require("./Lexer.js")
    const {TokenType} = require("./token.js")

    let source = "IF+-123 foo*ELSE/"
    let lexer = new Lexer(source)

    let token = lexer.getToken()
    while (token.type != TokenType.EOF) {
        console.log(token.type, token.text)
        token = lexer.getToken()
    }
})()