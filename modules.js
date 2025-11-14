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
        "자르기" : {
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
    const 수학 = {
        "내림" : Math.floor,
        "올림" : Math.ceil,
        "반올림" : Math.round,
        "랜덤" : function(start, end) {
            if(end === undefined) {
                start = start === undefined ? 1 : start
                return Math.random() * start
            }
            return Math.random() * (end - start) + start
        },
        "최소" : Math.min,
        "최대" : Math.max,
        "루트" : Math.sqrt,
        "절댓값" : Math.abs
    }
    
    Object.assign(수학, Math)

    const 숫자 = Number
    const 문자 = String

    // Date
    const 날짜 = {
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
    const 숫자인가 = function(x) {
        return !isNaN(x)
    }

    const isInteger = function(x) {
        return Number.isInteger(Number(x))
    }

    const 정수인가 = isInteger

    const 자료형 = function(x) {
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

    const save = function(path, json) {
        json = JSON.stringify(json)
        if(setting.nodeJS) {
            const fs = require("fs")
            fs.writeFileSync(path, json, "utf-8")
        } else {
            FileStream.write(setting.module_path + "/" + path, json)
        }
    }

    const load = function(path) {
        let json = null
        if(setting.nodeJS) {
            const fs = require("fs")
            json = fs.readFileSync(path, "utf-8")
        } else {
            json = FileStream.read(setting.module_path + "/" + path)
        }
        return JSON.parse(json)
    }

    const 저장 = save
    const 불러오기 = load

    module.exports = {
        _Str : Str,
        수학 : 수학,
        날짜 : 날짜,
        숫자 : 숫자,
        문자 : 문자,
        isInteger : isInteger,
        정수인가 : 정수인가,
        숫자인가 : 숫자인가,
        자료형 : 자료형,
        save : save,
        load : load,
        저장 : 저장,
        불러오기 : 불러오기
    }
    
})()