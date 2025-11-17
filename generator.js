(function() {
    "use strict"

    function Generator(env, language) {
        this.env = env === undefined ? "node" : env
        this.language = language === undefined ? "eng" : language
        // const {_Str, 수학, 날짜, 숫자, 문자, isInteger, 정수인가, 숫자인가, 자료형, _save, _load} = compileModules\n"
        this.header = "const {_Str, \uC218\uD559, \uB0A0\uC9DC, \uC22B\uC790, \uBB38\uC790, isInteger, \uC815\uC218\uC778\uAC00, \uC22B\uC790\uC778\uAC00, \uC790\uB8CC\uD615, _save, _load} = compileModules\n" +
                      "Object.defineProperties(String.prototype, _Str)\n"
        this.code = ""
        this.language = language

        this.languageHeader()
        if (this.env == "api2") {
            this.api2Header()
        } else if(this.env == "node") {
            this.nodeHeader()
        }

        // const 저장 = save\n" 
        // const 불러오기 = load\n"
        this.header += "const \uC800\uC7A5 = save\n" +
                       "const \uBD88\uB7EC\uC624\uAE30 = load\n"
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
        this.header += "const save = _save('api2')\n" + 
                       "const load = _load('api2')\n"
        if(this.language == "eng") {
            this.header += "var message = msg.content\n" +
                       "var room = msg.room\n" + 
                       "var sender = msg.author.name\n"
        } else if(this.language == "kor") {
            // var 메시지 = msg.content\n
            // var 방이름 = msg.room\n
            // var 보낸사람 = msg.author.name\n
            this.header += "var \uBA54\uC2DC\uC9C0 = msg.content\n" +
                       "var \uBC29\uC774\uB984 = msg.room\n" + 
                       "var \uBCF4\uB0B8\uC0AC\uB78C = msg.author.name\n"
        }
    }

    Generator.prototype.nodeHeader = function() {
        this.header += "const save = _save('node')\n" +
                       "const load = _load('node')\n"
    }

    Generator.prototype.languageHeader = function() {
        if(this.language == "kor") {
            this.header += "Object.defineProperty(Boolean.prototype, 'toString', {\n" +
                           "value : function() { return this.valueOf() ? '참' : '거짓' } })\n"
        }
    }

    module.exports = Generator
})()