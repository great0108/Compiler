(function() {
    "use strict"

    function Generator(env) {
        this.env = env === undefined ? "node" : "api2"
        this.header = ""
        this.code = ""

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
        this.header += "var message = msg.content\n" +
                       "var room = msg.room\n" + 
                       "var sender = msg.author.name\n"
    }

    module.exports = Generator
})()