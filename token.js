(function() {
    "use strict"

    const TokenType = {
        EOF : "EOF",
        IDENT  : "IDENT",
        NEWLINE: "NEWLINE",
        NUMBER : "NUMBER",
        STRING : "STRING",
        
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

    // const KorKeywords = ["출력", "만약", "아니면", "끝", "그리고", "또는", "아니", "참", "거짓"]
    const KorKeywords = ["\uCD9C\uB825", "\uB9CC\uC57D", "\uC544\uB2C8\uBA74", "\uB05D", "\uADF8\uB9AC\uACE0", "\uB610\uB294", "\uC544\uB2C8", "\uCC38", "\uAC70\uC9D3"]

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

    module.exports = {
        TokenType: TokenType,
        Token: Token,
        Keywords : Keywords,
        KorKeywords : KorKeywords
    }
})()