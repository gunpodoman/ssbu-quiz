const seriesData = [
    { s: "슈퍼 마리오", c: ["마리오", "루이지", "피치", "데이지", "쿠파", "닥터마리오", "로젤리나&치코", "쿠파주니어", "뻐끔플라워"] },
    { s: "동키콩", c: ["동키콩", "디디콩", "킹크루루"] },
    { s: "젤다의 전설", c: ["링크", "젤다", "시크", "가논돌프", "영 링크", "툰 링크"] },
    { s: "메트로이드", c: ["사무스", "다크 사무스", "제로 슈트 사무스", "리들리"] },
    { s: "요시", c: ["요시"] },
    { s: "별의 커비", c: ["커비", "디디디 대왕", "메타 나이트"] },
    { s: "스타폭스", c: ["폭스", "팔코", "울프"] },
    { s: "포켓몬스터", c: ["피카츄", "푸린", "뮤츠", "피츄", "루카리오", "개굴닌자", "어흥염", "포켓몬 트레이너"] },
    { s: "MOTHER", c: ["네스", "류카"] },
    { s: "파이어 엠블렘", c: ["마르스", "루키나", "로이", "크롬", "아이크", "러플레", "카무이", "벨레트 / 벨레스"] },
    { s: "키드 이카루스", c: ["피트", "블랙피트", "팔루테나"] },
    { s: "와리오", c: ["와리오"] },
    { s: "피크민", c: ["피크민 & 올리마"] },
    { s: "동물의 숲", c: ["마을 주민", "여울"] },
    { s: "제노블레이드", c: ["슈르크", "호무라 / 히카리"] },
    { s: "스트리트 파이터", c: ["류", "켄"] },
    { s: "파이널 판타지", c: ["클라우드", "세피로스"] },
    { s: "악마성 드라큘라", c: ["시몬", "리히터"] },
    { s: "스플래툰", c: ["잉클링"] },
    { s: "페르소나", c: ["조커"] },
    { s: "드래곤 퀘스트", c: ["용사"] },
    { s: "반조 & 카주이", c: ["반조 & 카주이"] },
    { s: "아랑전설", c: ["테리"] },
    { s: "ARMS", c: ["미엔미엔"] },
    { s: "마인크래프트", c: ["스티브 / 알렉스"] },
    { s: "철권", c: ["카즈야"] },
    { s: "킹덤 하츠", c: ["소라"] },
    { s: "Mii 파이터", c: ["Mii 격투가", "Mii 검술가", "Mii 사격수"] },
    { s: "기타 (레트로 등)", c: ["Mr. Game & Watch", "로봇", "덕헌트", "팩맨", "스네이크", "소닉", "록맨", "Wii Fit 트레이너", "리틀 맥", "베요네타"] }
];

let quizQueue = [];
let currentIdx = 0;
let foundChars = []; // 현재 라운드에서 맞힌 캐릭터 인덱스 저장
let isFinished = false;
let dom = {};

window.onload = () => {
    dom = {
        title: document.getElementById('question-text'),
        input: document.getElementById('answer-input'),
        feedback: document.getElementById('feedback'),
        foundBox: document.getElementById('found-box'),
        actionBtn: document.getElementById('action-btn'),
        skipBtn: document.getElementById('skip-btn'),
        remain: document.getElementById('remain-num')
    };
    quizQueue = [...seriesData].sort(() => Math.random() - 0.5);
    loadRound();
};

function normalize(str) {
    // 공백, 슬래시, 앰퍼샌드 제거 후 소문자로 변환 (비교용)
    return str.replace(/[\s\/\&]+/g, '').toLowerCase();
}

function loadRound() {
    isFinished = false;
    foundChars = [];
    const current = quizQueue[currentIdx];
    dom.title.innerText = current.s;
    dom.input.disabled = false;
    dom.input.value = '';
    dom.input.focus();
    dom.actionBtn.innerText = "제출";
    dom.skipBtn.innerText = "넘기기 (포기)";
    dom.feedback.innerText = '';
    renderChips();
}

function renderChips() {
    const current = quizQueue[currentIdx];
    dom.foundBox.innerHTML = current.c.map((name, index) => {
        const isFound = foundChars.includes(index);
        return `<div class="char-chip ${isFound ? 'found' : ''}">${isFound ? name : '?'}</div>`;
    }).join('');
    dom.remain.innerText = `남은 파이터: ${current.c.length - foundChars.length}명`;
}

function handleAction() {
    if (isFinished) {
        nextRound();
        return;
    }
    const userVal = normalize(dom.input.value);
    if (!userVal) return;

    const current = quizQueue[currentIdx];
    let correctFound = false;

    current.c.forEach((officialName, index) => {
        if (foundChars.includes(index)) return;

        // "호무라 / 히카리" 같은 경우 ["호무라", "히카리"]로 분리해서 각각 체크
        const aliasList = officialName.split('/').map(n => normalize(n));
        const isCorrect = aliasList.some(alias => alias === userVal || normalize(officialName) === userVal);

        if (isCorrect) {
            foundChars.push(index);
            correctFound = true;
        }
    });

    if (correctFound) {
        dom.feedback.innerHTML = `<span style="color:#10b981">정답입니다!</span>`;
        renderChips();
        if (foundChars.length === current.c.length) endRound(true);
    } else {
        dom.feedback.innerHTML = `<span style="color:#ef4444">해당하는 파이터가 없거나 이미 맞혔습니다.</span>`;
    }
    dom.input.value = '';
}

function skipRound() {
    if (isFinished) nextRound();
    else if (confirm("이 시리즈의 정답을 모두 확인하시겠습니까?")) endRound(false);
}

function endRound(success) {
    isFinished = true;
    const current = quizQueue[currentIdx];
    // 모든 인덱스를 foundChars에 채움
    foundChars = current.c.map((_, i) => i);
    renderChips();
    dom.input.disabled = true;
    dom.feedback.innerHTML = success ? `<span style="color:#10b981; font-size:1.2rem">완벽하게 찾았습니다!</span>` : `<span style="color:#64748b">정답을 공개합니다.</span>`;
    dom.actionBtn.innerText = "다음 시리즈";
    dom.skipBtn.innerText = "다음으로";
}

function nextRound() {
    currentIdx++;
    if (currentIdx < quizQueue.length) loadRound();
    else { 
        alert("축하합니다! 대난투 모든 시리즈의 파이터를 섭렵하셨습니다."); 
        location.reload(); 
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAction();
});
// full-roster-v1
