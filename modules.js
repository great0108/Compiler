(function() {
    "use strict"

    // class
    const Str = {}  // String.prototype
    Object.defineProperties(Str, {
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
    })

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


    // Date
    const 날짜 = {
        "년" : function() {
            return new Date().getFullYear()
        },
        "월" : function() {
            return new Date().getMonth() + 1
        },
        "요일" : function() {
            let day = new Date().getDay()
            let name = ["일", "월", "화", "수", "목", "금", "토"]
            return name[day]
        },
        "일" : function() {
            return new Date().getDate()
        },
        "시" : function() {
            return new Date().getHours()
        },
        "분" : function() {
            return new Date().getMinutes()
        },
        "초" : function() {
            return new Date().getSeconds()
        },
        "밀리초" : function() {
            return new Date().getMilliseconds()
        },
        "현재" : function() {
            return new Date().toLocaleString()
        },
        "숫자" : function() {
            return Date.now()
        }
    }  


    // function
    const 숫자인가 = isNaN

    function isInteger(x) {
        return Number.isInteger(Number(x))
    }

    const 정수인가 = isInteger

    function 자료형(x) {
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

    module.exports = {
        Str : Str,
        수학 : 수학,
        날짜 : 날짜,
        isInteger : isInteger,
        정수인가 : 정수인가,
        숫자인가 : 숫자인가,
        자료형 : 자료형
    }
    
})()