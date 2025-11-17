const {compile, compileModules} = require("../index.js")

let source = `
정답 = 불러오기("정답")
게임중 = 불러오기("게임중")

만약 메시지.시작("/업다운") 그리고 아니 게임중
  저장("정답", 수학.랜덤정수(1, 100))
  저장("게임중", 참)
  출력 "업다운을 시작합니다, /정답 (숫자) 형식으로 정수를 입력하세요. 범위는 1부터 100까지 입니다."
아니면 만약 메시지.시작("/정답") 그리고 게임중
  입력값 = 메시지.자르기(4)
  만약 정수인가(입력값)
    입력값 = 숫자(입력값)
    만약 입력값 = 정답
      출력 "정답입니다!"
      저장("게임중", 거짓)
    아니면 만약 입력값 < 정답
      출력 입력값 + "보다는 큽니다"
    아니면
      출력 입력값 + "보다는 작습니다"
    끝
  아니면
    출력 "정수를 입력해주세요"
  끝
끝
`

compileModules.File.dataPath = "."
function onMessage (msg) {
  let code = compile(source, "api2", "kor")
  eval(code)
}

bot.addListener(Event.MESSAGE, onMessage);