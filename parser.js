(function() {
    "use strict"
    const {TokenType} = require("./token.js")

    function Parser(lexer) {
        this.lexer = lexer
        this.curToken = null
        this.peekToken = null
        this.variables = new Set()

        this.nextToken()
        this.nextToken()
    }

    Parser.prototype.checkToken = function(type) {
        return type == this.curToken.type
    }

    Parser.prototype.checkComparison = function() {
        return this.checkToken(TokenType.GT) || this.checkToken(TokenType.GTEQ) ||
               this.checkToken(TokenType.LT) || this.checkToken(TokenType.LTEQ) ||
               this.checkToken(TokenType.EQEQ) || this.checkToken(TokenType.NOTEQ)
    }

    Parser.prototype.checkPeek = function(type) {
        return type == this.peekToken.type
    }

    Parser.prototype.match = function(type) {
        if (!this.checkToken(type)) {
            this.error("Expected " + type + ", got " + this.curToken.type)
        }
        this.nextToken()
    }

    Parser.prototype.nextToken = function() {
        this.curToken = this.peekToken
        this.peekToken = this.lexer.getToken()
    }

    Parser.prototype.error = function(message) {
        throw new Error("Parser error: " + message)
    }

    Parser.prototype.program = function() {
        console.log("program")
        while (!this.checkToken(TokenType.EOF)) {
            this.statement()
        }
    }

    Parser.prototype.statement = function() {
        console.log("token : " + this.curToken.type)
        if (this.checkToken(TokenType.NEWLINE)) {
            console.log("newline")
            this.nextToken()
            return
        }

        if (this.checkToken(TokenType.PRINT)) {
            console.log("print")
            this.nextToken()

            if (this.checkToken(TokenType.STRING)) {
                this.nextToken()
            } else {
                this.expression()
            }
        } else if (this.checkToken(TokenType.IF)) {
            console.log("if")
            this.nextToken()
            this.expression()
            this.newline()

            while (!this.checkToken(TokenType.END)) {
                this.statement()
            }
            this.match(TokenType.END)
        } else if (this.checkToken(TokenType.IDENT)) {
            console.log("assign")
            if (!this.variables.has(this.curToken.text)) {
                this.variables.add(this.curToken.text)
            }
            this.nextToken()
            this.match(TokenType.EQ)
            this.expression()
        }
        else {
            this.error("Invalid statement at " + this.curToken.text + " (" + this.curToken.type + ")")
        }
        this.newline()
    }

    // check or
    Parser.prototype.expression = function() {
        console.log("expression")
        this.expression1()
        while (this.checkToken(TokenType.OR)) {
            this.nextToken()
            this.expression1()
        }
    }

    // check and
    Parser.prototype.expression1 = function() {
        console.log("expression1")
        this.expression2()
        while (this.checkToken(TokenType.AND)) {
            this.nextToken()
            this.expression2()
        }
    }

    // check comparison
    Parser.prototype.expression2 = function() {
        console.log("expression2")
        this.expression3()
        while (this.checkComparison()) {
            this.nextToken()
            this.expression3()
        }
    }

    // check +, -
    Parser.prototype.expression3 = function() {
        console.log("expression3")
        this.expression4()
        while (this.checkToken(TokenType.PLUS) || this.checkToken(TokenType.MINUS)) {
            this.nextToken()
            this.expression4()
        }
    }

    // check *, /
    Parser.prototype.expression4 = function() {
        console.log("expression4")
        this.expression5()
        while (this.checkToken(TokenType.ASTERISK) || this.checkToken(TokenType.SLASH)) {
            this.nextToken()
            this.expression5()
        }
    }

    // check ^
    Parser.prototype.expression5 = function() {
        console.log("expression5")
        this.expression6()
        while (this.checkToken(TokenType.CARET)) {
            this.nextToken()
            this.expression6()
        }
    }

    // check unary
    Parser.prototype.expression6 = function() {
        console.log("expression6")
        if (this.checkToken(TokenType.PLUS) || this.checkToken(TokenType.MINUS) || this.checkToken(TokenType.NOT)) {
            this.nextToken()
        }
        this.primary()
    }

    Parser.prototype.primary = function() {
        console.log("primary (" + this.curToken.text + ")")
        if (this.checkToken(TokenType.LB)) {
            this.nextToken()
            this.expression()
            this.match(TokenType.RB)
        } else if (this.checkToken(TokenType.NUMBER) || this.checkToken(TokenType.STRING)) {
            this.nextToken()
        } else if (this.checkToken(TokenType.IDENT)) {
            if (!this.variables.has(this.curToken.text)) {
                this.error("Referencing variable before assignment: " + this.curToken.text)
            }
            this.nextToken()
        } else {
            this.error("Unexpected token at " + this.curToken.text)
        }
    }

    Parser.prototype.newline = function() {
        this.match(TokenType.NEWLINE)
    }

    module.exports = Parser
})()