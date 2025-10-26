(function() {
    "use strict"
    const {TokenType} = require("./token.js")

    function Parser(lexer, generator, debug) {
        this.lexer = lexer
        this.generator = generator
        this.debug = debug === undefined ? false : true
        
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
        while (!this.checkToken(TokenType.EOF)) {
            this.statement()
        }
        return this.generator.header + this.generator.code
    }

    Parser.prototype.statement = function() {
        if (this.checkToken(TokenType.NEWLINE)) {
            if (this.debug) console.log("newline")
            this.nextToken()
            return
        }

        if (this.checkToken(TokenType.PRINT)) {
            if (this.debug) console.log("print")
            this.nextToken()

            if (this.checkToken(TokenType.STRING)) {
                this.generator.addPrint()
                this.generator.addLine("(\"" + this.curToken.text + "\")")
                this.nextToken()
            } else {
                this.generator.addPrint()
                this.generator.add("(")
                this.expression()
                this.generator.addLine(")")
            }
        } else if (this.checkToken(TokenType.IF)) {
            if (this.debug) console.log("if")
            this.nextToken()
            this.generator.add("if(")
            this.expression()
            this.newline()
            this.generator.addLine("){")

            while (!this.checkToken(TokenType.END) && !this.checkToken(TokenType.ELSE)) {
                this.statement()
            }

            if (this.checkToken(TokenType.ELSE)) {
                this.else()
            }
            this.match(TokenType.END)
            this.generator.addLine("}")
        } else if (this.checkToken(TokenType.IDENT)) {
            if (this.debug) console.log("assign")
            if (!this.variables.has(this.curToken.text)) {
                this.variables.add(this.curToken.text)
                this.generator.add("var ")
            }
            this.generator.add(this.curToken.text + " = ")
            this.nextToken()
            this.match(TokenType.EQ)
            this.expression()
            this.generator.addLine()
        }
        else {
            this.error("Invalid statement at " + this.curToken.text + " (" + this.curToken.type + ")")
        }
        this.newline()
    }

    Parser.prototype.else = function() {
        if (this.debug) console.log("else")
        this.nextToken()
        this.generator.add("}else")
        if (this.checkToken(TokenType.IF)) {
            this.nextToken()
            this.generator.add(" if(")
            this.expression()
            this.newline()
            this.generator.addLine("){")

            while (!this.checkToken(TokenType.END) && !this.checkToken(TokenType.ELSE)) {
                this.statement()
            }
            if (this.checkToken(TokenType.ELSE)) {
                this.else()
            }
        } else if (this.checkToken(TokenType.NEWLINE)) {
            this.nextToken()
            this.generator.addLine("{")

            while (!this.checkToken(TokenType.END)) {
                this.statement()
            }
        } else {
            this.error("Unexpected token at " + this.curToken.text)
        }
    }

    // check or
    Parser.prototype.expression = function() {
        this.expression1()
        while (this.checkToken(TokenType.OR)) {
            this.generator.add("||")
            this.nextToken()
            this.expression1()
        }
    }

    // check and
    Parser.prototype.expression1 = function() {
        this.expression2()
        while (this.checkToken(TokenType.AND)) {
            this.generator.add("&&")
            this.nextToken()
            this.expression2()
        }
    }

    // check comparison
    Parser.prototype.expression2 = function() {
        this.expression3()
        while (this.checkComparison()) {
            this.generator.add(this.curToken.text)
            this.nextToken()
            this.expression3()
        }
    }

    // check +, -
    Parser.prototype.expression3 = function() {
        this.expression4()
        while (this.checkToken(TokenType.PLUS) || this.checkToken(TokenType.MINUS)) {
            this.generator.add(this.curToken.text)
            this.nextToken()
            this.expression4()
        }
    }

    // check *, /
    Parser.prototype.expression4 = function() {
        this.expression5()
        while (this.checkToken(TokenType.ASTERISK) || this.checkToken(TokenType.SLASH) || this.checkToken(TokenType.PERSENT)) {
            this.generator.add(this.curToken.text)
            this.nextToken()
            this.expression5()
        }
    }

    // check ^
    Parser.prototype.expression5 = function() {
        this.expression6()
        while (this.checkToken(TokenType.CARET)) {
            this.generator.add("**")
            this.nextToken()
            this.expression6()
        }
    }

    // check unary
    Parser.prototype.expression6 = function() {
        if (this.checkToken(TokenType.PLUS) || this.checkToken(TokenType.MINUS)) {
            this.generator.add(this.curToken.text)
            this.nextToken()
        } else if (this.checkToken(TokenType.NOT)) {
            this.generator.add("!")
            this.nextToken()
        }
        this.expression7()
    }

    // check .
    Parser.prototype.expression7 = function() {
        if (this.checkToken(TokenType.NUMBER) || this.checkToken(TokenType.TRUE) || this.checkToken(TokenType.FALSE)) {
            this.primary()
        } else {
            this.primary()
            while (this.checkToken(TokenType.DOT)) {
                this.generator.add(".")
                this.nextToken()
                if (this.checkToken(TokenType.IDENT)) {
                    this.generator.add(this.curToken.text)
                    this.nextToken()
                } else {
                    this.error("Unexpected token at " + this.curToken.text)
                }
            }
        }
    }

    Parser.prototype.primary = function() {
        if (this.checkToken(TokenType.LB)) {
            this.generator.add("(")
            this.nextToken()
            this.expression()
            this.match(TokenType.RB)
            this.generator.add(")")
        } else if (this.checkToken(TokenType.NUMBER)) {
            this.generator.add(this.curToken.text)
            this.nextToken()
        } else if (this.checkToken(TokenType.STRING)) {
            this.generator.add('"' + this.curToken.text + '"')
            this.nextToken()
        } else if (this.checkToken(TokenType.TRUE)) {
            this.generator.add("true")
            this.nextToken()
        } else if (this.checkToken(TokenType.FALSE)) {
            this.generator.add("false")
            this.nextToken()
        } else if (this.checkToken(TokenType.IDENT)) {
            if (!this.variables.has(this.curToken.text)) {
                this.error("Referencing variable before assignment: " + this.curToken.text)
            }
            this.generator.add(this.curToken.text)
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