(function() {
    "use strict"
    const {TokenType, Token} = require("./token.js")

    function Lexer(source) {
        this.source = source + "\n"
        this.curChar = ""
        this.curPos = -1
        this.line = 1
        this.afterDot = false
        this.nextChar()
    }

    Lexer.prototype.nextChar = function() {
        this.curPos += 1
        if (this.curPos >= this.source.length) {
            this.curChar = "\0"
        } else {
            this.curChar = this.source[this.curPos]
        }
    }

    Lexer.prototype.peek = function() {
        if (this.curPos + 1 >= this.source.length) {
            return "\0"
        }
        return this.source[this.curPos + 1]
    }

    Lexer.prototype.getToken = function() {
        this.skipWhitespace()
        this.skipComment()
        let token = null
        if (this.curChar == "+") {
            token = new Token(this.curChar, TokenType.PLUS)
        } else if (this.curChar == "-") {
            token = new Token(this.curChar, TokenType.MINUS)
        } else if (this.curChar == "*") {
            token = new Token(this.curChar, TokenType.ASTERISK)
        } else if (this.curChar == "/") {
            token = new Token(this.curChar, TokenType.SLASH)
        } else if (this.curChar == "%") {
            token = new Token(this.curChar, TokenType.PERSENT)
        } else if (this.curChar == "^") {
            token = new Token(this.curChar, TokenType.CARET)
        } else if (this.curChar == "(") {
            token = new Token(this.curChar, TokenType.LB)
        } else if (this.curChar == ")") {
            token = new Token(this.curChar, TokenType.RB)
        } else if (this.curChar == ",") {
            token = new Token(this.curChar, TokenType.COMMA)
        } else if (this.curChar == "\n") {
            token = new Token(this.curChar, TokenType.NEWLINE)
            this.line += 1
        } else if (this.curChar == "\0") {
            token = new Token("", TokenType.EOF)
        } else if (this.curChar == "=") {
            if (this.peek() == "=") {
                let lastChar = this.curChar
                this.nextChar()
                token = new Token(lastChar + this.curChar, TokenType.EQEQ)
            } else {
                token = new Token(this.curChar, TokenType.EQ)
            }
        } else if (this.curChar == ">") {
            if (this.peek() == "=") {
                let lastChar = this.curChar
                this.nextChar()
                token = new Token(lastChar + this.curChar, TokenType.GTEQ)
            } else {
                token = new Token(this.curChar, TokenType.GT)
            }
        } else if (this.curChar == "<") {
            if (this.peek() == "=") {
                let lastChar = this.curChar
                this.nextChar()
                token = new Token(lastChar + this.curChar, TokenType.LTEQ)
            } else {
                token = new Token(this.curChar, TokenType.LT)
            }
        } else if (this.curChar == "!") {
            if (this.peek() == "=") {
                let lastChar = this.curChar
                this.nextChar()
                token = new Token(lastChar + this.curChar, TokenType.NOTEQ)
            } else {
                // this.error("Expected !=, got !" + this.peek())
                this.error("!= 대신 다른 이상한 문자 : !" + this.peek())
            }
        } else if (this.curChar == ".") {
            if (this.isEngOrKor(this.peek())) {
                token = new Token(this.curChar, TokenType.DOT)
                this.afterDot = true
            } else {
                // this.error("Illegal character after dot.")
                this.error(". 뒤에 이상한 문자 : " + this.peek())
            }
        }
        else if (this.curChar == "\"") {
            this.nextChar()
            let startPos = this.curPos

            while (this.curChar != "\"") {
                if (this.curChar == "\n") {
                    // this.error("Unterminated string literal")
                    this.error("문자열이 쌍따옴표로 끝나지 않음")
                }
                this.nextChar()
            }

            let strText = this.source.slice(startPos, this.curPos)
            token = new Token(strText, TokenType.STRING)
        } else if (this.isDigit(this.curChar)) {
            let startPos = this.curPos
            while (this.isDigit(this.peek())) {
                this.nextChar()
            }

            if (this.peek() == ".") {
                this.nextChar()
                if (!this.isDigit(this.peek())) {
                    // this.error("Illegal character in number.")
                    this.error("숫자 소수점 뒤에 이상한 문자 : " + this.peek())
                }
                while (this.isDigit(this.peek())) {
                    this.nextChar()
                }
            }

            let numText = this.source.slice(startPos, this.curPos + 1)
            token = new Token(numText, TokenType.NUMBER)
        } else if (this.isEngOrKor(this.curChar)) {
            let startPos = this.curPos 
            while (this.isEngKorOrDigit(this.peek())) {
                this.nextChar()
            }

            let tokenText = this.source.slice(startPos, this.curPos + 1)
            let type = Token.checkKeyword(tokenText)
            if (type == null || this.afterDot) {
                token = new Token(tokenText, TokenType.IDENT)
                this.afterDot = false
            } else {
                token = new Token(tokenText, type)
            }
        }
        
        else {
            // this.error("Unknown character: " + this.curChar)
            this.error("이상한 문자 : " + this.curChar)
        }

        this.nextChar()
        return token
    }

    Lexer.prototype.error = function(message) {
        // throw new Error("Lexer error: " + message)
        throw new Error(this.line + "번째 줄에서 에러, " + message)
    }

    Lexer.prototype.skipWhitespace = function() {
        while (this.curChar == " " || this.curChar == "\t" || this.curChar == "\r") {
            this.nextChar()
        }
    }

    Lexer.prototype.skipComment = function() {
        if (this.curChar == "/" && this.peek() == "/") {
            while (this.curChar != "\n") {
                this.nextChar()
            }
        }
    }

    Lexer.prototype.isDigit = function(char) {
        let charCode = char.charCodeAt(0)
        return charCode >= 48 && charCode <= 57  // '0' to '9'
    }

    Lexer.prototype.isEngOrKor = function(char) {
        const regex = /[a-zA-Z]|[가-힣]|_/;
        return regex.test(char)
    }

    Lexer.prototype.isEngKorOrDigit = function(char) {
        const regex = /[a-zA-Z]|[가-힣]|_|[0-9]/;
        return regex.test(char)
    }

    module.exports = Lexer
})()