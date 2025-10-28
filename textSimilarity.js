(function() {
    "use strict"
    /** @author koine */
    /**
     * @update 전치 변환(ab <-> ba) 반영
     */

    const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
    const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
    const JONG = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'

    /**
     * @param {string} str
     * @returns {string} 한글 글자의 자모를 모두 분해시킨 문자열 
     */
    function norm(str){
        const l = str.length
        const res = str.split('')
        let c
        for(let i = 0; i < l; i++){
            if(/[가-힣]/.test(res[i])){
                c = res[i].normalize('NFD')
                res[i] = ''
                for(let j = 0; j < c.length; j++){
                    if(j === 0){
                        res[i] += CHO[c[j].charCodeAt() - 4352]
                    } else if(j === 1){
                        res[i] += JUNG[c[j].charCodeAt() - 4449]
                    } else {
                        res[i] += JONG[c[j].charCodeAt() - 4519]
                    }
                }
            }
        }
        return res.join('')
    }

    function editDistance(s1, s2){
        if(s1 === s2) return 0
        // s1이 항상 더 길거나 같게 유지
        if(s2.length > s1.length) return editDistance(s2, s1)
        if(s2.length === 0) return s1.length
        
        const len1 = s1.length, len2 = s2.length
        
        // d[i][j]는 s1의 처음 i글자와 s2의 처음 j글자 사이의 거리를 저장
        // d는 (len1 + 1) x (len2 + 1) 크기로 초기화 (s1의 길이 x s2의 길이)
        const d = Array(len1 + 1).fill(0).map(() => Array(len2 + 1).fill(0))
        
        for (let i = 0; i <= len1; i++) d[i][0] = i // s2가 비었을 때
        for (let j = 0; j <= len2; j++) d[0][j] = j // s1이 비었을 때
        
        for(let i = 1; i <= len1; i++)
            for(let j = 1; j <= len2; j++){
                const cost = (s1[i-1] === s2[j-1]) ? 0 : 1
                
                d[i][j] = Math.min(
                    d[i-1][j] + 1,      // 삭제 (s1[i-1] 제거)
                    d[i][j-1] + 1,      // 삽입 (s2[j-1] 삽입)
                    d[i-1][j-1] + cost  // 대체 (s1[i-1]을 s2[j-1]로 대체)
                )

                // 전치(Transposition) 변환: Damerau-Levenshtein
                // s1의 마지막 두 글자와 s2의 마지막 두 글자가 전치 관계일 때
                if (i > 1 && j > 1 && s1[i-1] === s2[j-2] && s1[i-2] === s2[j-1]) {
                    d[i][j] = Math.min(
                        d[i][j], 
                        d[i-2][j-2] + 1 // 전치 비용
                    )
                }
            }
        return d[len1][len2]
    }

    /**
     * @param {string} s1 
     * @param {string} s2 
     * @returns {number} 0~1 사이의 값(유사도)
     * @description 편집 거리 알고리즘(레벤슈타인)을 이용, 두 문자열 간 유사도를 측정하여 반환
     */
    function getSimilarity(s1, s2){
        if(s1 === s2) return 1
        if(s2.length > s1.length) return getSimilarity(s2, s1)
        if(s2.length === 0) return 0
        return 1 - editDistance(s1, s2)/s1.length
    }

    function checkTypo(str, keywords) {
        str = norm(str)
        if(str.length < 3) return null
        for(let keyword of keywords) {
            if(editDistance(str, norm(keyword)) == 1) {
                return keyword
            }
        }
        return null
    }

    module.exports = {
        norm: norm,
        editDistance : editDistance,
        getSimilarity: getSimilarity,
        checkTypo : checkTypo
    }
})()