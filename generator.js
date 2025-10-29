(function() {
    "use strict"

    function Generator(env, language) {
        this.env = env === undefined ? "node" : env
        this.header = ""
        this.code = ""
        this.language = language

        if (this.env == "api2") {
            this.api2Header(language)
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

    Generator.prototype.api2Header = function(language) {
        if(language == "eng") {
            this.header += "var message = msg.content\n" +
                       "var room = msg.room\n" + 
                       "var sender = msg.author.name\n"
        } else if(language == "kor") {
            this.header += "var 메시지 = msg.content\n" +
                       "var 방이름 = msg.room\n" + 
                       "var 보낸사람 = msg.author.name\n"
        }
    }

    module.exports = Generator
})()