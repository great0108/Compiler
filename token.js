(function() {
    "use strict"

    const TokenType = {
        EOF : "EOF",
        NEWLINE: "NEWLINE",
        NUMBER : "NUMBER",
        IDENT  : "IDENT",
        STRING : "STRING",
        
        // keywords
        PRINT : "PRINT",
        INPUT : "INPUT",
        IF : "IF",
        ELSE : "ELSE",
        END : "END",

        // operators
        EQ : "EQ",
        PLUS : "PLUS",
        MINUS : "MINUS",
        ASTERISK : "ASTERISK",
        SLASH : "SLASH",
        EQEQ : "EQEQ",
        NOTEQ : "NOTEQ",
        LT : "LT",
        LTEQ : "LTEQ",
        GT : "GT",
        GTEQ : "GTEQ",
        AND : "AND",
        OR : "OR",
        NOT : "NOT"
    }

    function Token(tokenText, tokenType) {
        this.text = tokenText
        this.type = tokenType
    }

    Token.checkKeyword = function(tokenText) {
        const keywords = ["PRINT", "INPUT", "IF", "ELSE", "END"]
        if (keywords.includes(tokenText)) {
            return tokenText
        }
        return null
    }

    module.exports = {
        TokenType: TokenType,
        Token: Token
    }

})()