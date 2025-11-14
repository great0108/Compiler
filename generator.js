(function() {
    "use strict"

    function Generator(env, language) {
        this.env = env === undefined ? "node" : env
        this.language = language === undefined ? "eng" : language
        this.header = "const {_Str, 수학, 날짜, 숫자, 문자, isInteger, 정수인가, 숫자인가, 자료형, save, load, 저장, 불러오기} = compileModules\n" +
                      "Object.defineProperties(String.prototype, _Str)\n"
        this.code = ""
        this.language = language

        this.languageHeader()
        if (this.env == "api2") {
            this.api2Header()
        }
    }

    Generator.prototype.add = function(code) {
        this.code += code
    }

    Generator.prototype.addLine = function(code) {
        code = code === undefined ? "" : code
        this.code += code + "\n"
    }

    Generator.prototype.addPrint = function() {
        if (this.env == "api2") {
            this.add("msg.reply")
        } else if (this.env == "node") {
            this.add("console.log")
        }
    }

    Generator.prototype.headerLine = function(code) {
        this.header += code + "\n"
    }

    Generator.prototype.api2Header = function() {
        if(this.language == "eng") {
            this.header += "var message = msg.content\n" +
                       "var room = msg.room\n" + 
                       "var sender = msg.author.name\n"
        } else if(this.language == "kor") {
            this.header += "var 메시지 = msg.content\n" +
                       "var 방이름 = msg.room\n" + 
                       "var 보낸사람 = msg.author.name\n"
        }
    }

    Generator.prototype.languageHeader = function() {
        if(this.language == "kor") {
            this.header += "Object.defineProperty(Boolean.prototype, 'toString', {\n" +
                           "value : function() { return this.valueOf() ? '참' : '거짓' } })\n"
        }
    }

    module.exports = Generator
})()