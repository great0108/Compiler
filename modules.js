(function() {
    "use strict"

    // class
    const Str = {  // String.prototype
        "시작" : {
            value : String.prototype.startsWith,
        },
        "끝" : {
            value : String.prototype.endsWith
        },
        "포함" : {
            value : String.prototype.includes
        },
        "찾기" : {
            value : function(value, index) {
                return this.indexOf(value, index) + 1
            }
        },
        "\uC790\uB974\uAE30" : {
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
        "반복" : {
            value : String.prototype.repeat
        },
        "바꾸기" : {
            value : String.prototype.replace
        },
        "모두바꾸기" : {
            value : function(value, replace) {
                let str = this
                while(str.includes(value)) {
                    str = str.replace(value, replace)
                }
                return str
            }
        },
        "다듬기" : {
            value : String.prototype.trim
        }
    }

    // Math
    const Math_kor = {
        "내림" : Math.floor,
        "올림" : Math.ceil,
        "반올림" : Math.round,
        "rand" : function(start, end) {
            if(end === undefined) {
                start = start === undefined ? 1 : start
                return Math.random() * start
            }
            return Math.random() * (end - start) + start
        },
        "랜덤" : function(start, end) {
            return this.rand(start, end)
        },
        "랜덤정수" : function(start, end) {
            let rand = this.rand(start, end+1)
            return Math.floor(rand)
        },
        "최소" : Math.min,
        "최대" : Math.max,
        "루트" : Math.sqrt,
        "절댓값" : Math.abs
    }
    
    Object.assign(Math_kor, Math)

    // Date
    const Date_kor = {
        get "년"() {
            return new Date().getFullYear()
        },
        get "월"() {
            return new Date().getMonth() + 1
        },
        get "요일"() {
            let day = new Date().getDay()
            let name = ["일", "월", "화", "수", "목", "금", "토"]
            return name[day]
        },
        get "일"() {
            return new Date().getDate()
        },
        get "시"() {
            return new Date().getHours()
        },
        get "분"() {
            return new Date().getMinutes()
        },
        get "초"() {
            return new Date().getSeconds()
        },
        get "밀리초"() {
            return new Date().getMilliseconds()
        },
        get "현재"() {
            return new Date().toLocaleString()
        },
        get "숫자"() {
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
            return "숫자"
        } else if(typeof x == "string") {
            return "문자"
        } else if(typeof x == "boolean") {
            return "불리언"
        } else if(typeof x == "function") {
            return "함수"
        } else {
            return typeof x
        }
    }
    
    const _save = function(env) {
        if(env == "node") {
            return save_node
        } else if(env == "api2") {
            return save_api2
        }
    }

    const save_node = function(path, json) {
        json = JSON.stringify(json)
        const fs = require("fs")
        fs.writeFileSync(path, json, "utf-8")
    }

    const save_api2 = function(path, json) {
        json = JSON.stringify(json)
        FileStream.write(path, json)
    }

    const _load = function(env) {
        if(env == "node") {
            return load_node
        } else if(env == "api2") {
            return load_api2
        }
    }

    const load_node = function(path) {
        const fs = require("fs")
        if(!fs.existsSync(path)) {
            return null
        }
        let json = fs.readFileSync(path, "utf-8")
        return JSON.parse(json)
    }

    const load_api2 = function(path) {
        let json = FileStream.read(path)
        return JSON.parse(json)
    }

    module.exports = {
        _Str : Str,
        "수학" : Math_kor,
        "날짜" : Date_kor,
        "숫자" : Number,
        "문자" : String,
        "isInteger" : isInteger,
        "정수인가" : isInteger,
        "숫자인가" : isNum,
        "자료형" : dataType,
        _save : _save,
        _load : _load,
    }
    
})()