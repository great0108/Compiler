(function() {
    "use strict"

    function Generator() {
        this.header = ""
        this.code = ""
    }

    Generator.prototype.add = function(code) {
        this.code += code
    }

    Generator.prototype.addLine = function(code) {
        code = code === undefined ? "" : code
        this.code += code + "\n"
    }

    Generator.prototype.headerLine = function(code) {
        this.header += code + "\n"
    }

    module.exports = Generator
})()