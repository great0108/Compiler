(function() {
    "use strict"

    const TokenType = {
        EOF : "EOF",
        IDENT  : "IDENT",
        NEWLINE: "줄바꿈",
        NUMBER : "숫자",
        STRING : "문자열",
        
        // keywords
        PRINT : "PRINT",
        IF : "IF",
        ELSE : "ELSE",
        END : "END",
        TRUE : "TRUE",
        FALSE : "FALSE",

        // operators
        EQ : "=",
        PLUS : "+",
        MINUS : "-",
        ASTERISK : "*",
        SLASH : "/",
        PERSENT : "%",
        CARET : "^",
        LB : "(",
        RB : ")",
        EQEQ : "==",
        NOTEQ : "!=",
        LT : "<",
        LTEQ : "<=",
        GT : ">",
        GTEQ : ">=",
        DOT : ".",
        COMMA : ",",
        AND : "AND",
        OR : "OR",
        NOT : "NOT"
    }

    const Keywords = ["PRINT", "IF", "ELSE", "END", "AND", "OR", "NOT", "TRUE", "FALSE"]

    const KorKeywords = ["출력", "만약", "아니면", "끝", "그리고", "또는", "아니", "참", "거짓"]

    function Token(tokenText, tokenType) {
        this.text = tokenText
        this.type = tokenType
    }

    Token.checkKeyword = function(tokenText) {
        if (Keywords.includes(tokenText)) {
            return tokenText
        } else if (KorKeywords.includes(tokenText)) {
            return Keywords[KorKeywords.indexOf(tokenText)]
        }
        return null
    }

    Token.getString = function(type) {

    }

    module.exports = {
        TokenType: TokenType,
        Token: Token,
        Keywords : Keywords,
        KorKeywords : KorKeywords
    }
})()