(function() {
    "use strict"

    // class
    const Str = {  // String.prototype
        "\uC2DC\uC791" : {  // 시작
            value : String.prototype.startsWith,
        },
        "\uB05D" : {  // 끝
            value : String.prototype.endsWith
        },
        "\uD3EC\uD568" : {  // 포함
            value : String.prototype.includes
        },
        "\uCC3E\uAE30" : {  // 찾기
            value : function(value, index) {
                return this.indexOf(value, index) + 1
            }
        },
        "\uC790\uB974\uAE30" : {  // 자르기
            value : function(start, end) {
                if(typeof start == "number") {
                    start = start > 0 ? start - 1 : start
                }
                if(typeof end == "number") {
                    if(end == -1) {
                        end = undefined
                    } else {
                        end = end > 0 ? end : end + 1
                    }
                }
                return this.slice(start, end)
            }
        },
        "\uBC18\uBCF5" : {  // 반복
            value : String.prototype.repeat
        },
        "\uBC14\uAFB8\uAE30" : {  // 바꾸기
            value : String.prototype.replace
        },
        "\uBAA8\uB450\uBC14\uAFB8\uAE30" : {  // 모두바꾸기
            value : function(value, replace) {
                let str = this
                while(str.includes(value)) {
                    str = str.replace(value, replace)
                }
                return str
            }
        },
        "\uB2E4\uB4EC\uAE30" : {  // 다듬기
            value : String.prototype.trim
        }
    }

    // Math
    const Math_kor = {
        "\uB0B4\uB9BC" : Math.floor,  // 내림
        "\uC62C\uB9BC" : Math.ceil,  // 올림
        "\uBC18\uC62C\uB9BC" : Math.round,  // 반올림
        "rand" : function(start, end) {
            if(end === undefined) {
                start = start === undefined ? 1 : start
                return Math.random() * start
            }
            return Math.random() * (end - start) + start
        },
        "\uB79C\uB364" : function(start, end) {  // 랜덤
            return this.rand(start, end)
        },
        "\uB79C\uB364\uC815\uC218" : function(start, end) {  // 랜덤정수
            let rand = this.rand(start, end+1)
            return Math.floor(rand)
        },
        "\uCD5C\uC18C" : Math.min,  // 최소
        "\uCD5C\uB300" : Math.max,  // 최대
        "\uB8E8\uD2B8" : Math.sqrt,  // 루트
        "\uC808\uB313\uAC12" : Math.abs  // 절댓값
    }
    
    Object.assign(Math_kor, Math)

    // Date
    const Date_kor = {
        get "\uB144"() {  // 년
            return new Date().getFullYear()
        },
        get "\uC6D4"() {  // 월
            return new Date().getMonth() + 1
        },
        get "\uC694\uC77C"() {  // 요일
            let day = new Date().getDay()
            // let name = ["일", "월", "화", "수", "목", "금", "토"]
            let name = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"]
            return name[day]
        },
        get "\uC77C"() {  // 일
            return new Date().getDate()
        },
        get "\uC2DC"() {  // 시
            return new Date().getHours()
        },
        get "\uBD84"() {  // 분
            return new Date().getMinutes()
        },
        get "\uCD08"() {  // 초
            return new Date().getSeconds()
        },
        get "\uBC00\uB9AC\uCD08"() {  // 밀리초
            return new Date().getMilliseconds()
        },
        get "\uD604\uC7AC"() {  // 현재
            return new Date().toLocaleString()
        },
        get "\uC22B\uC790"() {  // 숫자
            return Date.now()
        }
    }  


    // function
    const isNum = function(x) {
        return !isNaN(x)
    }

    const isInteger = function(x) {
        return Number.isInteger(Number(x))
    }

    const dataType = function(x) {
        if(typeof x == "number") {
            return "\uC22B\uC790"  // 숫자
        } else if(typeof x == "string") {
            return "\uBB38\uC790"  // 문자
        } else if(typeof x == "boolean") {
            return "\uBD88\uB9AC\uC5B8"  // 불리언
        } else if(typeof x == "function") {
            return "\uD568\uC218"  // 함수
        } else {
            return typeof x
        }
    }

    const File = {
        dataPath : "sdcard/CompilerBots",
        _save : function(env) {
            let folder = this.dataPath

            function save_node(path, json) {
                json = JSON.stringify(json)
                const fs = require("fs")
                fs.writeFileSync(folder + "/" + path + ".txt", json, "utf-8")
            }

            function save_api2(path, json) {
                json = JSON.stringify(json)
                FileStream.write(folder + "/" + path + ".txt", json)
            }
            
            if(env == "node") {
                return save_node
            } else if(env == "api2") {
                return save_api2
            }
        },
        _load : function(env) {
            let folder = this.dataPath

            function load_node(path) {
                const fs = require("fs")
                if(!fs.existsSync(folder + "/" + path + ".txt")) {
                    return null
                }
                let json = fs.readFileSync(folder + "/" + path + ".txt", "utf-8")
                return JSON.parse(json)
            }

            function load_api2(path) {
                let json = FileStream.read(folder + "/" + path + ".txt")
                return JSON.parse(json)
            }

            if(env == "node") {
                return load_node
            } else if(env == "api2") {
                return load_api2
            }
        }
    }

    module.exports = {
        _Str : Str,
        "\uC218\uD559" : Math_kor,  // 수학
        "\uB0A0\uC9DC" : Date_kor,  // 날짜
        "\uC22B\uC790" : Number,  // 숫자
        "\uBB38\uC790" : String,  // 문자
        "isInteger" : isInteger,
        "\uC815\uC218\uC778\uAC00" : isInteger,  // 정수인가
        "\uC22B\uC790\uC778\uAC00" : isNum,  // 숫자인가
        "\uC790\uB8CC\uD615" : dataType,  // 자료형
        File : File
    }
    
})()