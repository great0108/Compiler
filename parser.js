(function() {
    "use strict"
    const {TokenType, Keywords, KorKeywords} = require("./token.js")
    const {checkTypo} = require("./textSimilarity.js")

    function Parser(lexer, generator, language, debug) {
        this.lexer = lexer
        this.generator = generator
        this.debug = debug === undefined ? false : debug
        this.language = language === undefined ? "eng" : language
        
        this.curToken = null
        this.peekToken = null
        this.line = 1
        this.shouldEnd = false

        let preVariables = [
            // class
            "Array",
            "Object",
            "Function",
            "Number",
            "String",
            "Map",
            "Set",
            "Math",
            "Date",
            "JSON",
            "RegExp",
            "Error",

            // function
            "eval",
            "isFinite",
            "isNaN",
            "parseInt",
            "parseFloat",
            "console",  // for node

            // value
            "Infinity",
            "NaN",
            "undefined",
            "null"
        ]
        this.variables = new Set(preVariables)

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
            if(this.language == "kor" && Keywords.includes(type)) {
                type = KorKeywords[Keywords.indexOf(type)]
            }
            // this.error("Expected " + type + ", got " + this.curToken.type)
            this.error(type + " 대신 다른 이상한 문자 : " + this.curToken.text)
        }
        this.nextToken()
    }

    Parser.prototype.nextToken = function() {
        this.curToken = this.peekToken
        this.peekToken = this.lexer.getToken()
    }

    Parser.prototype.error = function(message, tokenText) {
        if(tokenText !== undefined) {
            let keywords = Keywords.concat(KorKeywords, Array.from(this.variables))
            let result = checkTypo(tokenText, keywords)
            if(result) {
                throw new Error(this.line + "번째 줄에서 에러, " + message + "\n'" + result + "'을(를) 사용하고 싶으셨나요?")
            }
        }
        // throw new Error("Parser error: " + message)
        throw new Error(this.line + "번째 줄에서 에러, " + message)
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
            this.newline()
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
            this.shouldEnd = true

            while (!this.checkToken(TokenType.END) && !this.checkToken(TokenType.ELSE)) {
                this.statement()
            }

            if (this.checkToken(TokenType.ELSE)) {
                this.else()
            }
            this.match(TokenType.END)
            this.generator.addLine("}")
        } else if (this.checkToken(TokenType.IDENT)) {
            if (this.checkPeek(TokenType.LB) || this.checkPeek(TokenType.DOT)) {
                this.expression()
            } else if (this.checkPeek(TokenType.EQ)) {
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
            } else {
                // this.error("Invalid statement at " + this.curToken.text)
                this.error("잘못된 코드 : " + this.curToken.text, this.curToken.text)
            }
        } else if (this.checkToken(TokenType.EOF)) {
            if (this.shouldEnd) {
                if(this.language == "kor") {
                    this.error("만약문이 '끝' 으로 끝나지 않음")
                }
                this.error("if문이 'END'로 끝나지 않음")
            } else {
                this.error("잘못된 코드 : " + this.curToken.text)
            }
        }
        else {
            // this.error("Invalid statement at " + this.curToken.text)
            this.error("잘못된 코드 : " + this.curToken.text)
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
            this.newline()
            this.generator.addLine("{")

            while (!this.checkToken(TokenType.END)) {
                this.statement()
            }
        } else {
            // this.error("Unexpected token at " + this.curToken.text)
            this.error("else 뒤에 이상한 문자 : " + this.curToken.text)
        }
    }

    Parser.prototype.functionCall = function() {
        if (this.debug) console.log("function call")
        this.generator.add(this.curToken.text + "(")
        this.nextToken()
        this.match(TokenType.LB)
        if (this.checkToken(TokenType.RB)) {
            this.nextToken()
            this.generator.add(")")
        } else {
            this.expression()
            while (this.checkToken(TokenType.NEWLINE)) {
                this.newline()
            }
            while (!this.checkToken(TokenType.RB)) {
                if (!this.checkToken(TokenType.COMMA)) {
                    this.error(") 대신 다른 이상한 문자 : " + this.curToken.text)
                }
                this.nextToken()
                this.generator.add(",")
                this.expression()
                while (this.checkToken(TokenType.NEWLINE)) {
                    this.newline()
                }
            }
            this.nextToken()
            this.generator.add(")")
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
        while (this.checkComparison() || this.checkToken(TokenType.EQ)) {
            if (this.checkToken(TokenType.EQ)) {
                this.generator.add("==")
            } else {
                this.generator.add(this.curToken.text)
            }
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
                    if (this.checkPeek(TokenType.LB)) {
                        this.functionCall()
                    } else {
                        this.generator.add(this.curToken.text)
                        this.nextToken()
                    }
                } else {
                    // this.error("Unexpected token at " + this.curToken.text)
                    this.error(". 뒤에 이상한 문자 : " + this.curToken.text)  // 이런 경우가 있나?
                }
            }
        }
    }

    Parser.prototype.primary = function() {
        if (this.checkToken(TokenType.NEWLINE)) {
            this.newline()
            this.primary()
        } else if (this.checkToken(TokenType.LB)) {
            this.generator.add("(")
            this.nextToken()
            this.expression()
            while (this.checkToken(TokenType.NEWLINE)) {
                this.newline()
            }
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
                // this.error("Referencing variable before assignment: " + this.curToken.text)
                this.error("선언하지 않은 변수를 사용함 : " + this.curToken.text, this.curToken.text)
            }
            if (this.checkPeek(TokenType.LB)) {
                this.functionCall()
            } else {
                this.generator.add(this.curToken.text)
                this.nextToken()
            }
        } else {
            // this.error("Unexpected token at " + this.curToken.text)
            this.error("이상한 문자 : " + this.curToken.text)
        }
    }

    Parser.prototype.newline = function() {
        this.match(TokenType.NEWLINE)
        this.line += 1
    }

    module.exports = Parser
})()